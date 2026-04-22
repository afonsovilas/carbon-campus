import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import SideDrawer from '../components/SideDrawer';

const closeMock = jest.fn();
const pushMock = jest.fn();
const replaceMock = jest.fn();

jest.mock('@/contexts/DrawerContext', () => ({
    useDrawer: () => ({
        isOpen: true,
        close: closeMock,
    }),
}));

jest.mock('@/contexts/UserContext', () => ({
    useUser: () => ({
        user: {
            name: 'Gui',
            tag: '@gui',
            avatarEmoji: ':)',
        },
    }),
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: pushMock,
        replace: replaceMock,
    }),
}));

describe('SideDrawer', () => {
    beforeEach(() => {
        closeMock.mockClear();
        pushMock.mockClear();
        replaceMock.mockClear();
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

        expect(closeMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith('/profile');
    });

    it('confirms and logs out to login route', () => {
        const { getByTestId } = render(<SideDrawer />);

        fireEvent.press(getByTestId('drawer-log-out'));

        const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
        const buttons = alertCall[2] as Array<{ text: string; onPress?: () => void }>;
        const logOutButton = buttons.find((button) => button.text === 'Log Out');

        expect(logOutButton).toBeTruthy();
        logOutButton?.onPress?.();

        expect(closeMock).toHaveBeenCalledTimes(1);
        expect(replaceMock).toHaveBeenCalledWith('/login');
    });
});

