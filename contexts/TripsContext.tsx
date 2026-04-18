import React, { createContext, useContext, useState } from 'react';

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

    const addTrip = (trip: Trip) => {
        setTrips(prevTrips => [trip, ...prevTrips]);
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
