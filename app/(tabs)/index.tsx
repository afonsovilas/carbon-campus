import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol'; //
import { useThemeColor } from '@/hooks/use-theme-color'; //

export default function HomeScreen() {
    const iconColor = useThemeColor({}, 'icon');

    return (
        <ThemedView style={styles.container}>
            {/* 🚩 CONTENTOR DE ÍCONES NO TOPO DIREITO */}
            <View style={styles.topButtonsContainer}>
                {/* Ícone para Desafios (Novo) */}
                <Link href="/challenge" asChild>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                        {/* 'house.fill' é um exemplo; podes mapear 'trophy' no icon-symbol.tsx */}
                        <IconSymbol name="flag.fill" size={26} color={iconColor} />
                    </TouchableOpacity>
                </Link>

                {/* Ícone para Amigos/Invites */}
                <Link href="/invites" asChild>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                        <IconSymbol name="paperplane.fill" size={26} color={iconColor} />
                    </TouchableOpacity>
                </Link>
            </View>

            <ThemedText type="title">🌿 CarbonCampus</ThemedText>
            <ThemedText type="subtitle">Reduz a pegada de carbono</ThemedText>

            <ThemedView style={styles.card}>
                <ThemedText type="title">📊 1.247 pontos</ThemedText>
                <ThemedText>23kg CO₂ evitados</ThemedText>
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
        gap: 20,
        justifyContent: 'center'
    },
    // Posiciona o grupo de ícones no canto superior direito
    topButtonsContainer: {
        position: 'absolute',
        top: 60,
        right: 20,
        flexDirection: 'row', // Alinha os ícones lado a lado
        gap: 12,              // Espaço entre os ícones
        zIndex: 10,
    },
    iconButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)', // Dá um leve fundo para destacar o clique
        borderRadius: 12,
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