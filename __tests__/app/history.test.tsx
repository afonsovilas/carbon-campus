import React, { useEffect } from 'react';
import { render } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';
import HistoryScreen from '@/app/(tabs)/history';
import { TripsProvider, useTrips } from '@/contexts/TripsContext';

jest.mock('@expo/vector-icons', () => ({
    Ionicons: () => {
        const React = require('react');
        const { View } = require('react-native');
        return React.createElement(View, { testID: 'mock-ionicon' });
    },
}));

function SeedOneTrip() {
    const { addTrip } = useTrips();

    useEffect(() => {
        addTrip({ id: 'trip-1', mode: 'Bus', distance: 2.5, points: 30, date: '21/4' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

describe('HistoryScreen acceptance tests', () => {
    it('shows empty state when no trips are logged', async () => {
        const { findByText } = render(
            <TripsProvider>
                <HistoryScreen />
            </TripsProvider>
        );

        expect(await findByText('Nenhuma viagem registada ainda')).toBeTruthy();
    });

    it('shows trip entries after logging trips', async () => {
        const { findByText } = render(
            <TripsProvider>
                <SeedOneTrip />
                <HistoryScreen />
            </TripsProvider>
        );

        expect(await findByText(/Autocarro.*2\.50km/)).toBeTruthy();
        expect(await findByText('+30 pts • 21/4')).toBeTruthy();
    });
});
