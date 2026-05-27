import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import React, { useEffect } from 'react';
import { Text } from 'react-native';

jest.unmock('@/contexts/TripsContext');

jest.mock('@/services/auth.service', () => ({
  onAuthStateChange: jest.fn((cb: any) => {
    cb();
    return jest.fn(); // unsubscribe
  }),
}));

const mockSaveTrip = jest.fn().mockResolvedValue(undefined as never);
const mockFetchTrips = jest.fn().mockResolvedValue([] as never);

jest.mock('@/services/trips.service', () => ({
  saveTripToCloud: (...args: any[]) => mockSaveTrip(...args),
  fetchTripsFromCloud: () => mockFetchTrips(),
}));

jest.mock('@/services/leaderboard-events', () => ({
  emitLeaderboardRefresh: jest.fn(),
}));

import { Trip, TripsProvider, useTrips } from '@/contexts/TripsContext';

function SnapshotConsumer() {
  const { trips, tripsCount } = useTrips();

  return (
    <>
      <Text>{`count:${tripsCount}`}</Text>
      <Text>{`first:${trips[0]?.mode ?? 'none'}`}</Text>
    </>
  );
}

function SeedTrips({ tripsToSeed }: { tripsToSeed: Trip[] }) {
  const { addTrip } = useTrips();

  useEffect(() => {
    tripsToSeed.forEach((trip) => addTrip(trip));
    // Seed once to avoid re-adding trips on context-driven re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

describe('TripsContext unit tests', () => {
  it('throws when useTrips is called outside provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<SnapshotConsumer />)).toThrow('useTrips deve ser usado dentro de TripsProvider');

    consoleErrorSpy.mockRestore();
  });

  it('starts with empty trips state', async () => {
    render(
      <TripsProvider>
        <SnapshotConsumer />
      </TripsProvider>
    );

    const { waitFor } = require('@testing-library/react-native');
    await waitFor(() => {
      expect(screen.getByText('count:0')).toBeTruthy();
      expect(screen.getByText('first:none')).toBeTruthy();
    });
  });

  it('adds trips and keeps newest first', async () => {
    render(
      <TripsProvider>
        <SeedTrips
          tripsToSeed={[
            { id: '1', mode: 'Bus', distance: 2, points: 24, date: '1/4' },
            { id: '2', mode: 'Walking', distance: 1, points: 15, date: '2/4' },
          ]}
        />
        <SnapshotConsumer />
      </TripsProvider>
    );

    const { waitFor } = require('@testing-library/react-native');
    await waitFor(() => {
      expect(screen.getByText('count:2')).toBeTruthy();
      expect(screen.getByText('first:Walking')).toBeTruthy();
    });
  });

  it('fetches trips from cloud on mount', async () => {
    mockFetchTrips.mockResolvedValueOnce([
      { id: 'cloud-1', mode: 'Car', distance: 5, points: 5, date: '10/4' }
    ] as never);
    
    render(
      <TripsProvider>
        <SnapshotConsumer />
      </TripsProvider>
    );

    // Context will load cloud trips
    const { waitFor } = require('@testing-library/react-native');
    await waitFor(() => {
      expect(screen.getByText('count:1')).toBeTruthy();
      expect(screen.getByText('first:Car')).toBeTruthy();
    });
  });
});
