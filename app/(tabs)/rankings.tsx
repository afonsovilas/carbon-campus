import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const courseData = [
    { name: 'MIEIC', points: 2450, position: 1 },
    { name: 'LCC', points: 1980, position: 2 },
    { name: 'LEI', points: 1670, position: 3 },
];

export default function RankingScreen() {
    return (
        <ScrollView style={styles.container}>
            <ThemedText type="title">🏆 Ranking Cursos</ThemedText>

            {courseData.map((course, index) => (
                <ThemedView
                    key={index}
                    style={[
                        styles.rankingItem,
                        course.position === 1 ? styles.position1 :
                            course.position === 2 ? styles.position2 :
                                styles.position3
                    ]}
                >
                    <ThemedText type="title">#{course.position} {course.name}</ThemedText>
                    <ThemedText>{course.points.toLocaleString()} pts</ThemedText>
                </ThemedView>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    rankingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 12,
        marginVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderLeftWidth: 5,
    },
    position1: { borderLeftColor: '#FFD700' },  // Ouro
    position2: { borderLeftColor: '#C0C0C0' },  // Prata
    position3: { borderLeftColor: '#CD7F32' },  // Bronze
});
