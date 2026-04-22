import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, act } from '@testing-library/react-native';
import React from 'react';

import ProfileButton from '../components/ProfileButton';

const mockToggle = jest.fn();

jest.mock('@/contexts/DrawerContext', () => ({
    useDrawer: () => ({
        toggle: mockToggle,
    }),
}));

describe('ProfileButton', () => {
    beforeEach(() => {
        mockToggle.mockClear();
    });

    it('opens the drawer when pressing the three-dots button', async() => {
        const { getByTestId } = render(<ProfileButton />);

        await act(async () => {
            fireEvent.press(getByTestId('open-drawer-button'));
        });
        expect(mockToggle).toHaveBeenCalledTimes(1);
    });
});

