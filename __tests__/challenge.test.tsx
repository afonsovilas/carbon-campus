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
        fireEvent.changeText(getByPlaceholderText('Nome do Desafio'), 'Maratona Verde');
        fireEvent.changeText(getByPlaceholderText('Início (DD/MM)'), '01/05');
        fireEvent.changeText(getByPlaceholderText('Fim (DD/MM)'), '31/05');

        fireEvent.press(getByText('Criar Desafio'));

        // Verificar se o desafio aparece na lista de ativos
        expect(getByText('Maratona Verde')).toBeTruthy();
        expect(getByText('01/05 to 31/05')).toBeTruthy();
    });

    it('Scenario 2: opens the invite container when clicking the invite button', () => {
        const { getByPlaceholderText, getByText, getByTestId } = render(<ChallengesScreen />);

        // Primeiro criamos um desafio para ter algo na lista
        fireEvent.changeText(getByPlaceholderText('Nome do Desafio'), 'Desafio Teste');
        fireEvent.changeText(getByPlaceholderText('Início (DD/MM)'), '10/10');
        fireEvent.changeText(getByPlaceholderText('Fim (DD/MM)'), '20/10');
        fireEvent.press(getByText('Criar Desafio'));

        const inviteBtn = getByTestId('invite-btn');
        fireEvent.press(inviteBtn);

        // Verificar se o container de convite aparece
        expect(getByText('Convidar para: Desafio Teste')).toBeTruthy();
        expect(getByPlaceholderText('Procurar amigo por tag...')).toBeTruthy();
    });
});