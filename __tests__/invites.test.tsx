import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import InvitesScreen from '../app/(tabs)/invites';

describe('InvitesScreen acceptance tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        act(() => {
            jest.runOnlyPendingTimers();
        });
        jest.useRealTimers();
    });

    it('Scenario 1: finds a user and sends a request successfully', async () => {
        const { getByPlaceholderText, getByText, queryByText } = render(<InvitesScreen />);

        // Pesquisa pelo utilizador válido definido no código
        fireEvent.changeText(getByPlaceholderText('Search by tag...'), 'user1');

        // Simula o clique no botão de pesquisa (encontrado pelo texto/ícone se tiver testID)
        // Se o botão não tiver texto, podes usar testID="search-button"
        const searchButton = getByText('🔍'); // Assumindo que o botão tem um identificador visual ou testID
        fireEvent.press(searchButton);

        // Avança o tempo para a simulação do "setTimeout" da pesquisa
        act(() => { jest.advanceTimersByTime(800); });

        expect(getByText('User1')).toBeTruthy();

        // Enviar pedido
        fireEvent.press(getByText('Send Request'));
        expect(getByText('Pending')).toBeTruthy();
    });

    it('Scenario 2: shows error message when user tag is not found', () => {
        const { getByPlaceholderText, getByText } = render(<InvitesScreen />);

        fireEvent.changeText(getByPlaceholderText('Search by tag...'), 'unknown_user');
        fireEvent.press(getByText('🔍'));

        act(() => { jest.advanceTimersByTime(800); });

        expect(getByText('Username does not exist')).toBeTruthy();
    });
});