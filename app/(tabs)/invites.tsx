import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FriendsScreen() {
    const theme = useColorScheme() ?? 'light';
    const [searchTag, setSearchTag] = useState('');
    const [foundUser, setFoundUser] = useState<{ name: string; tag: string } | null>(null);
    const [status, setStatus] = useState<'idle' | 'searching' | 'error' | 'sent'>('idle');

    const handleSearch = () => {
        setStatus('searching');
        // Simulação da lógica de pesquisa (Cenário 1 e 2)
        setTimeout(() => {
            if (searchTag.toLowerCase() === 'user1') {
                setFoundUser({ name: 'User1', tag: '@user1_carbon' });
                setStatus('idle');
            } else {
                setFoundUser(null);
                setStatus('error');
            }
        }, 800);
    };

    const sendRequest = () => {
        setStatus('sent');
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
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
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
    container: { flex: 1, padding: 20, gap: 20 },
    searchContainer: { flexDirection: 'row', gap: 10, marginTop: 10 },
    input: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 },
    searchButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 12, justifyContent: 'center' },
    profileCard: {
        padding: 20, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)',
        flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 20
    },
    profileInfo: { flex: 1 },
    actionButton: { backgroundColor: '#22c55e', padding: 10, borderRadius: 8 },
    disabledButton: { backgroundColor: '#9ca3af' },
    errorText: { color: '#ef4444', marginTop: 10 }
});