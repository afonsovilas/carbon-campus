import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import LogTripScreen from '@/app/(tabs)/LogTripScreen';
import { useTripTracking } from '@/contexts/TripTrackingContext';

const mockUseTripTracking = useTripTracking as jest.Mock;

describe('LogTripScreen GPS Tracking', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseTripTracking.mockReturnValue({
            activeTrip: null,
            startTrip: jest.fn(),
            stopTrip: jest.fn(),
            pauseTrip: jest.fn(),
            resumeTrip: jest.fn(),
            isTracking: false,
            locationError: null,
            clearError: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza seleção de modo transporte', () => {
        const { getByText } = render(<LogTripScreen />);
        expect(getByText('🚌 Autocarro')).toBeTruthy();
        expect(getByText('🚇 Metro')).toBeTruthy();
    });

    it('renderiza botão iniciar viagem', () => {
        const { getByTestId } = render(<LogTripScreen />);
        expect(getByTestId('start-trip-button')).toBeTruthy();
    });

    it('renderiza título e subtítulo', () => {
        const { getByText } = render(<LogTripScreen />);
        expect(getByText('Registar Viagem')).toBeTruthy();
        expect(getByText('Escolhe o transporte e adiciona a distância percorrida.')).toBeTruthy();
    });

    it('botão iniciar desabilitado sem seleção', () => {
        const { getByTestId } = render(<LogTripScreen />);
        const button = getByTestId('start-trip-button');
        expect(button).toBeTruthy();
        // TouchableOpacity expõe disabled como accessibilityState
        expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('abilita botão ao selecionar modo', async () => {
        const { getByTestId, getByText } = render(<LogTripScreen />);
        const busButton = getByText('🚌 Autocarro');

        fireEvent.press(busButton);

        await waitFor(() => {
            const startButton = getByTestId('start-trip-button');
            expect(startButton.props.accessibilityState?.disabled).toBe(false);
        });
    });

    it('chama startTrip ao clicar botão iniciar', async () => {
        const mockStartTrip = jest.fn();
        mockUseTripTracking.mockReturnValue({
            activeTrip: null,
            startTrip: mockStartTrip,
            stopTrip: jest.fn(),
            pauseTrip: jest.fn(),
            resumeTrip: jest.fn(),
            isTracking: false,
            locationError: null,
            clearError: jest.fn(),
        });

        const { getByTestId, getByText } = render(<LogTripScreen />);

        fireEvent.press(getByText('🚌 Autocarro'));
        fireEvent.press(getByTestId('start-trip-button'));

        await waitFor(() => {
            expect(mockStartTrip).toHaveBeenCalledWith('Bus');
        });
    });

    it('limpa erro ao selecionar transporte', async () => {
        const mockClearError = jest.fn();
        mockUseTripTracking.mockReturnValue({
            activeTrip: null,
            startTrip: jest.fn(),
            stopTrip: jest.fn(),
            pauseTrip: jest.fn(),
            resumeTrip: jest.fn(),
            isTracking: false,
            locationError: 'Erro de localização',
            clearError: mockClearError,
        });

        const { getByText } = render(<LogTripScreen />);
        fireEvent.press(getByText('🚌 Autocarro'));

        await waitFor(() => {
            expect(mockClearError).toHaveBeenCalled();
        });
    });

    it('exibe mensagem de erro quando locationError existe', () => {
        mockUseTripTracking.mockReturnValue({
            activeTrip: null,
            startTrip: jest.fn(),
            stopTrip: jest.fn(),
            pauseTrip: jest.fn(),
            resumeTrip: jest.fn(),
            isTracking: false,
            locationError: 'Permissão de localização negada',
            clearError: jest.fn(),
        });

        const { getByText } = render(<LogTripScreen />);

        expect(getByText('Permissão de localização negada')).toBeTruthy();
    });

    it('desabilita botões durante rastreamento ativo', () => {
        mockUseTripTracking.mockReturnValue({
            activeTrip: {
                id: 'test-trip',
                startTime: Date.now(),
                locations: [
                    { latitude: 41.14858, longitude: -8.610945, timestamp: Date.now() },
                ],
                transportMode: 'Bus',
                status: 'active',
            },
            startTrip: jest.fn(),
            stopTrip: jest.fn(),
            pauseTrip: jest.fn(),
            resumeTrip: jest.fn(),
            isTracking: true,
            locationError: null,
            clearError: jest.fn(),
        });

        const { queryByTestId } = render(<LogTripScreen />);

        const startButton = queryByTestId('start-trip-button');
        expect(startButton).toBeNull();
    });

    it('renderiza opções de pausa e retomada durante rastreamento', () => {
        mockUseTripTracking.mockReturnValue({
            activeTrip: {
                id: 'test-trip',
                startTime: Date.now(),
                locations: [
                    { latitude: 41.14858, longitude: -8.610945, timestamp: Date.now() },
                ],
                transportMode: 'Bus',
                status: 'active',
            },
            startTrip: jest.fn(),
            stopTrip: jest.fn(),
            pauseTrip: jest.fn(),
            resumeTrip: jest.fn(),
            isTracking: true,
            locationError: null,
            clearError: jest.fn(),
        });

        const { getByText, getByTestId } = render(<LogTripScreen />);

        expect(getByTestId('pause-trip-button')).toBeTruthy();
        expect(getByText('⏸ Pausar')).toBeTruthy();
        expect(getByTestId('stop-trip-button')).toBeTruthy();
        expect(getByText('⏹ Terminar Viagem')).toBeTruthy();
    });

    it('chama stopTrip ao terminar viagem', async () => {
        const mockStopTrip = jest.fn();
        mockUseTripTracking.mockReturnValue({
            activeTrip: {
                id: 'test-trip',
                startTime: Date.now(),
                locations: [
                    { latitude: 41.14858, longitude: -8.610945, timestamp: Date.now() },
                ],
                transportMode: 'Bus',
                status: 'active',
            },
            startTrip: jest.fn(),
            stopTrip: mockStopTrip,
            pauseTrip: jest.fn(),
            resumeTrip: jest.fn(),
            isTracking: true,
            locationError: null,
            clearError: jest.fn(),
        });

        const { getByText } = render(<LogTripScreen />);

        fireEvent.press(getByText('⏹ Terminar Viagem'));

        await waitFor(() => {
            expect(mockStopTrip).toHaveBeenCalled();
        });
    });

    it('chama pauseTrip ao pausar viagem', async () => {
        const mockPauseTrip = jest.fn();
        mockUseTripTracking.mockReturnValue({
            activeTrip: {
                id: 'test-trip',
                startTime: Date.now(),
                locations: [
                    { latitude: 41.14858, longitude: -8.610945, timestamp: Date.now() },
                ],
                transportMode: 'Bus',
                status: 'active',
            },
            startTrip: jest.fn(),
            stopTrip: jest.fn(),
            pauseTrip: mockPauseTrip,
            resumeTrip: jest.fn(),
            isTracking: true,
            locationError: null,
            clearError: jest.fn(),
        });

        const { getByText } = render(<LogTripScreen />);

        fireEvent.press(getByText('⏸ Pausar'));

        await waitFor(() => {
            expect(mockPauseTrip).toHaveBeenCalled();
        });
    });

    it('renderiza modo transporte selecionado durante rastreamento', () => {
        mockUseTripTracking.mockReturnValue({
            activeTrip: {
                id: 'test-trip',
                startTime: Date.now(),
                locations: [
                    { latitude: 41.14858, longitude: -8.610945, timestamp: Date.now() },
                ],
                transportMode: 'Bus',
                status: 'active',
            },
            startTrip: jest.fn(),
            stopTrip: jest.fn(),
            pauseTrip: jest.fn(),
            resumeTrip: jest.fn(),
            isTracking: true,
            locationError: null,
            clearError: jest.fn(),
        });

        const { getByText } = render(<LogTripScreen />);

        expect(getByText('🚌 Autocarro')).toBeTruthy();
    });

    it('chama resumeTrip ao retomar viagem pausada', async () => {
        const mockResumeTrip = jest.fn();
        mockUseTripTracking.mockReturnValue({
            activeTrip: {
                id: 'test-trip',
                startTime: Date.now(),
                locations: [
                    { latitude: 41.14858, longitude: -8.610945, timestamp: Date.now() },
                ],
                transportMode: 'Bus',
                status: 'paused',
            },
            startTrip: jest.fn(),
            stopTrip: jest.fn(),
            pauseTrip: jest.fn(),
            resumeTrip: mockResumeTrip,
            isTracking: true,
            locationError: null,
            clearError: jest.fn(),
        });

        const { getByText } = render(<LogTripScreen />);

        fireEvent.press(getByText('▶ Retomar'));

        await waitFor(() => {
            expect(mockResumeTrip).toHaveBeenCalled();
        });
    });
});
