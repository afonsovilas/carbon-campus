import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import LogTripScreen from '../app/(tabs)/LogTripScreen';

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
		const { getByText, getByPlaceholderText, queryByText } = render(<LogTripScreen />);

		// Select a valid transport mode required by the happy path.
		fireEvent.press(getByText('Bicycle'));
		fireEvent.changeText(getByPlaceholderText('Distance (km)'), '5');
		fireEvent.press(getByText('Save Trip'));

		expect(getByText('Trip logged successfully!')).toBeTruthy();
		expect(queryByText('Please enter a valid distance greater than 0')).toBeNull();
	});

	it('Scenario 1.2: shows validation error for invalid distance and does not show success', () => {
		const { getByText, getByPlaceholderText, queryByText } = render(<LogTripScreen />);

		fireEvent.changeText(getByPlaceholderText('Distance (km)'), '-2');
		fireEvent.press(getByText('Save Trip'));

		expect(getByText('Please enter a valid distance greater than 0')).toBeTruthy();
		expect(queryByText('Trip logged successfully!')).toBeNull();
	});
});
