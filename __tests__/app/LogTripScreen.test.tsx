import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import LogTripScreen from '@/app/(tabs)/LogTripScreen';
import { TripsProvider } from '@/contexts/TripsContext';
import { useTripTracking } from '@/contexts/TripTrackingContext';

const mockUseTripTracking = useTripTracking as jest.Mock;

function renderWithTripsProvider() {
	return render(
		<TripsProvider>
			<LogTripScreen />
		</TripsProvider>
	);
}

describe('LogTripScreen acceptance tests', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.clearAllMocks();
		mockUseTripTracking.mockReturnValue({
			activeTrip: null,
			startTrip: jest.fn(),
			stopTrip: jest.fn(),
			pauseTrip: jest.fn(),
			resumeTrip: jest.fn(),
			isTracking: false,
			locationError: null,
			clearError: jest.fn(),
		});
	});

	afterEach(() => {
		act(() => {
			jest.runOnlyPendingTimers();
		});
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it('Scenario 1.1: renderiza seleção de transporte e botão iniciar viagem', () => {
		const { getByText, getByTestId } = renderWithTripsProvider();

		expect(getByText('🚌 Autocarro')).toBeTruthy();
		expect(getByText('🚇 Metro')).toBeTruthy();
		expect(getByTestId('start-trip-button')).toBeTruthy();
	});

	it('Scenario 1.2: abilita botão ao selecionar transporte', async () => {
		const { getByText, getByTestId } = renderWithTripsProvider();

		fireEvent.press(getByText('🚌 Autocarro'));

		await waitFor(() => {
			expect(getByTestId('start-trip-button').props.disabled).toBeFalsy();
		});
	});
});
