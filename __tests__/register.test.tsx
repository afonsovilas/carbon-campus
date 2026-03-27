import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
import React from 'react';

import RegisterScreen from '../app/register';

// Mock expo-router
jest.mock('expo-router', () => ({
    router: {
        replace: jest.fn(),
    },
}));

import { router } from 'expo-router';

describe('RegisterScreen acceptance tests', () => {
    let alertSpy: ReturnType<typeof jest.spyOn>;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        alertSpy.mockRestore();
        act(() => {
            jest.runOnlyPendingTimers();
        });
        jest.useRealTimers();
    });

    it('Cenário Normal: renderiza campos de email, password e botão de registo', () => {
        const { getByTestId, getByText } = render(<RegisterScreen />);

        expect(getByTestId('email-input')).toBeTruthy();
        expect(getByTestId('password-input')).toBeTruthy();
        expect(getByTestId('submit-button')).toBeTruthy();
        expect(getByText(/Registar MIEIC/i)).toBeTruthy();
    });

    it('Cenário Normal: registo com email FEUP válido navega para tabs', () => {
        const { getByTestId } = render(<RegisterScreen />);

        fireEvent.changeText(getByTestId('email-input'), 'up202012345@fe.up.pt');
        fireEvent.changeText(getByTestId('password-input'), 'password123');
        fireEvent.press(getByTestId('submit-button'));

        expect(alertSpy).toHaveBeenCalledWith('Sucesso', 'Bem-vindo ao CarbonCampus!');
        expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });

    it('Cenário Excecional: email duplicado mostra erro e não navega', () => {
        const { getByTestId } = render(<RegisterScreen />);

        fireEvent.changeText(getByTestId('email-input'), 'duplicado@teste.pt');
        fireEvent.changeText(getByTestId('password-input'), 'qualquerpassword');
        fireEvent.press(getByTestId('submit-button'));

        expect(alertSpy).toHaveBeenCalledWith('Erro', 'Email já registado');
        expect(router.replace).not.toHaveBeenCalled();
    });

    it('Cenário Excecional: submeter com campos vazios não navega para tabs', () => {
        const { getByTestId } = render(<RegisterScreen />);

        fireEvent.press(getByTestId('submit-button'));

        expect(alertSpy).toHaveBeenCalledWith('Erro', 'Preenche todos os campos');
        expect(router.replace).not.toHaveBeenCalled();
    });
});