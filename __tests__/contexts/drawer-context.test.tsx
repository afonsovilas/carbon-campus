import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { DrawerProvider, useDrawer } from '@/contexts/DrawerContext';

function DrawerProbe() {
  const { isOpen, toggle, open, close } = useDrawer();

  return (
    <>
      <Text testID="state">{isOpen ? 'open' : 'closed'}</Text>
      <TouchableOpacity testID="toggle" onPress={toggle} />
      <TouchableOpacity testID="open" onPress={open} />
      <TouchableOpacity testID="close" onPress={close} />
    </>
  );
}

describe('DrawerContext', () => {
  it('starts closed', () => {
    const { getByTestId } = render(
      <DrawerProvider>
        <DrawerProbe />
      </DrawerProvider>
    );

    expect(getByTestId('state').props.children).toBe('closed');
  });

  it('opens and closes via actions', () => {
    const { getByTestId } = render(
      <DrawerProvider>
        <DrawerProbe />
      </DrawerProvider>
    );

    fireEvent.press(getByTestId('open'));
    expect(getByTestId('state').props.children).toBe('open');

    fireEvent.press(getByTestId('close'));
    expect(getByTestId('state').props.children).toBe('closed');
  });

  it('toggles state', () => {
    const { getByTestId } = render(
      <DrawerProvider>
        <DrawerProbe />
      </DrawerProvider>
    );

    fireEvent.press(getByTestId('toggle'));
    expect(getByTestId('state').props.children).toBe('open');

    fireEvent.press(getByTestId('toggle'));
    expect(getByTestId('state').props.children).toBe('closed');
  });
});
