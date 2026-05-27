import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React from 'react';

import TabLayout from '../app/(tabs)/_layout';

jest.mock('expo-router', () => {
  const React = require('react');
  const screenSpy = jest.fn(() => null);
  const Tabs = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  Tabs.Screen = screenSpy;

  return {
    Tabs,
    __screenSpy: screenSpy,
  };
});

jest.mock('@/components/ProfileButton', () => () => null);

jest.mock('@/components/SideDrawer', () => () => {
  const { View } = require('react-native');
  return <View testID="side-drawer" />;
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

describe('Tabs layout', () => {
  it('renders side drawer and registers tabs', () => {
    const { getByTestId } = render(<TabLayout />);
    const { __screenSpy } = require('expo-router');

    expect(getByTestId('side-drawer')).toBeTruthy();
    expect(__screenSpy).toHaveBeenCalledTimes(6);
  });
});
