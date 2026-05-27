import { calculateTripPoints, TransportMode } from './functional-requirements';

export interface TripLocation {
    latitude: number;
    longitude: number;
    timestamp: number;
    isResumePoint?: boolean;
}

export interface ActiveTrip {
    id: string;
    startTime: number;
    locations: TripLocation[];
    transportMode: TransportMode;
    status: 'active' | 'paused' | 'completed';
    pausedAt?: number;
    distance: number;
}

export interface GTFSStop {
    stop_id: string;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    zone_id: string;
}

export interface GTFSRoute {
    stops: GTFSStop[];
    zone_id: string;
}

export interface TripResult {
    distance: number;
    points: number;
    carbonSaved: number;
    mode: TransportMode;
}

const EARTH_RADIUS_KM = 6371;
export const MAX_DEVIATION_METERS = 250;
const MIN_SPEED_MPS = 0.5;
const MAX_SPEED_MPS = 30;

export const msToKmh = (mps: number): number => mps * 3.6;

export const toRad = (degrees: number): number => {
    return (degrees * Math.PI) / 180;
};

export const calculateHaversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
};

export const findNearestStop = (
    location: TripLocation,
    stops: GTFSStop[]
): { stop: GTFSStop; distance: number } | null => {
    if (stops.length === 0) return null;

    let nearest: { stop: GTFSStop; distance: number } | null = null;

    stops.forEach((stop) => {
        const distance = calculateHaversineDistance(
            location.latitude,
            location.longitude,
            stop.stop_lat,
            stop.stop_lon
        );

        if (!nearest || distance < nearest.distance) {
            nearest = { stop, distance };
        }
    });

    return nearest;
};

export const isLocationOnRoute = (
    location: TripLocation,
    route: GTFSRoute
): boolean => {
    const nearest = findNearestStop(location, route.stops);
    if (!nearest) return false;

    const distanceMeters = nearest.distance * 1000;
    return distanceMeters <= MAX_DEVIATION_METERS;
};

export const calculateTotalDistance = (locations: TripLocation[]): number => {
    if (locations.length < 2) return 0;

    let distance = 0;
    for (let i = 1; i < locations.length; i++) {
        if (locations[i].isResumePoint) {
            continue; // Do not add distance if this is a point recorded immediately after a resume
        }
        distance += calculateHaversineDistance(
            locations[i - 1].latitude,
            locations[i - 1].longitude,
            locations[i].latitude,
            locations[i].longitude
        );
    }
    return distance;
};

export const calculateCarbonSaved = (
    distanceKm: number,
    transportMode: TransportMode
): number => {
    const carEmissionPerKm = 0.21;
    const busEmissionPerKm = 0.027;
    const metroEmissionPerKm = 0.016;

    let emission = carEmissionPerKm;
    if (transportMode === 'Bus') emission = busEmissionPerKm;
    else if (transportMode === 'Metro' || transportMode === 'Train') emission = metroEmissionPerKm;
    else if (transportMode === 'Electric Scooter') emission = 0.005;
    else if (transportMode === 'Bicycle' || transportMode === 'Walking') emission = 0;
    else if (transportMode === 'Car') emission = carEmissionPerKm;

    return (carEmissionPerKm - emission) * distanceKm;
};

export const calculatePointsFromCarbon = (carbonSavedKg: number): number => {
    const pointsPerKgCarbon = 50;
    return Math.round(carbonSavedKg * pointsPerKgCarbon);
};

export const validateTripData = (
    trip: ActiveTrip,
    route: GTFSRoute
): { valid: boolean; reason?: string } => {
    if (trip.locations.length < 2) {
        return { valid: false, reason: 'Insuficientes pontos de localização' };
    }

    const distance = calculateTotalDistance(trip.locations);
    if (distance < 0.3) {
        return { valid: false, reason: 'Distância muito curta' };
    }

    const onRouteLocations = trip.locations.filter((loc) =>
        isLocationOnRoute(loc, route)
    );
    const onRoutePercentage = onRouteLocations.length / trip.locations.length;

    if (onRoutePercentage < 0.6) {
        return {
            valid: false,
            reason: 'Viagem não seguiu a rota do transporte público',
        };
    }

    return { valid: true };
};

export const isValidSpeed = (
    location1: TripLocation,
    location2: TripLocation
): boolean => {
    const distance = calculateHaversineDistance(
        location1.latitude,
        location1.longitude,
        location2.latitude,
        location2.longitude
    );

    const timeDiffSeconds = (location2.timestamp - location1.timestamp) / 1000;
    if (timeDiffSeconds === 0) return true;

    const speedMps = (distance * 1000) / timeDiffSeconds;
    return speedMps >= MIN_SPEED_MPS && speedMps <= MAX_SPEED_MPS;
};
