import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import RankingScreen from '../app/(tabs)/rankings';
import { router } from 'expo-router';


jest.mock('expo-router', () => ({
    router: { push: jest.fn() }
}));

describe('Automated Acceptance Test: US10 - Tabela Bloqueada', () => {

    it('Scenario: User has 0 trips and views Locked Leaderboard', () => {


        render(<RankingScreen />);

        const lockedTitle = screen.getByTestId('locked-title');
        expect(lockedTitle).toBeTruthy();
        expect(lockedTitle.props.children).toBe('Tabela bloqueada!');
        const descriptionText = screen.getByText('As LeaderBoards encontram-se bloqueadas, regista a tua primeira viagem para as desbloqueares!');
        expect(descriptionText).toBeTruthy();
        const registerButton = screen.getByTestId('register-trip-button');
        expect(registerButton).toBeTruthy();


        fireEvent.press(registerButton);

        expect(router.push).toHaveBeenCalledWith('/LogTripScreen');
    });

});