import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ChallengesScreen from '../app/(tabs)/challenge';

describe('ChallengesScreen acceptance tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        act(() => {
            jest.runOnlyPendingTimers();
        });
        jest.useRealTimers();
    });

    it('Scenario 1: creates a new challenge and displays it in the list', () => {
        const { getByPlaceholderText, getByText } = render(<ChallengesScreen />);

        // Preencher o formulário de criação
        fireEvent.changeText(getByPlaceholderText('Challenge Name'), 'Maratona Verde');
        fireEvent.changeText(getByPlaceholderText('Start (DD/MM)'), '01/05');
        fireEvent.changeText(getByPlaceholderText('End (DD/MM)'), '31/05');

        fireEvent.press(getByText('Create Challenge'));

        // Verificar se o desafio aparece na lista de ativos
        expect(getByText('Maratona Verde')).toBeTruthy();
        expect(getByText('01/05 to 31/05')).toBeTruthy();
    });

    it('Scenario 2: opens the invite container when clicking the invite button', () => {
        const { getByPlaceholderText, getByText, queryByText } = render(<ChallengesScreen />);

        // Primeiro criamos um desafio para ter algo na lista
        fireEvent.changeText(getByPlaceholderText('Challenge Name'), 'Desafio Teste');
        fireEvent.changeText(getByPlaceholderText('Start (DD/MM)'), '10/10');
        fireEvent.changeText(getByPlaceholderText('End (DD/MM)'), '20/10');
        fireEvent.press(getByText('Create Challenge'));

        // Clicar no botão de convite (ícone de avião no item da lista)
        // Dica: Adiciona testID="invite-btn" no TouchableOpacity do item da lista
        const inviteBtn = getByText('✈️');
        fireEvent.press(inviteBtn);

        // Verificar se o container de convite aparece
        expect(getByText('Invite to: Desafio Teste')).toBeTruthy();
        expect(getByPlaceholderText('Search friend by tag...')).toBeTruthy();
    });
});