import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import React from 'react';

import TabLayout from '@/app/(tabs)/_layout';

jest.mock('expo-router', () => {
  const React = require('react');
  const screenSpy = jest.fn(() => null);
  const tabsSpy = jest.fn(({ children }: any) => <>{children}</>);
  const Tabs = tabsSpy as any;
  Tabs.Screen = screenSpy;

  return {
    Tabs,
    __screenSpy: screenSpy,
    __tabsSpy: tabsSpy,
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

  it('renders tab icons and headerRight correctly', () => {
    render(<TabLayout />);
    const { __screenSpy, __tabsSpy } = require('expo-router');
    
    // Call headerRight
    const screenOptions = __tabsSpy.mock.calls[0][0].screenOptions;
    const HeaderRight = screenOptions.headerRight;
    render(<HeaderRight tintColor="#000" />);

    // Call tabBarIcon for all screens
    __screenSpy.mock.calls.forEach((call: any) => {
      const TabIcon = call[0].options.tabBarIcon;
      if (TabIcon) {
        render(<TabIcon color="#000" size={24} />);
      }
    });
  });
});
