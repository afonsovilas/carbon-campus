import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const history = [
    { mode: 'Autocarro', distance: '2.3km', points: 45, date: '18/03' },
    { mode: 'Metro', distance: '1.8km', points: 38, date: '17/03' },
    { mode: 'Bicicleta', distance: '4.1km', points: 82, date: '16/03' },
];

export default function HistoryScreen() {
    return (
        <ScrollView style={styles.container}>
            <ThemedText type="title">📜 Histórico de Viagens</ThemedText>

            {history.map((trip, index) => (
                <ThemedView key={index} style={styles.tripItem}>
                    <ThemedText type="default">{trip.mode} ({trip.distance})</ThemedText>
                    <ThemedText type="subtitle">+{trip.points} pts • {trip.date}</ThemedText>
                </ThemedView>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    tripItem: {
        padding: 20,
        borderRadius: 12,
        marginVertical: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
