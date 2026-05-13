import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import LogTripScreen from '../app/(tabs)/LogTripScreen';
import { TripsProvider } from '../contexts/TripsContext';

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
	});

	afterEach(() => {
		act(() => {
			jest.runOnlyPendingTimers();
		});
		jest.useRealTimers();
	});

	it('Scenario 1.1: logs a trip successfully with valid input', () => {
		const { getByText, getByPlaceholderText, queryByText } = renderWithTripsProvider();

		// Select a valid transport mode required by the happy path.
		fireEvent.press(getByText('Bicicleta'));
		fireEvent.changeText(getByPlaceholderText('Distância (km)'), '5');
		fireEvent.press(getByText('Guardar Viagem'));

		expect(getByText('Viagem registada com sucesso!')).toBeTruthy();
		expect(queryByText('Insere uma distância válida maior que 0')).toBeNull();
	});

	it('Scenario 1.2: shows validation error for invalid distance and does not show success', () => {
		const { getByText, getByPlaceholderText, queryByText } = renderWithTripsProvider();

		fireEvent.changeText(getByPlaceholderText('Distância (km)'), '-2');
		fireEvent.press(getByText('Guardar Viagem'));

		expect(getByText('Insere uma distância válida maior que 0')).toBeTruthy();
		expect(queryByText('Viagem registada com sucesso!')).toBeNull();
	});
});
