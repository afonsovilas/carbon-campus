import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

describe('Collapsible', () => {
  it('toggles children visibility', () => {
    const { getByText, queryByText } = render(
      <Collapsible title="Section">
        <Text>Content</Text>
      </Collapsible>
    );

    expect(queryByText('Content')).toBeNull();

    fireEvent.press(getByText('Section'));

    expect(getByText('Content')).toBeTruthy();
  });
});
