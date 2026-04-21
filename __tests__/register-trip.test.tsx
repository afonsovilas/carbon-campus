import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import RegisterTripScreen from '../app/register-trip';

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

import { router } from 'expo-router';

describe('RegisterTripScreen acceptance tests', () => {
  const alertMock = jest.fn();

  beforeAll(() => {
    (global as any).alert = alertMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders static trip confirmation content', () => {
    const { getByText } = render(<RegisterTripScreen />);

    expect(getByText('➕ Registar Viagem')).toBeTruthy();
    expect(getByText('Modo: Autocarro')).toBeTruthy();
    expect(getByText('Distância: 2.3km')).toBeTruthy();
    expect(getByText('Pontos: +45')).toBeTruthy();
  });

  it('confirms register and navigates back', () => {
    const { getByText } = render(<RegisterTripScreen />);

    fireEvent(getByText('CONFIRMAR REGISTO'), 'touchEnd');

    expect(alertMock).toHaveBeenCalledWith('Viagem Autocarro +45 pts registada!');
    expect(router.back).toHaveBeenCalled();
  });
});
