import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import RankingScreen from '../app/(tabs)/rankings';
import { TripsProvider, useTrips } from '../contexts/TripsContext';


jest.mock('expo-router', () => ({
    router: { push: jest.fn() }
}));

jest.mock('@expo/vector-icons', () => ({
    Ionicons: () => {
        const React = require('react');
        const { View } = require('react-native');
        return React.createElement(View, { testID: 'mock-ionicon' });
    },
}));

function SeedOneTrip() {
    const { addTrip } = useTrips();

    useEffect(() => {
        addTrip({ id: 'trip-seed-1', mode: 'Bus', distance: 3.2, points: 38, date: '21/4' });
        // Seed once to force unlocked ranking path.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

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

    it('Scenario: User with trips sees unlocked leaderboard and can switch tabs', () => {
        render(
            <TripsProvider>
                <SeedOneTrip />
                <RankingScreen />
            </TripsProvider>
        );

        expect(screen.getByText('🏆 LeaderBoards')).toBeTruthy();
        expect(screen.getByText('Curso')).toBeTruthy();
        expect(screen.getByText('Engenharia Informática')).toBeTruthy();

        fireEvent.press(screen.getByText('Alunos'));

        expect(screen.getByText('Nome')).toBeTruthy();
        expect(screen.getByText('João Silva')).toBeTruthy();
    });

});