import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import RankingScreen from '../app/(tabs)/rankings';
import { TripsProvider, useTrips } from '../contexts/TripsContext';


jest.mock('expo-router', () => ({
    router: { push: jest.fn() },
    useFocusEffect: (effect: () => void) => effect(),
}));

jest.mock('@expo/vector-icons', () => ({
    Ionicons: () => {
        const React = require('react');
        const { View } = require('react-native');
        return React.createElement(View, { testID: 'mock-ionicon' });
    },
}));

jest.mock('../services/leaderboard.service', () => ({
    fetchLeaderboardFromCloud: jest.fn(() => Promise.resolve({
        courses: [
            { pos: 1, course: 'Engenharia Informática', points: 8250, students: 2 },
            { pos: 2, course: 'Gestão', points: 7200, students: 1 },
        ],
        students: [
            { pos: 1, uid: 'u1', name: 'João Silva', tag: '@joao', course: 'Engenharia Informática', points: 8250 },
            { pos: 2, uid: 'u2', name: 'Maria Santos', tag: '@maria', course: 'Gestão', points: 7200 },
        ],
    })),
}));

if (typeof setImmediate === 'undefined') {
    // @ts-expect-error - ensure test helper exists in Jest env.
    global.setImmediate = (fn: () => void) => setTimeout(fn, 0);
}

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

    const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

    it('Scenario: User has 0 trips and views Locked Leaderboard', async () => {

        render(
            <TripsProvider>
                <RankingScreen />
            </TripsProvider>
        );

        await act(async () => {
            await flushPromises();
        });

        const lockedTitle = screen.getByTestId('locked-title');
        expect(lockedTitle).toBeTruthy();
        expect(lockedTitle.props.children).toBe('Tabela bloqueada!');
        const descriptionText = screen.getByText('As LeaderBoards encontram-se bloqueadas. Regista a tua primeira viagem para as desbloqueares!');
        expect(descriptionText).toBeTruthy();
        const registerButton = screen.getByTestId('register-trip-button');
        expect(registerButton).toBeTruthy();


        fireEvent.press(registerButton);

        expect(router.push).toHaveBeenCalledWith('/(tabs)/LogTripScreen');
    });

    it('Scenario: User with trips sees unlocked leaderboard and can switch tabs', async () => {
        render(
            <TripsProvider>
                <SeedOneTrip />
                <RankingScreen />
            </TripsProvider>
        );

        await act(async () => {
            await flushPromises();
        });

        expect(screen.getByText('🏆 LeaderBoards')).toBeTruthy();

        return waitFor(() => {
            expect(screen.getByText('Curso')).toBeTruthy();
            expect(screen.getByText('Engenharia Informática')).toBeTruthy();
        }).then(async () => {
            fireEvent.press(screen.getByText('Alunos'));

            await waitFor(() => {
                expect(screen.getByText('Nome')).toBeTruthy();
                expect(screen.getByText('João Silva')).toBeTruthy();
            });
        });
    });

});