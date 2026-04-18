import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChallengesScreen() {
    // --- Estados para Criação de Desafios ---
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [challenges, setChallenges] = useState<any[]>([]);

    // --- Estados para Convites (User Story 1 adaptada) ---
    const [showInviteFor, setShowInviteFor] = useState<number | null>(null);
    const [searchTag, setSearchTag] = useState('');
    const [foundUser, setFoundUser] = useState<{ name: string; tag: string } | null>(null);

    const createChallenge = () => {
        if (name && startDate && endDate) {
            const newChallenge = { id: Date.now(), name, startDate, endDate, participants: [] };
            setChallenges([newChallenge, ...challenges]);
            setName(''); setStartDate(''); setEndDate('');
        }
    };

    const handleSearchFriend = () => {
        // Simulação da mesma lógica do ecrã de Invites
        if (searchTag.toLowerCase() === 'user1') {
            setFoundUser({ name: 'User1', tag: '@user1_carbon' });
        } else {
            setFoundUser(null);
            Alert.alert("Erro", "Username does not exist");
        }
    };

    const confirmInvite = (challengeId: number, friendTag: string) => {
        const challengeName = challenges.find(c => c.id === challengeId)?.name;
        Alert.alert("Success", `Invite to ${challengeName} sent to ${friendTag}`);
        setShowInviteFor(null);
        setSearchTag('');
        setFoundUser(null);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <ThemedText type="title">🏆 New Challenge</ThemedText>

            <ThemedView style={styles.card}>
                <TextInput
                    placeholder="Challenge Name"
                    placeholderTextColor="#9ca3af"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
                <View style={styles.row}>
                    <TextInput
                        placeholder="Start (DD/MM)"
                        placeholderTextColor="#9ca3af"
                        style={[styles.input, { flex: 1 }]}
                        value={startDate}
                        onChangeText={setStartDate}
                    />
                    <TextInput
                        placeholder="End (DD/MM)"
                        placeholderTextColor="#9ca3af"
                        style={[styles.input, { flex: 1 }]}
                        value={endDate}
                        onChangeText={setEndDate}
                    />
                </View>
                <TouchableOpacity style={styles.createButton} onPress={createChallenge}>
                    <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>Create Challenge</ThemedText>
                </TouchableOpacity>
            </ThemedView>

            <ThemedText type="subtitle" style={{ marginTop: 30, marginLeft: 10 }}>Active Challenges</ThemedText>

            {/* CONTENTOR DE CONVITE DINÂMICO */}
            {showInviteFor && (
                <ThemedView style={styles.inviteFriendsContainer}>
                    <View style={styles.headerRow}>
                        <ThemedText type="defaultSemiBold">Invite to: {challenges.find(c => c.id === showInviteFor)?.name}</ThemedText>
                        <TouchableOpacity onPress={() => { setShowInviteFor(null); setFoundUser(null); }}>
                            <ThemedText style={{ color: '#ef4444' }}>Close</ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.innerInput}
                            placeholder="Search friend by tag..."
                            placeholderTextColor="#9ca3af"
                            value={searchTag}
                            onChangeText={setSearchTag}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearchFriend}>
                            <IconSymbol name="paperplane.fill" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {foundUser && (
                        <View style={styles.foundUserCard}>
                            <View style={{ flex: 1 }}>
                                <ThemedText type="defaultSemiBold">{foundUser.name}</ThemedText>
                                <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>{foundUser.tag}</ThemedText>
                            </View>
                            <TouchableOpacity
                                style={styles.addFriendButton}
                                onPress={() => confirmInvite(showInviteFor, foundUser.tag)}
                            >
                                <ThemedText style={{ color: 'white', fontSize: 12 }}>Invite</ThemedText>
                            </TouchableOpacity>
                        </View>
                    )}
                </ThemedView>
            )}

            {challenges.map((item) => (
                <ThemedView key={item.id} style={styles.challengeItem}>
                    <View style={{ flex: 1 }}>
                        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                        <ThemedText type="default">{item.startDate} to {item.endDate}</ThemedText>
                    </View>

                    <TouchableOpacity
                        style={styles.inviteButton}
                        onPress={() => setShowInviteFor(item.id)}
                    >
                        <IconSymbol name="paperplane.fill" size={20} color="white" />
                    </TouchableOpacity>
                </ThemedView>
            ))}
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
    card: { padding: 15, marginTop: 20, borderRadius: 12, gap: 10, backgroundColor: 'rgba(255,255,255,0.1)', width: '100%' },
    input: { backgroundColor: 'white', padding: 12, borderRadius: 8, color: '#000' },
    row: { flexDirection: 'row', gap: 10, width: '100%' },
    createButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', width: '100%' },

    // Lista de Desafios
    challengeItem: {
        padding: 15, borderRadius: 12, marginVertical: 5,
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', width: '100%'
    },
    inviteButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 8 },

    // Contentor de Convite (O que pediste)
    inviteFriendsContainer: {
        marginTop: 10, marginBottom: 20, padding: 15, borderRadius: 12,
        backgroundColor: 'rgba(33, 150, 243, 0.1)', borderWidth: 1, borderColor: '#2196F3', width: '100%'
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    searchContainer: { flexDirection: 'row', gap: 10, width: '100%' },
    innerInput: { flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 8, color: '#000' },
    searchButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8, justifyContent: 'center' },

    // Resultado da Pesquisa
    foundUserCard: {
        flexDirection: 'row', alignItems: 'center', marginTop: 15,
        padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, width: '100%'
    },
    addFriendButton: { backgroundColor: '#2196F3', padding: 8, borderRadius: 6 }
});