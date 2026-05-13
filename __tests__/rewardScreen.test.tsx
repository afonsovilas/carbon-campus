import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React, { useEffect } from 'react';

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import RewardScreen from '../app/rewardScreen';
import { TripsProvider, useTrips } from '../contexts/TripsContext';

jest.mock('react-native-qrcode-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ value }: { value: string }) => <View testID={`qr-${value}`} />;
});

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

import * as Location from 'expo-location';

describe('RewardScreen acceptance tests', () => {
  function SeedTrips({ points }: { points: number }) {
    const { addTrip } = useTrips();

    useEffect(() => {
      addTrip({ id: 'trip-seed-1', mode: 'Bus', distance: 10, points, date: '21/4' });
      // Seed only once in tests.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  }

  const renderWithTrips = (seedPoints?: number) => render(
    <TripsProvider>
      {seedPoints ? <SeedTrips points={seedPoints} /> : null}
      <RewardScreen />
    </TripsProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows permission denied message when location permission is denied', async () => {
    (Location.requestForegroundPermissionsAsync as any).mockResolvedValue({ status: 'denied' });

    const { getByText } = renderWithTrips();

    await waitFor(() => {
      expect(getByText('Permissão de localização negada.')).toBeTruthy();
    });
  });

  it('shows QR code flow when user is at station and has enough points', async () => {
    (Location.requestForegroundPermissionsAsync as any).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as any).mockResolvedValue({
      coords: {
        latitude: 41.1517,
        longitude: -8.6096,
      },
    });

    const { getByText } = renderWithTrips(250);

    await waitFor(() => {
      expect(getByText('Bem-vindo!')).toBeTruthy();
    });

    fireEvent.press(getByText('Obter Código QR'));

    await waitFor(() => {
      expect(getByText('Mostra este código na loja:')).toBeTruthy();
    });
  });

  it('shows blocked reward state when user is far from station', async () => {
    (Location.requestForegroundPermissionsAsync as any).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as any).mockResolvedValue({
      coords: {
        latitude: 41.2,
        longitude: -8.7,
      },
    });

    const { getByText } = renderWithTrips();

    await waitFor(() => {
      expect(getByText('Aproxima-te da estação para desbloqueares a recompensa.')).toBeTruthy();
    });
  });
});
