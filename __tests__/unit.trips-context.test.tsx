import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import React, { useEffect } from 'react';
import { Text } from 'react-native';

import { Trip, TripsProvider, useTrips } from '../contexts/TripsContext';

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
  it('starts with empty trips state', () => {
    render(
      <TripsProvider>
        <SnapshotConsumer />
      </TripsProvider>
    );

    expect(screen.getByText('count:0')).toBeTruthy();
    expect(screen.getByText('first:none')).toBeTruthy();
  });

  it('adds trips and keeps newest first', () => {
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

    expect(screen.getByText('count:2')).toBeTruthy();
    expect(screen.getByText('first:Walking')).toBeTruthy();
  });
});
