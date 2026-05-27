import { describe, expect, it, jest } from '@jest/globals';
import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import RootLayout from '../app/_layout';

const mockReplace = jest.fn();
const mockUnsub = jest.fn();
const mockOnAuthStateChange = jest.fn((cb: (uid: string | null) => void) => {
  cb(null);
  return mockUnsub;
});

jest.mock('@/contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/contexts/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/contexts/DrawerContext', () => ({
  DrawerProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/contexts/TripTrackingContext', () => ({
  TripTrackingProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/contexts/TripsContext', () => ({
  TripsProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/services/auth.service', () => ({
  onAuthStateChange: (cb: (uid: string | null) => void) => mockOnAuthStateChange(cb),
}));

jest.mock('expo-router', () => {
  const React = require('react');
  const Stack = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  Stack.Screen = jest.fn(() => null);

  return {
    Stack,
    useRouter: () => ({ replace: mockReplace }),
    usePathname: () => '/dashboard',
  };
});

describe('RootLayout', () => {
  it('redirects to login when unauthenticated', async () => {
    render(<RootLayout />);

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });
});
