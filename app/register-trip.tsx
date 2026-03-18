import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function RegisterTripScreen() {
    const register = () => {
        alert('Viagem Autocarro +45 pts registada!');
        router.back();
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">➕ Registar Viagem</ThemedText>

            <ThemedView style={styles.card}>
                <ThemedText type="subtitle">Modo: Autocarro</ThemedText>
                <ThemedText type="subtitle">Distância: 2.3km</ThemedText>
                <ThemedText type="title">Pontos: +45</ThemedText>
            </ThemedView>

            <ThemedView style={styles.button} onTouchEnd={register}>
                <ThemedText type="title">CONFIRMAR REGISTO</ThemedText>
            </ThemedView>

            <ThemedView style={styles.backButton} onTouchEnd={() => router.back()}>
                <ThemedText>← Voltar</ThemedText>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 30, gap: 24, justifyContent: 'center'
    },
    card: {
        padding: 24, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)'
    },
    button: {
        padding: 20, borderRadius: 16, backgroundColor: '#4CAF50', alignItems: 'center'
    },
    backButton: {
        padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#CCC', borderRadius: 8
    },
});
