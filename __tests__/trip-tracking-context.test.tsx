import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

jest.unmock('@/contexts/TripTrackingContext');

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  Accuracy: { High: 3 },
}));

jest.mock('@/utils/gtfs-data', () => ({
  METRO_STOPS: [],
}));

jest.mock('@/utils/trip-tracking', () => ({
  calculateTotalDistance: jest.fn(() => 1),
  calculateCarbonSaved: jest.fn(() => 1),
  calculatePointsFromCarbon: jest.fn(() => 50),
  findNearestStop: jest.fn(() => ({ distance: 0, stop: { stop_id: '1' } })),
  MAX_DEVIATION_METERS: 100,
}));

const Location = require('expo-location');
const { TripTrackingProvider, useTripTracking } = require('@/contexts/TripTrackingContext');

function TripTrackingProbe() {
  const { isTracking, locationError, startTrip, stopTrip } = useTripTracking();

  return (
    <>
      <Text testID="tracking">{isTracking ? 'tracking' : 'idle'}</Text>
      <Text testID="error">{locationError ?? ''}</Text>
      <TouchableOpacity testID="start" onPress={() => startTrip('Bicycle')} />
      <TouchableOpacity testID="stop" onPress={() => stopTrip()} />
    </>
  );
}

describe('TripTrackingContext', () => {
  it('sets error when permission denied', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

    const { getByTestId } = render(
      <TripTrackingProvider>
        <TripTrackingProbe />
      </TripTrackingProvider>
    );

    fireEvent.press(getByTestId('start'));

    await waitFor(() => {
      expect(getByTestId('error').props.children).toContain('Permissão');
    });
  });

  it('starts tracking when permission granted', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 41.1, longitude: -8.6 },
    });
    Location.watchPositionAsync.mockResolvedValue({ remove: jest.fn() });

    const { getByTestId } = render(
      <TripTrackingProvider>
        <TripTrackingProbe />
      </TripTrackingProvider>
    );

    fireEvent.press(getByTestId('start'));

    await waitFor(() => {
      expect(getByTestId('tracking').props.children).toBe('tracking');
    });
  });

  it('stopTrip returns null when no active trip', async () => {
    const { getByTestId } = render(
      <TripTrackingProvider>
        <TripTrackingProbe />
      </TripTrackingProvider>
    );

    fireEvent.press(getByTestId('stop'));

    await waitFor(() => {
      expect(getByTestId('tracking').props.children).toBe('idle');
    });
  });
});
