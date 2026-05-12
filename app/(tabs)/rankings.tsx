import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTrips } from '@/contexts/TripsContext';
import { onLeaderboardRefresh } from '@/services/leaderboard-events';
import { fetchLeaderboardFromCloud, LeaderboardPayload } from '@/services/leaderboard.service';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

type LeaderboardType = 'courses' | 'students';

export default function RankingScreen() {
    const { tripsCount } = useTrips();
    const [activeTab, setActiveTab] = useState<LeaderboardType>('courses');
    const [leaderboard, setLeaderboard] = useState<LeaderboardPayload>({ students: [], courses: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const loadLeaderboard = useCallback(async (attempt = 0) => {
        try {
            setIsLoading(true);
            setLoadError(null);
            const data = await fetchLeaderboardFromCloud();
            setLeaderboard(data);
        } catch (error: any) {
            const isPermission = error?.code === 'permission-denied' || error?.message?.includes('permissions');
            if (isPermission && attempt < 3) {
                await new Promise(res => setTimeout(res, 1500 * (attempt + 1)));
                return loadLeaderboard(attempt + 1);
            }
            console.warn('Failed to load leaderboard from Firebase:', error);
            setLoadError(error?.message ?? 'Erro ao carregar leaderboard');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (process.env.NODE_ENV === 'test') {
            let mounted = true;

            const loadLeaderboardForTest = async () => {
                try {
                    setIsLoading(true);
                    const data = await fetchLeaderboardFromCloud();
                    if (mounted) {
                        setLeaderboard(data);
                    }
                } catch (error) {
                    console.warn('Failed to load leaderboard from Firebase:', error);
                } finally {
                    if (mounted) {
                        setIsLoading(false);
                    }
                }
            };

            loadLeaderboardForTest();

            return () => {
                mounted = false;
            };
        }

        let mounted = true;

        const { onAuthStateChange } = require('@/services/auth.service');

        const unsubscribe = onAuthStateChange((uid: string | null) => {
            if (!uid) {
                if (mounted) {
                    setLeaderboard({ students: [], courses: [] });
                    setIsLoading(false);
                }
                return;
            }

            loadLeaderboard();
        });

        const unsubscribeLeaderboardRefresh = onLeaderboardRefresh(() => {
            if (mounted) {
                loadLeaderboard();
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
            unsubscribeLeaderboardRefresh();
        };
    }, [loadLeaderboard]);

    useFocusEffect(
        useCallback(() => {
            if (process.env.NODE_ENV === 'test' || tripsCount === 0) {
                return;
            }

            loadLeaderboard();
        }, [loadLeaderboard, tripsCount])
    );

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
                    onPress={() => router.push('/(tabs)/LogTripScreen')}
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
    const courseRows = leaderboard.courses;
    const studentRows = leaderboard.students;

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>🏆 LeaderBoards</ThemedText>

            {isLoading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <ThemedText style={styles.loadingText}>A carregar leaderboard...</ThemedText>
                </View>
            ) : null}

            {loadError ? (
                <View style={styles.loadingBox}>
                    <ThemedText style={{ color: '#ef4444', textAlign: 'center', fontSize: 13 }}>
                        ⚠ {loadError}
                    </ThemedText>
                </View>
            ) : null}

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
                {activeTab === 'courses'
                    ? courseRows.map((item, index) => (
                        <View key={item.course} style={[styles.leaderboardRow, index === 3 && styles.highlightedRow]}>
                            <ThemedText type="default" style={[styles.cell, styles.posColumn]}>
                                {item.pos}
                            </ThemedText>
                            <ThemedText type="default" style={[styles.cell, styles.nameColumn]}>
                                {item.course}
                            </ThemedText>
                            <ThemedText type="default" style={[styles.cell, styles.pointsColumn]}>
                                {item.points}
                            </ThemedText>
                        </View>
                    ))
                    : studentRows.map((item, index) => (
                        <View key={item.uid} style={[styles.leaderboardRow, index === 3 && styles.highlightedRow]}>
                            <ThemedText type="default" style={[styles.cell, styles.posColumn]}>
                                {item.pos}
                            </ThemedText>
                            <ThemedText type="default" style={[styles.cell, styles.nameColumn]}>
                                {item.name}
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
        paddingTop: 100,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        marginBottom: 40,
        textAlign: 'center',
    },
    loadingBox: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 16,
    },
    loadingText: {
        opacity: 0.8,
    },
    leaderboardContainer: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        padding: 16,
        width: '100%',
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
        width: '100%',
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