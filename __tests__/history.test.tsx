import { render } from '@testing-library/react-native';
import React, { useEffect } from 'react';

import { describe, expect, it } from '@jest/globals';
import HistoryScreen from '../app/(tabs)/history';
import { TripsProvider, useTrips } from '../contexts/TripsContext';

function SeedOneTrip() {
  const { addTrip } = useTrips();

  useEffect(() => {
    addTrip({ id: 'trip-1', mode: 'Bus', distance: 2.5, points: 30, date: '21/4' });
    // Seed only once to avoid loops from changing function identities.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

describe('HistoryScreen acceptance tests', () => {
  it('shows empty state when no trips are logged', () => {
    const { getByText } = render(
      <TripsProvider>
        <HistoryScreen />
      </TripsProvider>
    );

    expect(getByText('Nenhuma viagem registada ainda')).toBeTruthy();
  });

  it('shows trip entries after logging trips', () => {
    const { getByText } = render(
      <TripsProvider>
        <SeedOneTrip />
        <HistoryScreen />
      </TripsProvider>
    );

    expect(getByText(/Autocarro.*2\.5km/)).toBeTruthy();
    expect(getByText('+30 pts • 21/4')).toBeTruthy();
  });
});
