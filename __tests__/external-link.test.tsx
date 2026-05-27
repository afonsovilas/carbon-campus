import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';


const mockOpen = jest.fn();

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: (...args: any[]) => mockOpen(...args),
  WebBrowserPresentationStyle: { AUTOMATIC: 'automatic' },
}));

jest.mock('expo-router', () => ({
  Link: ({ children, onPress }: { children: React.ReactNode; onPress?: (event: any) => void }) => {
    const { Text } = require('react-native');
    return (
      <Text onPress={() => onPress?.({ preventDefault: jest.fn() })}>{children}</Text>
    );
  },
}));

describe('ExternalLink', () => {
  const originalOs = process.env.EXPO_OS;
  const getExternalLink = () => require('../components/external-link').ExternalLink;

  beforeEach(() => {
    mockOpen.mockClear();
  });

  afterAll(() => {
    process.env.EXPO_OS = originalOs;
  });

  it('calls openBrowserAsync on native', () => {
    process.env.EXPO_OS = 'ios';
    jest.resetModules();
    const ExternalLink = getExternalLink();
    const { getByText } = render(
      <ExternalLink href="https://example.com">Link</ExternalLink>
    );

    fireEvent.press(getByText('Link'));
    expect(mockOpen).toHaveBeenCalled();
  });
});
