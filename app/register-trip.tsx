import { StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function RegisterTripScreen() {
    const { distance = '0', points = '0', mode = 'Bus' } = useLocalSearchParams();
    const { t } = useLanguage();

    const modeMap: Record<string, { emoji: string; text: string }> = {
        'Bus': { emoji: '🚌', text: 'Autocarro' },
        'Metro': { emoji: '🚇', text: 'Metro' },
        'Bicycle': { emoji: '🚲', text: 'Bicicleta' },
        'Electric Scooter': { emoji: '🛴', text: 'Trotinete' },
        'Car': { emoji: '🚗', text: 'Carro' },
    };

    const modeConfig = modeMap[mode as string] || modeMap['Bus'];
    const modeEmoji = modeConfig.emoji;
    const modeText = modeConfig.text;

    const register = () => {
        alert(`Viagem ${modeText} +${points} pts registada!`);
        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">➕ Registar Viagem</ThemedText>

            <ThemedView style={styles.card}>
                <ThemedText type="subtitle">
                    {modeEmoji} Modo: {modeText}
                </ThemedText>
                <ThemedText type="subtitle">📏 Distância: {distance}km</ThemedText>
                <ThemedText type="title" style={styles.points}>
                    ⭐ Pontos: +{points}
                </ThemedText>
            </ThemedView>

            <TouchableOpacity
                testID="confirm-button"
                style={styles.button}
                onPress={register}
            >
                <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                    CONFIRMAR REGISTO
                </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
                testID="back-button"
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <ThemedText style={styles.backButtonText}>← Voltar</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        gap: 24,
        justifyContent: 'center',
    },
    card: {
        padding: 24,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        gap: 12,
    },
    points: {
        marginTop: 8,
        color: '#4CAF50',
    },
    button: {
        padding: 18,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        padding: 14,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
