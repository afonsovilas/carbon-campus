import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCurrentUserUid } from '@/services/auth.service';
import {
    createChallengeInCloud,
    fetchChallengesFromCloud,
    sendChallengeInviteToCloud,
    UserChallenge,
} from '@/services/challenges.service';
import { isFirebaseConfigured } from '@/services/firebase';
import { findUserByTagFromCloud } from '@/services/users.service';
import { canCreateChallenge, findMockUserByTag } from '@/utils/functional-requirements';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChallengesScreen() {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [challenges, setChallenges] = useState<UserChallenge[]>([]);
    const [showInviteFor, setShowInviteFor] = useState<string | null>(null);
    const [searchTag, setSearchTag] = useState('');
    const [foundUser, setFoundUser] = useState<{ uid?: string; name: string; tag: string } | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!isFirebaseConfigured || process.env.NODE_ENV === 'test') return;
            try {
                const cloudChallenges = await fetchChallengesFromCloud();
                if (mounted) setChallenges(cloudChallenges);
            } catch (error) {
                console.warn('Failed to load challenges from Firebase:', error);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    const createChallenge = async () => {
        if (!canCreateChallenge(name, startDate, endDate)) return;

        let newChallenge: UserChallenge = {
            id: String(Date.now()),
            name, startDate, endDate,
            participants: [],
            createdAt: Date.now(),
        };

        if (isFirebaseConfigured && process.env.NODE_ENV !== 'test') {
            try {
                const created = await createChallengeInCloud({ name, startDate, endDate });
                if (created) newChallenge = created;
            } catch (error) {
                console.warn('Failed to save challenge to Firebase:', error);
            }
        }

        setChallenges((prev) => [newChallenge, ...prev]);
        setName(''); setStartDate(''); setEndDate('');
    };

    const handleSearchFriend = async () => {
        const normalizedTag = searchTag.trim();
        if (!normalizedTag) { setFoundUser(null); Alert.alert(t.error, t.username_not_found); return; }

        try {
            let user: { uid?: string; name: string; tag: string } | null = null;
            if (isFirebaseConfigured && process.env.NODE_ENV !== 'test') {
                user = await findUserByTagFromCloud(normalizedTag);
                const currentUid = getCurrentUserUid();
                if (user && currentUid && user.uid === currentUid) user = null;
            }
            if (!user) user = findMockUserByTag(normalizedTag);
            if (user) { setFoundUser(user); } else { setFoundUser(null); Alert.alert(t.error, t.username_not_found); }
        } catch {
            setFoundUser(null);
            Alert.alert(t.error, t.username_not_found);
        }
    };

    const confirmInvite = async (challengeId: string, friendTag: string) => {
        const challengeName = challenges.find(c => c.id === challengeId)?.name;
        if (isFirebaseConfigured && process.env.NODE_ENV !== 'test' && foundUser && challengeName) {
            try {
                await sendChallengeInviteToCloud({ challengeId, challengeName, friendTag, friendName: foundUser.name, friendUid: foundUser.uid });
            } catch (error) {
                console.warn('Failed to save challenge invite to Firebase:', error);
            }
        }
        Alert.alert(t.success, t.invite_sent_msg(challengeName ?? '', friendTag));
        setShowInviteFor(null); setSearchTag(''); setFoundUser(null);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <ThemedText type="title">{t.new_challenge}</ThemedText>

            <ThemedView style={styles.card}>
                <TextInput placeholder={t.challenge_name} placeholderTextColor="#9ca3af" style={styles.input} value={name} onChangeText={setName} />
                <View style={styles.row}>
                    <TextInput placeholder={t.start_date} placeholderTextColor="#9ca3af" style={[styles.input, { flex: 1 }]} value={startDate} onChangeText={setStartDate} />
                    <TextInput placeholder={t.end_date} placeholderTextColor="#9ca3af" style={[styles.input, { flex: 1 }]} value={endDate} onChangeText={setEndDate} />
                </View>
                <TouchableOpacity style={styles.createButton} onPress={createChallenge}>
                    <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>{t.create_challenge}</ThemedText>
                </TouchableOpacity>
            </ThemedView>

            <ThemedText type="subtitle" style={{ marginTop: 30, marginLeft: 10 }}>{t.active_challenges}</ThemedText>

            {showInviteFor && (
                <ThemedView style={styles.inviteFriendsContainer}>
                    <View style={styles.headerRow}>
                        <ThemedText type="defaultSemiBold">{t.invite_to_prefix} {challenges.find(c => c.id === showInviteFor)?.name}</ThemedText>
                        <TouchableOpacity onPress={() => { setShowInviteFor(null); setFoundUser(null); }}>
                            <ThemedText style={{ color: '#ef4444' }}>{t.close}</ThemedText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchContainer}>
                        <TextInput style={styles.innerInput} placeholder={t.search_friend_placeholder} placeholderTextColor="#9ca3af" value={searchTag} onChangeText={setSearchTag} />
                        <TouchableOpacity testID="search-friend-button" style={styles.searchButton} onPress={handleSearchFriend}>
                            <IconSymbol name="paperplane.fill" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    {foundUser && (
                        <View style={styles.foundUserCard}>
                            <View style={{ flex: 1 }}>
                                <ThemedText type="defaultSemiBold">{foundUser.name}</ThemedText>
                                <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>{foundUser.tag}</ThemedText>
                            </View>
                            <TouchableOpacity testID="confirm-invite-button" style={styles.addFriendButton} onPress={() => confirmInvite(showInviteFor, foundUser.tag)}>
                                <ThemedText style={{ color: 'white', fontSize: 12 }}>{t.invite_btn}</ThemedText>
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
                    <TouchableOpacity testID="invite-btn" style={styles.inviteButton} onPress={() => setShowInviteFor(item.id)}>
                        <IconSymbol name="paperplane.fill" size={20} color="white" />
                    </TouchableOpacity>
                </ThemedView>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 100 },
    contentContainer: { alignItems: 'center', justifyContent: 'flex-start', paddingBottom: 40, paddingTop: 40 },
    card: { padding: 15, marginTop: 20, borderRadius: 12, gap: 10, backgroundColor: 'rgba(255,255,255,0.1)', width: '100%' },
    input: { backgroundColor: 'white', padding: 12, borderRadius: 8, color: '#000' },
    row: { flexDirection: 'row', gap: 10, width: '100%' },
    createButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', width: '100%' },
    challengeItem: { padding: 15, borderRadius: 12, marginVertical: 5, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', width: '100%' },
    inviteButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 8 },
    inviteFriendsContainer: { marginTop: 10, marginBottom: 20, padding: 15, borderRadius: 12, backgroundColor: 'rgba(33, 150, 243, 0.1)', borderWidth: 1, borderColor: '#2196F3', width: '100%' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    searchContainer: { flexDirection: 'row', gap: 10, width: '100%' },
    innerInput: { flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 8, color: '#000' },
    searchButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8, justifyContent: 'center' },
    foundUserCard: { flexDirection: 'row', alignItems: 'center', marginTop: 15, padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, width: '100%' },
    addFriendButton: { backgroundColor: '#2196F3', padding: 8, borderRadius: 6 },
});