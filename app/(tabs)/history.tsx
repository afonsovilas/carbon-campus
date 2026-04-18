import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTrips } from '@/contexts/TripsContext';
import { ScrollView, StyleSheet } from 'react-native';

export default function HistoryScreen() {
    const { trips } = useTrips();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <ThemedText type="title">📜 Histórico de Viagens</ThemedText>

            {trips.length === 0 ? (
                <ThemedText type="default" style={styles.emptyMessage}>
                    Nenhuma viagem registada ainda
                </ThemedText>
            ) : (
                trips.map((trip) => (
                    <ThemedView key={trip.id} style={styles.tripItem}>
                        <ThemedText type="default">{trip.mode} ({trip.distance}km)</ThemedText>
                        <ThemedText type="subtitle">+{trip.points} pts • {trip.date}</ThemedText>
                    </ThemedView>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 100 },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 40,
        paddingTop: 40,
    },
    tripItem: {
        padding: 20,
        borderRadius: 12,
        marginVertical: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    emptyMessage: {
        marginTop: 40,
        opacity: 0.7,
        textAlign: 'center',
    },
});
