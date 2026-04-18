import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTrips } from '@/contexts/TripsContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type LeaderboardType = 'courses' | 'students';

// Dados mock de cursos
const COURSES_LEADERBOARD = [
    { pos: 1, course: 'Engenharia Informática', points: 8250 },
    { pos: 2, course: 'Engenharia Ambiental', points: 8000 },
    { pos: 3, course: 'Administração', points: 7400 },
    { pos: 4, course: 'Gestão', points: 7200 },
    { pos: 5, course: 'Contabilidade', points: 6250 },
    { pos: 6, course: 'Marketing', points: 6000 },
    { pos: 7, course: 'Recursos Humanos', points: 5400 },
];

// Dados mock de alunos
const STUDENTS_LEADERBOARD = [
    { pos: 1, name: 'João Silva', points: 8250 },
    { pos: 2, name: 'Maria Santos', points: 8000 },
    { pos: 3, name: 'Pedro Oliveira', points: 7400 },
    { pos: 4, name: 'Ana Costa', points: 7200 },
    { pos: 5, name: 'Carlos Mendes', points: 6250 },
    { pos: 6, name: 'Lucia Ferreira', points: 6000 },
    { pos: 7, name: 'Roberto Alves', points: 5400 },
];

export default function RankingScreen() {
    const { tripsCount } = useTrips();
    const [activeTab, setActiveTab] = useState<LeaderboardType>('courses');

    // Se não houver viagens, mostra a tela bloqueada
    if (tripsCount === 0) {
        return (
            <ThemedView style={styles.lockedContainer}>
                <Ionicons
                    name="lock-closed"
                    size={120}
                    color="#D1D1D6"
                    style={styles.icon}
                />

                <ThemedText type="title" style={styles.lockedTitle} testID="locked-title">
                    Tabela bloqueada!
                </ThemedText>

                <ThemedText style={styles.lockedDescription}>
                    As LeaderBoards encontram-se bloqueadas, regista a tua primeira viagem para as desbloqueares!
                </ThemedText>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('LogTripScreen')}
                    testID="register-trip-button"
                >
                    <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                        Registar 1ª Viagem
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    // Se houver viagens, mostra a leaderboard
    const leaderboardData = activeTab === 'courses' ? COURSES_LEADERBOARD : STUDENTS_LEADERBOARD;

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>🏆 LeaderBoards</ThemedText>

            {/* Leaderboard Content */}
            <ScrollView style={styles.leaderboardContainer} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.leaderboardHeader}>
                    <ThemedText type="defaultSemiBold" style={[styles.headerCell, styles.posColumn]}>
                        Pos
                    </ThemedText>
                    <ThemedText type="defaultSemiBold" style={[styles.headerCell, styles.nameColumn]}>
                        {activeTab === 'courses' ? 'Curso' : 'Nome'}
                    </ThemedText>
                    <ThemedText type="defaultSemiBold" style={[styles.headerCell, styles.pointsColumn]}>
                        Pontos
                    </ThemedText>
                </View>

                {/* Rows */}
                {leaderboardData.map((item, index) => (
                    <View key={index} style={[styles.leaderboardRow, index === 3 && styles.highlightedRow]}>
                        <ThemedText type="default" style={[styles.cell, styles.posColumn]}>
                            {item.pos}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.cell, styles.nameColumn]}>
                            {'course' in item ? item.course : item.name}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.cell, styles.pointsColumn]}>
                            {item.points}
                        </ThemedText>
                    </View>
                ))}
            </ScrollView>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'courses' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('courses')}
                >
                    <ThemedText
                        type="defaultSemiBold"
                        style={[styles.tabText, activeTab === 'courses' && styles.tabTextActive]}
                    >
                        Cursos
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'students' && styles.tabButtonActive]}
                    onPress={() => setActiveTab('students')}
                >
                    <ThemedText
                        type="defaultSemiBold"
                        style={[styles.tabText, activeTab === 'students' && styles.tabTextActive]}
                    >
                        Alunos
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
    },
    leaderboardContainer: {
        flex: 1,
        marginBottom: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        padding: 16,
    },
    leaderboardHeader: {
        flexDirection: 'row',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
        marginBottom: 12,
    },
    leaderboardRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    highlightedRow: {
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
    },
    headerCell: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    cell: {
        fontSize: 14,
    },
    posColumn: {
        width: '15%',
        textAlign: 'center',
    },
    nameColumn: {
        width: '60%',
        paddingHorizontal: 8,
    },
    pointsColumn: {
        width: '25%',
        textAlign: 'right',
        paddingRight: 8,
    },
    tabContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 10,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    tabText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    tabTextActive: {
        color: 'white',
    },
    lockedContainer: {
        flex: 1,
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    icon: {
        marginBottom: 20,
    },
    lockedTitle: {
        fontSize: 24,
        textAlign: 'center',
    },
    lockedDescription: {
        textAlign: 'center',
        fontSize: 16,
        opacity: 0.8,
        lineHeight: 22,
        marginBottom: 30,
    },
    button: {
        paddingVertical: 18,
        paddingHorizontal: 30,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});