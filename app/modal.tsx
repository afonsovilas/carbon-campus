import { StyleSheet } from 'react-native';  // ← IMPORT FALTAVA
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileModal() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">👤 Perfil</ThemedText>
            <ThemedText>Cunha • MIEIC</ThemedText>
            <ThemedText type="subtitle">1.247 pontos</ThemedText>

            <ThemedView style={styles.button}>
                <ThemedText type="default">Editar Perfil</ThemedText>
            </ThemedView>

            <ThemedView style={styles.button}>
                <ThemedText type="default">Sair</ThemedText>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({  // ← AQUI
    container: {
        flex: 1,
        padding: 30,
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: '100%',
        alignItems: 'center'
    },
});
