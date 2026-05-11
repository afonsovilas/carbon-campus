import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import SideDrawer from '../components/SideDrawer';

const mockClose  = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('@/contexts/DrawerContext', () => ({
    useDrawer: () => ({
        isOpen: true,
        close: mockClose,
    }),
}));

jest.mock('@/contexts/UserContext', () => ({
    useUser: () => ({
        user: {
            name: 'Gui',
            tag: '@gui',
            avatarEmoji: ':)',
            course: 'Engenharia Informática',
        },
    }),
}));

jest.mock('@/services/auth.service', () => ({
    signOutUser: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: mockReplace,
    }),
}));

describe('SideDrawer', () => {
    beforeEach(() => {
        mockClose.mockClear();
        mockPush.mockClear();
        mockReplace.mockClear();
        jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders only Manage Accounts and Log Out options', () => {
        const { getByTestId, queryByText } = render(<SideDrawer />);

        expect(getByTestId('drawer-manage-accounts')).toBeTruthy();
        expect(getByTestId('drawer-log-out')).toBeTruthy();

        // Ensure old actions are not present anymore.
        expect(queryByText('Convidar para a app')).toBeNull();
        expect(queryByText('Convidar para desafio')).toBeNull();
    });

    it('goes to profile from Manage Accounts', () => {
        const { getByTestId } = render(<SideDrawer />);

        fireEvent.press(getByTestId('drawer-manage-accounts'));

        expect(mockClose).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith('/profile');
    });

    it('confirms and logs out to login route', () => {
        const { getByTestId } = render(<SideDrawer />);

        fireEvent.press(getByTestId('drawer-log-out'));

        const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
        const buttons = alertCall[2] as Array<{ text: string; onPress?: () => void }>;
        const logOutButton = buttons.find((button) => button.text === 'Sair');

        expect(logOutButton).toBeTruthy();
        return act(async () => {
            await logOutButton?.onPress?.();
        }).then(() =>
            waitFor(() => {
                expect(mockClose).toHaveBeenCalledTimes(1);
                expect(mockReplace).toHaveBeenCalledWith('/login');
            })
        );
    });
});

