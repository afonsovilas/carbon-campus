import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { Ionicons } from '@expo/vector-icons';

export default function RankingScreen() {


    const [tripsCount, setTripsCount] = useState(0);

    if (tripsCount === 0) {
        return (
            <ThemedView style={styles.lockedContainer}>
                <Ionicons
                    name="lock-closed"
                    size={120}
                    color="#D1D1D6"
                    style={styles.icon}
                />


                <ThemedText type="title" style={styles.lockedTitle} testID="locked-title">
                    Tabela bloqueada!
                </ThemedText>


                <ThemedText style={styles.lockedDescription}>
                    As LeaderBoards encontram-se bloqueadas, regista a tua primeira viagem para as desbloqueares!
                </ThemedText>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/LogTripScreen')}
                    testID="register-trip-button"
                >
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        Registar 1ª Viagem
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }


    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">🏆 Ranking (Desbloqueado)</ThemedText>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    lockedContainer: {
        flex: 1,
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    icon: {
        fontSize: 100,
        marginBottom: 20,
    },
    lockedTitle: {
        fontSize: 24,
        textAlign: 'center',
    },
    lockedDescription: {
        textAlign: 'center',
        fontSize: 16,
        opacity: 0.8,
        lineHeight: 22,
        marginBottom: 30,
    },
    button: {
        paddingVertical: 18,
        paddingHorizontal: 30,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});