import { act, fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

import ChallengesScreen from '../app/(tabs)/challenge';
import FriendsScreen from '../app/(tabs)/invites';
import LogTripScreen from '../app/(tabs)/LogTripScreen';
import RegisterScreen from '../app/register';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

describe('Integration tests - component flows', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('Register success flow triggers router navigation through alert action', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByTestId } = render(<RegisterScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'up202012345@fe.up.pt');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.changeText(getByTestId('confirm-password-input'), 'password123');
    fireEvent.press(getByTestId('submit-button'));

    const buttons = alertSpy.mock.calls[0][2] as Array<{ text: string; onPress?: () => void }>;

    act(() => {
      buttons[0].onPress?.();
    });

    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    alertSpy.mockRestore();
  });

  it('LogTrip enables save button only when requirements are met', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<LogTripScreen />);

    fireEvent.press(getByText('Save Trip'));
    expect(queryByText('Trip logged successfully!')).toBeNull();

    fireEvent.changeText(getByPlaceholderText('Distance (km)'), '3.2');
    fireEvent.press(getByText('Save Trip'));
    expect(queryByText('Trip logged successfully!')).toBeNull();

    fireEvent.press(getByText('Bus'));
    fireEvent.press(getByText('Save Trip'));
    expect(getByText('Trip logged successfully!')).toBeTruthy();
  });

  it('Invites search flow integrates input, async search and request status', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<FriendsScreen />);

    fireEvent.changeText(getByPlaceholderText('Search by tag...'), 'user1');
    fireEvent.press(getByTestId('search-button'));

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(getByText('User1')).toBeTruthy();
    fireEvent.press(getByTestId('send-request-button'));
    expect(getByText('Pending')).toBeTruthy();
  });

  it('Challenge invite flow integrates challenge creation and friend invite', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByPlaceholderText, getByText, getByTestId } = render(<ChallengesScreen />);

    fireEvent.changeText(getByPlaceholderText('Challenge Name'), 'Maratona Verde');
    fireEvent.changeText(getByPlaceholderText('Start (DD/MM)'), '01/05');
    fireEvent.changeText(getByPlaceholderText('End (DD/MM)'), '31/05');
    fireEvent.press(getByText('Create Challenge'));

    fireEvent.press(getByTestId('invite-btn'));
    fireEvent.changeText(getByPlaceholderText('Search friend by tag...'), 'user1');
    fireEvent.press(getByTestId('search-friend-button'));
    fireEvent.press(getByTestId('confirm-invite-button'));

    expect(alertSpy).toHaveBeenCalledWith('Success', 'Invite to Maratona Verde sent to @user1_carbon');
    alertSpy.mockRestore();
  });
});
