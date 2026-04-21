import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import LoginScreen from '../app/login';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

import { router } from 'expo-router';

describe('LoginScreen acceptance tests', () => {
  let alertSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders login fields and actions', () => {
    const { getByTestId, getByText } = render(<LoginScreen />);

    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('submit-button')).toBeTruthy();
    expect(getByTestId('register-link')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
  });

  it('logs in with valid credentials and navigates to tabs', () => {
    const { getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'teste@up.pt');
    fireEvent.changeText(getByTestId('password-input'), '1234');
    fireEvent.press(getByTestId('submit-button'));

    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('shows validation error for missing credentials', () => {
    const { getByTestId } = render(<LoginScreen />);

    fireEvent.press(getByTestId('submit-button'));

    expect(alertSpy).toHaveBeenCalledWith('Erro', 'Preenche todos os campos');
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('shows invalid credentials error', () => {
    const { getByTestId } = render(<LoginScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'x@y.com');
    fireEvent.changeText(getByTestId('password-input'), 'wrong');
    fireEvent.press(getByTestId('submit-button'));

    expect(alertSpy).toHaveBeenCalledWith('Erro', 'Email ou password incorretos');
    expect(router.replace).not.toHaveBeenCalled();
  });
});
