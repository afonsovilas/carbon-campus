import React, { createContext, useContext, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import {
    ActiveTrip,
    TripLocation,
    TripResult,
    calculateTotalDistance,
    calculateCarbonSaved,
    calculatePointsFromCarbon,
    findNearestStop,
    MAX_DEVIATION_METERS,
} from '@/utils/trip-tracking';
import { METRO_STOPS } from '@/utils/gtfs-data';

import { TransportMode } from '@/utils/functional-requirements';

interface TripTrackingContextType {
    activeTrip: ActiveTrip | null;
    startTrip: (transportMode: TransportMode) => Promise<void>;
    stopTrip: () => Promise<TripResult | null>;
    pauseTrip: () => void;
    resumeTrip: () => Promise<void>;
    isTracking: boolean;
    locationError: string | null;
    clearError: () => void;
}

const TripTrackingContext = createContext<TripTrackingContextType | undefined>(
    undefined
);

export const TripTrackingProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                                  children,
                                                                              }) => {
    const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [locationSubscription, setLocationSubscription] = useState<any>(null);

    const startTrip = useCallback(
        async (transportMode: TransportMode) => {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setLocationError('Permissão de localização negada');
                    return;
                }

                const initialLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

                const startLocation: TripLocation = {
                    latitude: initialLocation.coords.latitude,
                    longitude: initialLocation.coords.longitude,
                    timestamp: Date.now(),
                };

                if (transportMode === 'Metro' || transportMode === 'Bus') {
                    const nearestStop = findNearestStop(startLocation, METRO_STOPS);
                    if (!nearestStop || (nearestStop.distance * 1000) > MAX_DEVIATION_METERS) {
                        setLocationError(`Estás demasiado longe de uma estação (max ${MAX_DEVIATION_METERS}m). Aproxima-te para iniciar a viagem.`);
                        return;
                    }
                }

                const newTrip: ActiveTrip = {
                    id: `trip-${Date.now()}`,
                    startTime: Date.now(),
                    locations: [startLocation],
                    transportMode,
                    status: 'active',
                };

                setActiveTrip(newTrip);
                setIsTracking(true);
                setLocationError(null);

                const subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 5000,
                        distanceInterval: 10,
                    },
                    (location) => {
                        const speed = location.coords.speed || 0;
                        if (transportMode === 'Electric Scooter' && speed > 8.33) {
                            setLocationError('Velocidade excedeu 30 km/h na Trotinete. A viagem foi invalidada.');
                            setActiveTrip(null);
                            if (subscription) subscription.remove();
                            setIsTracking(false);
                            return;
                        }

                        setActiveTrip((prevTrip) => {
                            if (!prevTrip) return null;

                            const newLocation: TripLocation = {
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                timestamp: Date.now(),
                            };

                            return {
                                ...prevTrip,
                                locations: [...prevTrip.locations, newLocation],
                            };
                        });
                    }
                );

                setLocationSubscription(subscription);
            } catch (error) {
                setLocationError('Erro ao iniciar rastreamento');
            }
        },
        []
    );

    const stopTrip = useCallback(async () => {
        if (!activeTrip) return null;

        if (locationSubscription) {
            locationSubscription.remove();
            setLocationSubscription(null);
        }

        setIsTracking(false);

        const distance = calculateTotalDistance(activeTrip.locations);

        if (activeTrip.transportMode === 'Metro' || activeTrip.transportMode === 'Bus') {
            const onRouteLocations = activeTrip.locations.filter((loc) => {
                const nearest = findNearestStop(loc, METRO_STOPS);
                return nearest && (nearest.distance * 1000) <= MAX_DEVIATION_METERS;
            });
            const onRoutePercentage = activeTrip.locations.length > 0 ? onRouteLocations.length / activeTrip.locations.length : 0;
            if (activeTrip.locations.length >= 2 && onRoutePercentage < 0.6) {
                setLocationError('Viagem não seguiu a rota do transporte público. Viagem invalidada.');
                setActiveTrip(null);
                return null;
            }
        } else if (activeTrip.transportMode === 'Bicycle' && activeTrip.locations.length > 1) {
            const timeDiffSeconds = (Date.now() - activeTrip.startTime) / 1000;
            const avgSpeedMps = timeDiffSeconds > 0 ? (distance * 1000) / timeDiffSeconds : 0;
            if (avgSpeedMps > 8.33) {
                setLocationError('Velocidade média excedeu 30 km/h de Bicicleta. Viagem invalidada.');
                setActiveTrip(null);
                return null;
            }
        }

        const carbonSaved = calculateCarbonSaved(distance, activeTrip.transportMode);
        const points = calculatePointsFromCarbon(carbonSaved);
        const mode = activeTrip.transportMode;

        setActiveTrip(null);

        return { distance, points, carbonSaved, mode };
    }, [activeTrip, locationSubscription]);

    const pauseTrip = useCallback(() => {
        if (!activeTrip) return;
        setActiveTrip({ ...activeTrip, status: 'paused' });
        setIsTracking(false);
        if (locationSubscription) {
            locationSubscription.remove();
        }
    }, [activeTrip, locationSubscription]);

    const resumeTrip = useCallback(async () => {
        if (!activeTrip) return;
        setActiveTrip({ ...activeTrip, status: 'active' });
        setIsTracking(true);

        const subscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 5000,
                distanceInterval: 10,
            },
            (location) => {
                setActiveTrip((prevTrip) => {
                    if (!prevTrip) return null;

                    const newLocation: TripLocation = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        timestamp: Date.now(),
                    };

                    return {
                        ...prevTrip,
                        locations: [...prevTrip.locations, newLocation],
                    };
                });
            }
        );

        setLocationSubscription(subscription);
    }, [activeTrip]);

    const clearError = useCallback(() => {
        setLocationError(null);
    }, []);

    return (
        <TripTrackingContext.Provider
            value={{
                activeTrip,
                startTrip,
                stopTrip,
                pauseTrip,
                resumeTrip,
                isTracking,
                locationError,
                clearError,
            }}
        >
            {children}
        </TripTrackingContext.Provider>
    );
};

export const useTripTracking = () => {
    const context = useContext(TripTrackingContext);
    if (!context) {
        throw new Error(
            'useTripTracking deve ser usado dentro de TripTrackingProvider'
        );
    }
    return context;
};
