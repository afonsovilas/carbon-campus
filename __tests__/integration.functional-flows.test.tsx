import { act, fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

import ChallengesScreen from '../app/(tabs)/challenge';
import FriendsScreen from '../app/(tabs)/invites';
import LogTripScreen from '../app/(tabs)/LogTripScreen';
import RegisterScreen from '../app/register';
import { TripsProvider } from '../contexts/TripsContext';

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
    fireEvent.press(getByTestId('course-picker-button'));
    fireEvent.press(getByTestId('course-option-LEIC'));
    fireEvent.press(getByTestId('submit-button'));

    const buttons = alertSpy.mock.calls[0][2] as Array<{ text: string; onPress?: () => void }>;

    act(() => {
      buttons[0].onPress?.();
    });

    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    alertSpy.mockRestore();
  });

  it('LogTrip enables save button only when requirements are met', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(
      <TripsProvider>
        <LogTripScreen />
      </TripsProvider>
    );

    fireEvent.press(getByText('Guardar Viagem'));
    expect(queryByText('Viagem registada com sucesso!')).toBeNull();

    fireEvent.changeText(getByPlaceholderText('Distância (km)'), '3.2');
    fireEvent.press(getByText('Guardar Viagem'));
    expect(queryByText('Viagem registada com sucesso!')).toBeNull();

    fireEvent.press(getByText('Autocarro'));
    fireEvent.press(getByText('Guardar Viagem'));
    expect(getByText('Viagem registada com sucesso!')).toBeTruthy();
  });

  it('Invites search flow integrates input, async search and request status', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<FriendsScreen />);

    fireEvent.changeText(getByPlaceholderText('Procurar por tag...'), 'user1');
    fireEvent.press(getByTestId('search-button'));

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(getByText('User1')).toBeTruthy();
    fireEvent.press(getByTestId('send-request-button'));
    expect(getByText('Pendente')).toBeTruthy();
  });

  it('Challenge invite flow integrates challenge creation and friend invite', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByPlaceholderText, getByText, getByTestId } = render(<ChallengesScreen />);

    fireEvent.changeText(getByPlaceholderText('Nome do Desafio'), 'Maratona Verde');
    fireEvent.changeText(getByPlaceholderText('Início (DD/MM)'), '01/05');
    fireEvent.changeText(getByPlaceholderText('Fim (DD/MM)'), '31/05');
    fireEvent.press(getByText('Criar Desafio'));

    fireEvent.press(getByTestId('invite-btn'));
    fireEvent.changeText(getByPlaceholderText('Procurar amigo por tag...'), 'user1');
    fireEvent.press(getByTestId('search-friend-button'));
    fireEvent.press(getByTestId('confirm-invite-button'));

    expect(alertSpy).toHaveBeenCalledWith('Sucesso', 'Convite para Maratona Verde enviado para @user1_carbon');
    alertSpy.mockRestore();
  });
});
