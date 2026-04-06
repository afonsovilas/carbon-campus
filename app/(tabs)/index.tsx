import { StyleSheet, TouchableOpacity } from 'react-native'; // Adicionado TouchableOpacity
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol'; // Importar o teu componente de ícones
import { useThemeColor } from '@/hooks/use-theme-color'; // Para usar a cor do tema

export default function HomeScreen() {
    // Obtém a cor do ícone definida no teu theme.ts
    const iconColor = useThemeColor({}, 'icon');

    return (
        <ThemedView style={styles.container}>
            {/* ÍCONE DE AMIGOS NO TOPO DIREITO */}
            <Link href="/invites" asChild>
                <TouchableOpacity style={styles.friendsButton}>
                    <IconSymbol name="paperplane.fill" size={28} color={iconColor} />
                </TouchableOpacity>
            </Link>

            <ThemedText type="title">🌿 CarbonCampus</ThemedText>
            <ThemedText type="subtitle">Reduz a pegada de carbono</ThemedText>

            {/* O resto do teu código atual (Cards e Botões) mantém-se igual... */}
            <ThemedView style={styles.card}>
                <ThemedText type="title">📊 1.247 pontos</ThemedText>
                <ThemedText>23kg CO₂ evitados</ThemedText>
            </ThemedView>

            <ThemedView style={styles.button} onTouchEnd={() => {}}>
                <ThemedText type="title">➕ Registar Viagem</ThemedText>
            </ThemedView>

            {/* ... restante do código ... */}
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
    // ESTILO PARA O BOTÃO NO TOPO DIREITO
    friendsButton: {
        position: 'absolute',
        top: 50, // Ajusta conforme a barra de status do teu telemóvel
        right: 20,
        padding: 10,
        zIndex: 10, // Garante que fica por cima de outros elementos
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