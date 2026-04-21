import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import HomeScreen from '../app/(tabs)/index';

const mockPush = jest.fn();

jest.mock('expo-router', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Link: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    useRouter: () => ({ push: mockPush }),
  };
});

describe('HomeScreen acceptance tests', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders dashboard CTA elements', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('🌿 CarbonCampus')).toBeTruthy();
    expect(getByText('Reduz a pegada de carbono')).toBeTruthy();
    expect(getByText('➕ Registar Viagem')).toBeTruthy();
    expect(getByText('🏆 Ranking')).toBeTruthy();
  });

  it('navigates to LogTrip and Rankings from main buttons', () => {
    const { getByText } = render(<HomeScreen />);

    fireEvent.press(getByText('➕ Registar Viagem'));
    fireEvent.press(getByText('🏆 Ranking'));

    expect(mockPush).toHaveBeenCalledWith('/(tabs)/LogTripScreen');
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/rankings');
  });
});
