import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">🌿 CarbonCampus</ThemedText>
            <ThemedText type="subtitle">Reduz a pegada de carbono</ThemedText>

            <ThemedView style={styles.card}>
                <ThemedText type="title">📊 1.247 pontos</ThemedText>
                <ThemedText>23kg CO₂ evitados</ThemedText>
                <Link href="../rewardScreen" asChild>
                    <TouchableOpacity style={styles.smallButton} activeOpacity={0.7}>
                        <ThemedText type="title" style={{fontSize:20}}>Levantar</ThemedText>
                    </TouchableOpacity>
                </Link>
            </ThemedView>

            <TouchableOpacity style={styles.button} activeOpacity={0.7}>
                <ThemedText type="title">➕ Registar Viagem</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} activeOpacity={0.7}>
                <ThemedText type="title">🏆 Ranking</ThemedText>
            </TouchableOpacity>

            <ThemedView style={styles.card}>
                <ThemedText type="title">🎓 MIEIC #3</ThemedText>
                <ThemedText>Ranking geral fim do ano</ThemedText>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        width: '100%',
    },
    button: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        width: '100%',
    },
    smallButton: {
        padding: 8,
        marginTop: 8,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
    },
});