import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import RegisterScreen from '@/app/register';

// Mock expo-router
jest.mock('expo-router', () => ({
    router: {
        replace: jest.fn(),
    },
}));

jest.mock('@/services/auth.service', () => ({
    registerWithEmail: jest.fn(),
}));

jest.mock('@/services/users.service', () => ({
    upsertUserProfile: jest.fn(),
}));

jest.mock('@/services/firebase', () => ({
    isFirebaseConfigured: true,
}));

import { router } from 'expo-router';
import * as authService from '@/services/auth.service';

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
        expect(getByTestId('confirm-password-input')).toBeTruthy();
        expect(getByTestId('submit-button')).toBeTruthy();
        expect(getByText(/Registar/i)).toBeTruthy();
    });

    it('Cenário Normal: registo com email FEUP válido navega para tabs', () => {
        const { getByTestId } = render(<RegisterScreen />);

        fireEvent.changeText(getByTestId('email-input'), 'up202012345@fe.up.pt');
        fireEvent.changeText(getByTestId('password-input'), 'password123');
        fireEvent.changeText(getByTestId('confirm-password-input'), 'password123');
        fireEvent.press(getByTestId('course-picker-button'));
        fireEvent.press(getByTestId('course-option-LEIC'));
        fireEvent.press(getByTestId('submit-button'));

        expect(alertSpy).toHaveBeenCalledWith(
            'Sucesso',
            'Conta criada com sucesso!',
            expect.any(Array)
        );

        const alertButtons = alertSpy.mock.calls[0][2] as Array<{ text: string; onPress?: () => void }>;
        const okButton = alertButtons.find((button) => button.text === 'OK');
        expect(okButton).toBeTruthy();

        act(() => {
            okButton?.onPress?.();
        });

        expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });

    it('Cenário Excecional: email duplicado mostra erro e não navega', () => {
        const { getByTestId } = render(<RegisterScreen />);

        fireEvent.changeText(getByTestId('email-input'), 'duplicado@teste.pt');
        fireEvent.changeText(getByTestId('password-input'), 'qualquerpassword');
        fireEvent.changeText(getByTestId('confirm-password-input'), 'qualquerpassword');
        fireEvent.press(getByTestId('course-picker-button'));
        fireEvent.press(getByTestId('course-option-LEIC'));
        fireEvent.press(getByTestId('submit-button'));

        expect(alertSpy).toHaveBeenCalledWith('Erro', 'Email já registado');
        expect(router.replace).not.toHaveBeenCalled();
    });

  it('submeter com campos vazios não navega para tabs', () => {
        const { getByTestId } = render(<RegisterScreen />);

        fireEvent.press(getByTestId('submit-button'));

        expect(alertSpy).toHaveBeenCalledWith('Erro', 'Preenche todos os campos');
        expect(router.replace).not.toHaveBeenCalled();
    });

    it('Cenário Excecional: processa erro do Firebase ao registar', async () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        (authService.registerWithEmail as jest.Mock).mockRejectedValueOnce({
            code: 'auth/weak-password',
        });

        const { getByTestId } = render(<RegisterScreen />);

        fireEvent.changeText(getByTestId('email-input'), 'valid@fe.up.pt');
        fireEvent.changeText(getByTestId('password-input'), '123'); // weak password
        fireEvent.changeText(getByTestId('confirm-password-input'), '123');
        fireEvent.press(getByTestId('course-picker-button'));
        fireEvent.press(getByTestId('course-option-LEIC'));
        
        await act(async () => {
            fireEvent.press(getByTestId('submit-button'));
        });

        expect(alertSpy).toHaveBeenCalledWith('Erro', 'Password fraca. Usa pelo menos 6 caracteres.');
        
        process.env.NODE_ENV = originalEnv;
    });
});