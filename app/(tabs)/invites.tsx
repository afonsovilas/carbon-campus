import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getCurrentUserUid } from '@/services/auth.service';
import { isFirebaseConfigured } from '@/services/firebase';
import { sendFriendRequestToCloud } from '@/services/invites.service';
import { findUserByTagFromCloud } from '@/services/users.service';
import { findMockUserByTag } from '@/utils/functional-requirements';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function FriendsScreen() {
    const theme = useColorScheme() ?? 'light';
    const [searchTag, setSearchTag] = useState('');
    const [foundUser, setFoundUser] = useState<{ uid?: string; name: string; tag: string } | null>(null);
    const [status, setStatus] = useState<'idle' | 'searching' | 'error' | 'sent'>('idle');

    const handleSearch = () => {
        setStatus('searching');
        setTimeout(async () => {
            const normalizedTag = searchTag.trim();

            if (!normalizedTag) {
                setFoundUser(null);
                setStatus('error');
                return;
            }

            try {
                let user: { uid?: string; name: string; tag: string } | null = null;

                if (isFirebaseConfigured && process.env.NODE_ENV !== 'test') {
                    user = await findUserByTagFromCloud(normalizedTag);

                    // Avoid inviting yourself when logged in.
                    const currentUid = getCurrentUserUid();
                    if (user && currentUid && user.uid === currentUid) {
                        user = null;
                    }
                }

                if (!user) {
                    user = findMockUserByTag(normalizedTag);
                }

                if (user) {
                    setFoundUser(user);
                    setStatus('idle');
                } else {
                    setFoundUser(null);
                    setStatus('error');
                }
            } catch (error) {
                setFoundUser(null);
                setStatus('error');
            }
        }, 800);
    };

    const sendRequest = async () => {
        if (!foundUser) {
            return;
        }

        try {
            if (isFirebaseConfigured && process.env.NODE_ENV !== 'test') {
                await sendFriendRequestToCloud(foundUser);
            }
            setStatus('sent');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Invite your friends</ThemedText>

            <View style={styles.searchContainer}>
                <TextInput
                    style={[styles.input, { color: Colors[theme].text, borderColor: Colors[theme].icon }]}
                    placeholder="Search by tag..."
                    placeholderTextColor={Colors[theme].icon}
                    value={searchTag}
                    onChangeText={setSearchTag}
                />
                <TouchableOpacity testID="search-button" style={styles.searchButton} onPress={handleSearch}>
                    <IconSymbol name="paperplane.fill" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {status === 'error' && (
                <ThemedText style={styles.errorText}>Username does not exist</ThemedText>
            )}

            {foundUser && (
                <ThemedView style={styles.profileCard}>
                    <IconSymbol name="house.fill" size={40} color={Colors[theme].tint} />
                    <View style={styles.profileInfo}>
                        <ThemedText type="subtitle">{foundUser.name}</ThemedText>
                        <ThemedText>{foundUser.tag}</ThemedText>
                    </View>
                    <TouchableOpacity
                        testID="send-request-button"
                        style={[styles.actionButton, status === 'sent' && styles.disabledButton]}
                        onPress={sendRequest}
                        disabled={status === 'sent'}
                    >
                        <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
                            {status === 'sent' ? 'Pending' : 'Send Request'}
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, gap: 20, alignItems: 'center', width: '100%', paddingTop: 100, justifyContent: 'flex-start' },
    searchContainer: { flexDirection: 'row', gap: 10, marginTop: 10, width: '100%' },
    input: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 },
    searchButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 12, justifyContent: 'center' },
    profileCard: {
        padding: 20, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 20, width: '100%'
    },
    profileInfo: { flex: 1 },
    actionButton: { backgroundColor: '#22c55e', padding: 10, borderRadius: 8 },
    disabledButton: { backgroundColor: '#9ca3af' },
    errorText: { color: '#ef4444', marginTop: 10 }
});