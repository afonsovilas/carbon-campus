import { onAuthStateChange } from '@/services/auth.service';
import { fetchTripsFromCloud, saveTripToCloud } from '@/services/trips.service';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Trip {
    id: string;
    mode: string;
    distance: number;
    points: number;
    date: string;
}

export interface TripsContextType {
    trips: Trip[];
    tripsCount: number;
    addTrip: (trip: Trip) => void;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export const TripsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }

        let mounted = true;

        const loadTrips = async () => {
            try {
                const cloudTrips = await fetchTripsFromCloud();
                if (mounted) {
                    setTrips(cloudTrips);
                }
            } catch (error) {
                console.warn('Failed to load trips from Firebase:', error);
            }
        };

        const unsubscribe = onAuthStateChange(() => {
            loadTrips();
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const addTrip = (trip: Trip) => {
        setTrips(prevTrips => [trip, ...prevTrips]);
        saveTripToCloud(trip).catch((error) => {
            console.warn('Failed to save trip to Firebase:', error);
        });
    };

    return (
        <TripsContext.Provider value={{ trips, tripsCount: trips.length, addTrip }}>
            {children}
        </TripsContext.Provider>
    );
};

export const useTrips = () => {
    const context = useContext(TripsContext);
    if (context === undefined) {
        throw new Error('useTrips deve ser usado dentro de TripsProvider');
    }
    return context;
};
