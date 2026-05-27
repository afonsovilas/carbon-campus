import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import RegisterTripScreen from '@/app/register-trip';
import { router, useLocalSearchParams } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({
    distance: '2.3',
    points: '45',
    mode: 'Bus',
  })),
}));

const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockRouter = router as jest.Mocked<typeof router>;

describe('RegisterTripScreen acceptance tests', () => {
  const alertMock = jest.fn();

  beforeAll(() => {
    (global as any).alert = alertMock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({
      distance: '2.3',
      points: '45',
      mode: 'Bus',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders static trip confirmation content', () => {
    const { getByText } = render(<RegisterTripScreen />);

    expect(getByText('➕ Registar Viagem')).toBeTruthy();
    expect(getByText('🚌 Modo: Autocarro')).toBeTruthy();
    expect(getByText('📏 Distância: 2.3km')).toBeTruthy();
    expect(getByText('⭐ Pontos: +45')).toBeTruthy();
  });

  it('confirms register and navigates back', async () => {
    const { getByText } = render(<RegisterTripScreen />);

    fireEvent.press(getByText('CONFIRMAR REGISTO'));

    expect(alertMock).toHaveBeenCalledWith('Viagem Autocarro +45 pts registada!');
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('navegates back when clicking back button', async () => {
    const { getByText } = render(<RegisterTripScreen />);

    fireEvent.press(getByText('← Voltar'));

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('renders metro mode correctly', () => {
    mockUseLocalSearchParams.mockReturnValue({
      distance: '5.0',
      points: '75',
      mode: 'Metro',
    });

    const { getByText } = render(<RegisterTripScreen />);

    expect(getByText('🚇 Modo: Metro')).toBeTruthy();
  });
});
