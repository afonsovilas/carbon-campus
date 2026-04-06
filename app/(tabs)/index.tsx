import { StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol'; // Import necessário
import { useThemeColor } from '@/hooks/use-theme-color'; // Para a cor do ícone

export default function HomeScreen() {
    const iconColor = useThemeColor({}, 'icon');

    return (
        <ThemedView style={styles.container}>
            {/* Ícone para ir para Amigos (User Story 1) */}
            <Link href="/invites" asChild>
                <TouchableOpacity style={styles.friendsButton}>
                    <IconSymbol name="paperplane.fill" size={28} color={iconColor} />
                </TouchableOpacity>
            </Link>

            <ThemedText type="title">🌿 CarbonCampus</ThemedText>
            <ThemedText type="subtitle">Reduz a pegada de carbono</ThemedText>

            <ThemedView style={styles.card}>
                <ThemedText type="title">📊 1.247 pontos</ThemedText>
                <ThemedText>23kg CO₂ evitados</ThemedText>
            </ThemedView>

            {/* Mudámos para TouchableOpacity para ter feedback de clique */}
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
    container: { flex: 1, padding: 20, gap: 20, justifyContent: 'center' },
    friendsButton: {
        position: 'absolute',
        top: 60,
        right: 25,
        zIndex: 10,
    },
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