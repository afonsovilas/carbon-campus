import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';
import RankingScreen from '../app/(tabs)/rankings';
import { TripsProvider } from '../contexts/TripsContext';


jest.mock('expo-router', () => ({
    router: { push: jest.fn() }
}));

describe('Automated Acceptance Test: US10 - Tabela Bloqueada', () => {

    it('Scenario: User has 0 trips and views Locked Leaderboard', () => {

        render(
            <TripsProvider>
                <RankingScreen />
            </TripsProvider>
        );

        const lockedTitle = screen.getByTestId('locked-title');
        expect(lockedTitle).toBeTruthy();
        expect(lockedTitle.props.children).toBe('Tabela bloqueada!');
        const descriptionText = screen.getByText('As LeaderBoards encontram-se bloqueadas, regista a tua primeira viagem para as desbloqueares!');
        expect(descriptionText).toBeTruthy();
        const registerButton = screen.getByTestId('register-trip-button');
        expect(registerButton).toBeTruthy();


        fireEvent.press(registerButton);

        expect(router.push).toHaveBeenCalledWith('/(tabs)/LogTripScreen');
    });

});