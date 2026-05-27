import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor, act } from '@testing-library/react-native';
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
  const { isTracking, locationError, startTrip, stopTrip, pauseTrip, resumeTrip, activeTrip } = useTripTracking();

  return (
    <>
      <Text testID="tracking">{isTracking ? 'tracking' : 'idle'}</Text>
      <Text testID="error">{locationError ?? ''}</Text>
      <Text testID="status">{activeTrip?.status ?? 'none'}</Text>
      <Text testID="locs">{activeTrip?.locations.length ?? 0}</Text>
      <TouchableOpacity testID="start" onPress={() => startTrip('Bicycle')} />
      <TouchableOpacity testID="start-metro" onPress={() => startTrip('Metro')} />
      <TouchableOpacity testID="start-scooter" onPress={() => startTrip('Electric Scooter')} />
      <TouchableOpacity testID="stop" onPress={() => stopTrip()} />
      <TouchableOpacity testID="pause" onPress={() => pauseTrip()} />
      <TouchableOpacity testID="resume" onPress={() => resumeTrip()} />
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

  it('pauses and resumes an active trip', async () => {
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
      expect(getByTestId('status').props.children).toBe('active');
    });

    fireEvent.press(getByTestId('pause'));

    await waitFor(() => {
      expect(getByTestId('tracking').props.children).toBe('idle'); // isTracking becomes false
      expect(getByTestId('status').props.children).toBe('paused');
    });

    fireEvent.press(getByTestId('resume'));

    await waitFor(() => {
      expect(getByTestId('tracking').props.children).toBe('tracking'); // isTracking becomes true again
      expect(getByTestId('status').props.children).toBe('active');
    });
  });

  it('fails to start Metro trip if too far from station', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 41.1, longitude: -8.6 },
    });
    
    const utils = require('@/utils/trip-tracking');
    // distance is in km, max deviation is 250m. 1 km > 250m.
    utils.findNearestStop.mockReturnValueOnce({ distance: 1, stop: { stop_id: '1' } });

    const { getByTestId } = render(
      <TripTrackingProvider>
        <TripTrackingProbe />
      </TripTrackingProvider>
    );

    fireEvent.press(getByTestId('start-metro'));

    await waitFor(() => {
      expect(getByTestId('error').props.children).toContain('demasiado longe');
      expect(getByTestId('tracking').props.children).toBe('idle');
    });
  });

  it('invalidates scooter trip if speed exceeds limit during tracking', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 41.1, longitude: -8.6 },
    });
    
    // Capture the callback passed to watchPositionAsync
    let positionCallback: Function | null = null;
    Location.watchPositionAsync.mockImplementation((options: any, callback: Function) => {
      positionCallback = callback;
      return Promise.resolve({ remove: jest.fn() });
    });

    const { getByTestId } = render(
      <TripTrackingProvider>
        <TripTrackingProbe />
      </TripTrackingProvider>
    );

    fireEvent.press(getByTestId('start-scooter'));

    await waitFor(() => {
      expect(getByTestId('tracking').props.children).toBe('tracking');
    });

    // Simulate location update with excessive speed (>8.33 m/s)
    if (positionCallback) {
      act(() => {
        positionCallback!({ coords: { latitude: 41.1, longitude: -8.6, speed: 10 } });
      });
    }

    await waitFor(() => {
      expect(getByTestId('error').props.children).toContain('Velocidade excedeu');
      expect(getByTestId('tracking').props.children).toBe('idle');
    });
  });

  it('invalidates bicycle trip if average speed is too high on stop', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 41.1, longitude: -8.6 },
    });
    
    let positionCallback: Function | null = null;
    Location.watchPositionAsync.mockImplementation((options: any, callback: Function) => {
      positionCallback = callback;
      return Promise.resolve({ remove: jest.fn() });
    });

    const utils = require('@/utils/trip-tracking');
    utils.calculateTotalDistance.mockReturnValue(5); // 5km
    utils.calculateHaversineDistance = jest.fn(() => 0.1);

    const { getByTestId } = render(
      <TripTrackingProvider>
        <TripTrackingProbe />
      </TripTrackingProvider>
    );

    fireEvent.press(getByTestId('start')); // Bicycle

    await waitFor(() => {
      expect(getByTestId('tracking').props.children).toBe('tracking');
    });

    // Add a second location point to satisfy locations.length > 1
    if (positionCallback) {
      act(() => {
        positionCallback!({ coords: { latitude: 41.11, longitude: -8.61 } });
      });
    }

    await waitFor(() => {
      expect(getByTestId('locs').props.children).toBe(2);
    });

    // Stop immediately so time is close to 0, which gives huge avgSpeed
    fireEvent.press(getByTestId('stop'));

    await waitFor(() => {
      expect(getByTestId('error').props.children).toContain('Velocidade média excedeu');
    });
  });

  it('invalidates metro trip if route deviation is too high on stop', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 41.1, longitude: -8.6 },
    });
    
    let positionCallback: Function | null = null;
    Location.watchPositionAsync.mockImplementation((options: any, callback: Function) => {
      positionCallback = callback;
      return Promise.resolve({ remove: jest.fn() });
    });

    const utils = require('@/utils/trip-tracking');
    // Start is valid (distance 0)
    utils.findNearestStop.mockReturnValueOnce({ distance: 0, stop: { stop_id: '1' } });
    utils.calculateTotalDistance.mockReturnValue(1); // 1km

    const { getByTestId } = render(
      <TripTrackingProvider>
        <TripTrackingProbe />
      </TripTrackingProvider>
    );

    fireEvent.press(getByTestId('start-metro'));

    await waitFor(() => {
      expect(getByTestId('tracking').props.children).toBe('tracking');
    });

    // When stopping, findNearestStop is called for all points.
    // Return distance 1km (invalid) for all locations to make onRoutePercentage 0%
    utils.findNearestStop.mockReturnValue({ distance: 1, stop: { stop_id: '1' } });

    // Add a point to satisfy locations.length >= 2
    if (positionCallback) {
      act(() => {
        positionCallback!({ coords: { latitude: 41.11, longitude: -8.61 } });
      });
    }

    await waitFor(() => {
      expect(getByTestId('locs').props.children).toBe(2);
    });

    fireEvent.press(getByTestId('stop'));

    await waitFor(() => {
      expect(getByTestId('error').props.children).toContain('Viagem não seguiu a rota');
    });
  });

  it('stopTrip returns TripResult successfully', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 41.1, longitude: -8.6 },
    });
    Location.watchPositionAsync.mockResolvedValue({ remove: jest.fn() });

    const utils = require('@/utils/trip-tracking');
    utils.calculateTotalDistance.mockReturnValue(5); // 5km
    utils.calculateCarbonSaved.mockReturnValue(1.2);
    utils.calculatePointsFromCarbon.mockReturnValue(120);

    const { getByTestId } = render(
      <TripTrackingProvider>
        <TripTrackingProbe />
      </TripTrackingProvider>
    );

    fireEvent.press(getByTestId('start')); // Bicycle

    await waitFor(() => {
      expect(getByTestId('tracking').props.children).toBe('tracking');
    });

    // We don't add locations so avgSpeed validation won't fail (locations.length = 1)
    let result: any;
    const { result: hookResult } = require('@testing-library/react-native').renderHook(() => {
      return require('@/contexts/TripTrackingContext').useTripTracking();
    }, { wrapper: TripTrackingProvider });

    // Mock start first to set active trip directly via hook
    await act(async () => {
      await hookResult.current.startTrip('Bicycle');
    });
    await act(async () => {
      result = await hookResult.current.stopTrip();
    });

    expect(result).toEqual({
      distance: 5,
      points: 120,
      carbonSaved: 1.2,
      mode: 'Bicycle'
    });
  });

  it('updates location after resumeTrip and clearError works', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: 41.1, longitude: -8.6 },
    });
    
    let positionCallback: Function | null = null;
    Location.watchPositionAsync.mockImplementation((options: any, callback: Function) => {
      positionCallback = callback;
      return Promise.resolve({ remove: jest.fn() });
    });

    const { getByTestId, getByText } = render(
      <TripTrackingProvider>
        <TripTrackingProbe />
        <ClearErrorProbe />
      </TripTrackingProvider>
    );

    fireEvent.press(getByTestId('start'));
    await waitFor(() => expect(getByTestId('tracking').props.children).toBe('tracking'));
    
    // Create an error to clear later
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
    fireEvent.press(getByTestId('start-metro')); // throws error
    await waitFor(() => expect(getByTestId('error').props.children).toContain('Permissão'));
    
    fireEvent.press(getByTestId('clear-err'));
    await waitFor(() => expect(getByTestId('error').props.children).toBe(''));

    fireEvent.press(getByTestId('pause'));
    await waitFor(() => expect(getByTestId('tracking').props.children).toBe('idle'));

    fireEvent.press(getByTestId('resume'));
    await waitFor(() => expect(getByTestId('tracking').props.children).toBe('tracking'));

    // update location after resume
    if (positionCallback) {
      act(() => {
        positionCallback!({ coords: { latitude: 41.11, longitude: -8.61 } });
      });
    }

    await waitFor(() => {
      expect(getByTestId('locs').props.children).toBe(2);
    });
  });

  it('throws if useTripTracking is outside provider', () => {
    const { useTripTracking } = require('@/contexts/TripTrackingContext');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const Probe = () => { useTripTracking(); return null; };
    expect(() => render(<Probe />)).toThrow('useTripTracking deve ser usado dentro de TripTrackingProvider');
    consoleErrorSpy.mockRestore();
  });
});

function ClearErrorProbe() {
  const { clearError } = require('@/contexts/TripTrackingContext').useTripTracking();
  return <TouchableOpacity testID="clear-err" onPress={clearError} />;
}
