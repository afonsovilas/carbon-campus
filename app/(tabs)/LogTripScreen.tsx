import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTrips } from '@/contexts/TripsContext';
import { useTripTracking } from '@/contexts/TripTrackingContext';
import { calculateTotalDistance } from '@/utils/trip-tracking';
import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { router } from 'expo-router';
import { TransportMode } from '@/utils/functional-requirements';

const TRACKING_MODES: TransportMode[] = ['Bus', 'Metro', 'Bicycle', 'Electric Scooter', 'Car'];

export default function LogTripScreen() {
    const { addTrip } = useTrips();
    const { t } = useLanguage();
    const {
        activeTrip,
        startTrip,
        stopTrip,
        pauseTrip,
        resumeTrip,
        isTracking,
        locationError,
        clearError,
    } = useTripTracking();

    const [selectedTransport, setSelectedTransport] = useState<TransportMode | null>(null);
    const [currentDistance, setCurrentDistance] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (activeTrip) {
            const distance = calculateTotalDistance(activeTrip.locations);
            setCurrentDistance(distance);
        }
    }, [activeTrip?.locations]);

    useEffect(() => {
        if (!activeTrip) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - activeTrip.startTime) / 1000);
            setElapsedTime(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [activeTrip]);

    const handleStartTrip = async () => {
        if (!selectedTransport) return;
        clearError();
        await startTrip(selectedTransport);
    };

    const handleStopTrip = async () => {
        const result = await stopTrip();
        if (result) {
            const { distance, points, mode } = result;
            const today = new Date();
            const dateString = `${today.getDate()}/${today.getMonth() + 1}`;

            addTrip({
                id: `trip-${Date.now()}`,
                mode: mode,
                distance: Number(distance.toFixed(2)),
                points,
                date: dateString,
            });

            setSelectedTransport(null);
            setCurrentDistance(0);
            setElapsedTime(0);

            router.push({
                pathname: '/register-trip',
                params: {
                    distance: distance.toFixed(2),
                    points: points.toString(),
                    mode: mode,
                },
            });
        }
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <ThemedView style={styles.screen}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable
                    style={styles.flex}
                    onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}
                >
                    <ScrollView
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.headerBlock}>
                            <ThemedText type="title">{t.log_trip_title}</ThemedText>
                            <ThemedText type="default" style={styles.headerSubtitle}>
                                {t.log_trip_subtitle}
                            </ThemedText>
                        </View>

                        {locationError && (
                            <ThemedView style={styles.errorContainer}>
                                <ThemedText style={styles.errorText}>{locationError}</ThemedText>
                            </ThemedView>
                        )}

                        <ThemedView style={styles.card}>
                            {!isTracking && (
                                <>
                                    <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
                                        {t.transport_mode}
                                    </ThemedText>

                                    <View style={styles.transportOptionsRow}>
                                        {TRACKING_MODES.map((mode) => {
                                            const isSelected = selectedTransport === mode;
                                            return (
                                                <TouchableOpacity
                                                    key={mode}
                                                    style={[
                                                        styles.transportOption,
                                                        isSelected && styles.transportOptionSelected,
                                                    ]}
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        setSelectedTransport(mode);
                                                        clearError();
                                                    }}
                                                >
                                                    <ThemedText
                                                        type="defaultSemiBold"
                                                        style={[
                                                            styles.transportOptionText,
                                                            isSelected &&
                                                            styles.transportOptionTextSelected,
                                                        ]}
                                                    >
                                                        {mode === 'Bus' && '🚌 Autocarro'}
                                                        {mode === 'Metro' && '🚇 Metro'}
                                                        {mode === 'Bicycle' && '🚲 Bicicleta'}
                                                        {mode === 'Electric Scooter' && '🛴 Trotinete'}
                                                        {mode === 'Car' && '🚗 Carro'}
                                                    </ThemedText>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </>
                            )}

                            {isTracking && activeTrip && (
                                <>
                                    <ThemedText
                                        type="defaultSemiBold"
                                        style={styles.sectionLabel}
                                    >
                                        {activeTrip.transportMode === 'Bus' && '🚌 Autocarro'}
                                        {activeTrip.transportMode === 'Metro' && '🚇 Metro'}
                                        {activeTrip.transportMode === 'Bicycle' && '🚲 Bicicleta'}
                                        {activeTrip.transportMode === 'Electric Scooter' && '🛴 Trotinete'}
                                        {activeTrip.transportMode === 'Car' && '🚗 Carro'}
                                    </ThemedText>

                                    <View style={styles.statsContainer}>
                                        <View style={styles.statBox}>
                                            <ThemedText type="default" style={styles.statLabel}>
                                                Distância
                                            </ThemedText>
                                            <ThemedText type="title" style={styles.statValue}>
                                                {currentDistance.toFixed(2)}
                                            </ThemedText>
                                            <ThemedText type="default" style={styles.statUnit}>
                                                km
                                            </ThemedText>
                                        </View>

                                        <View style={styles.statBox}>
                                            <ThemedText type="default" style={styles.statLabel}>
                                                Tempo
                                            </ThemedText>
                                            <ThemedText type="title" style={styles.statValue}>
                                                {formatTime(elapsedTime)}
                                            </ThemedText>
                                        </View>
                                    </View>

                                    <ThemedText
                                        type="default"
                                        style={[
                                            styles.statusText,
                                            activeTrip.status === 'paused' &&
                                            styles.statusTextPaused,
                                        ]}
                                    >
                                        {activeTrip.status === 'active'
                                            ? '● Rastreando localização...'
                                            : '⏸ Viagem pausada'}
                                    </ThemedText>
                                </>
                            )}
                        </ThemedView>

                        <View style={styles.buttonContainer}>
                            {!isTracking ? (
                                <TouchableOpacity
                                    testID="start-trip-button"
                                    style={[
                                        styles.button,
                                        !selectedTransport && styles.buttonDisabled,
                                    ]}
                                    onPress={handleStartTrip}
                                    disabled={!selectedTransport}
                                >
                                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                                        🚀 Iniciar Viagem
                                    </ThemedText>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        testID="stop-trip-button"
                                        style={[styles.button, styles.stopButton]}
                                        onPress={handleStopTrip}
                                    >
                                        <ThemedText
                                            type="defaultSemiBold"
                                            style={styles.buttonText}
                                        >
                                            ⏹ Terminar Viagem
                                        </ThemedText>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        testID="pause-trip-button"
                                        style={[styles.button, styles.pauseButton]}
                                        onPress={
                                            activeTrip?.status === 'active' ? pauseTrip : resumeTrip
                                        }
                                    >
                                        <ThemedText
                                            type="defaultSemiBold"
                                            style={styles.buttonText}
                                        >
                                            {activeTrip?.status === 'active'
                                                ? '⏸ Pausar'
                                                : '▶ Retomar'}
                                        </ThemedText>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </Pressable>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1 },
    flex: { flex: 1 },
    container: {
        padding: 20,
        paddingTop: 100,
        paddingBottom: 30,
        gap: 18,
    },
    headerBlock: { gap: 4 },
    headerSubtitle: { opacity: 0.8 },
    card: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    sectionLabel: { marginBottom: 12, marginTop: 6 },
    transportOptionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    transportOption: {
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.45)',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    transportOptionSelected: {
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76,175,80,0.2)',
    },
    transportOptionText: { fontSize: 14, fontWeight: '500' },
    transportOptionTextSelected: { color: '#4CAF50', fontWeight: '600' },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: 'rgba(76,175,80,0.15)',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(76,175,80,0.3)',
    },
    statLabel: { fontSize: 12, opacity: 0.8, marginBottom: 4 },
    statValue: { fontSize: 24, fontWeight: '700', marginBottom: 2 },
    statUnit: { fontSize: 12, opacity: 0.7 },
    statusText: {
        opacity: 0.8,
        fontSize: 14,
        fontWeight: '500',
        color: '#4CAF50',
    },
    statusTextPaused: { color: '#f59e0b' },
    errorContainer: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(239,68,68,0.2)',
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    errorText: { color: '#dc2626', fontSize: 14 },
    buttonContainer: { gap: 12 },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    stopButton: { backgroundColor: '#ef4444' },
    pauseButton: { backgroundColor: '#f59e0b' },
    buttonDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
});
