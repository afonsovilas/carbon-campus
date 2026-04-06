import { StyleSheet } from 'react-native';  // ← IMPORT FALTAVA
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">🌿 CarbonCampus</ThemedText>
            <ThemedText type="subtitle">Reduz a pegada de carbono</ThemedText>

            <ThemedView style={styles.card}>
                <ThemedText type="title">📊 1.247 pontos</ThemedText>
                <ThemedText>23kg CO₂ evitados</ThemedText>
            </ThemedView>

            <ThemedView style={styles.button} onTouchEnd={() => {}}>
                <ThemedText type="title">➕ Registar Viagem</ThemedText>
            </ThemedView>

            <ThemedView style={styles.button} onTouchEnd={() => {}}>
                <ThemedText type="title">🏆 Ranking</ThemedText>
            </ThemedView>

            <ThemedView style={styles.card}>
                <ThemedText type="title">🎓 MIEIC #3</ThemedText>
                <ThemedText>Ran king geral fim do ano</ThemedText>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, gap: 20, justifyContent: 'center' },
    card: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center'
    },
    button: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        alignItems: 'center'
    },
});
