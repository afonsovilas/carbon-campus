import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTrips } from '@/contexts/TripsContext';
import { useUser } from '@/contexts/UserContext';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();
    const { trips } = useTrips();
    const { user } = useUser();

    const points = trips.reduce((total, trip) => total + trip.points, 0);
    const carbonSaved = (points / 15).toFixed(1);

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">🌿 CarbonCampus</ThemedText>
            <ThemedText type="subtitle">Reduz a pegada de carbono</ThemedText>

            <ThemedView style={styles.card}>
                <ThemedText type="title">📊 {points} pontos</ThemedText>
                <ThemedText>{carbonSaved}kg CO₂ evitados</ThemedText>
                <ThemedText>{user.course}</ThemedText>
                <Link href="../rewardScreen" asChild>
                    <TouchableOpacity style={styles.smallButton} activeOpacity={0.7}>
                        <ThemedText type="title" style={{fontSize:20}}>Levantar</ThemedText>
                    </TouchableOpacity>
                </Link>
            </ThemedView>

            <TouchableOpacity 
                style={styles.button} 
                activeOpacity={0.7}
                onPress={() => router.push('/(tabs)/LogTripScreen')}
            >
                <ThemedText type="title">➕ Registar Viagem</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button} 
                activeOpacity={0.7}
                onPress={() => router.push('/(tabs)/rankings')}
            >
                <ThemedText type="title">🏆 Ranking</ThemedText>
            </TouchableOpacity>

            <ThemedView style={styles.card}>
                <ThemedText type="title">🎓 {user.course || 'Sem curso'}</ThemedText>
                <ThemedText>{trips.length} viagens registadas</ThemedText>
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