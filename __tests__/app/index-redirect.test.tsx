import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react-native';
import React from 'react';

import Index from '@/app/index';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

import { router } from 'expo-router';

describe('Index redirect acceptance test', () => {
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

  it('redirects to login on mount', () => {
    render(<Index />);

    act(() => {
      jest.advanceTimersByTime(120);
    });

    expect(router.replace).toHaveBeenCalledWith('/login');
  });
});
