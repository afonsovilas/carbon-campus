import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const AVATAR_OPTIONS = ['🧑', '👩', '🧔', '👩‍💻', '🧑‍🎓', '👨‍🎓', '🌱', '🚴', '🌍'];

export default function ProfileScreen() {
    const router = useRouter();
    const { user, updateUser } = useUser();

    const [editVisible, setEditVisible] = useState(false);
    const [inviteAppVisible, setInviteAppVisible] = useState(false);
    const [inviteChallengeVisible, setInviteChallengeVisible] = useState(false);

    // Edit form state
    const [draftName, setDraftName] = useState(user.name);
    const [draftEmail, setDraftEmail] = useState(user.email);
    const [draftTag, setDraftTag] = useState(user.tag);
    const [draftBio, setDraftBio] = useState(user.bio);
    const [draftAvatar, setDraftAvatar] = useState(user.avatarEmoji);

    // Invite state
    const [inviteEmail, setInviteEmail] = useState('');
    const [challengeEmail, setChallengeEmail] = useState('');

    const openEdit = () => {
        setDraftName(user.name);
        setDraftEmail(user.email);
        setDraftTag(user.tag);
        setDraftBio(user.bio);
        setDraftAvatar(user.avatarEmoji);
        setEditVisible(true);
    };

    const saveEdit = () => {
        if (!draftName.trim()) {
            Alert.alert('Erro', 'O nome não pode estar vazio.');
            return;
        }
        updateUser({
            name: draftName.trim(),
            email: draftEmail.trim(),
            tag: draftTag.trim(),
            bio: draftBio.trim(),
            avatarEmoji: draftAvatar,
        });
        setEditVisible(false);
        Alert.alert('Guardado', 'Perfil atualizado com sucesso!');
    };

    const sendAppInvite = () => {
        if (!inviteEmail.trim()) {
            Alert.alert('Erro', 'Insere um email.');
            return;
        }
        Alert.alert('📩 Convite enviado', `Convite para a app enviado para ${inviteEmail.trim()}.`);
        setInviteEmail('');
        setInviteAppVisible(false);
    };

    const sendChallengeInvite = () => {
        if (!challengeEmail.trim()) {
            Alert.alert('Erro', 'Insere um email.');
            return;
        }
        Alert.alert('🏆 Convite enviado', `Convite para desafio enviado para ${challengeEmail.trim()}.`);
        setChallengeEmail('');
        setInviteChallengeVisible(false);
    };

    const handleLogout = () => {
        Alert.alert('Terminar sessão', 'Tens a certeza que queres sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: () => router.replace('/login' as any),
            },
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <View style={styles.avatarSection}>
                <Text style={styles.avatarLarge}>{user.avatarEmoji}</Text>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.tag}>{user.tag}</Text>
                {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
            </View>

            {/* Opções */}
            <View style={styles.menu}>

                <MenuItem
                    icon="person-outline"
                    label="Gerir conta"
                    sub="Editar nome, foto, email e bio"
                    onPress={openEdit}
                />

                <MenuItem
                    icon="share-social-outline"
                    label="Convidar para a app"
                    sub="Partilhar CarbonCampus com amigos"
                    onPress={() => setInviteAppVisible(true)}
                />

                <MenuItem
                    icon="trophy-outline"
                    label="Convidar para desafio"
                    sub="Desafiar alguém a reduzir CO₂"
                    onPress={() => setInviteChallengeVisible(true)}
                />

                <MenuItem
                    icon="log-out-outline"
                    label="Terminar sessão"
                    sub="Sair da conta atual"
                    danger
                    onPress={handleLogout}
                />

            </View>

            <Modal visible={editVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Gerir conta</Text>

                        <Text style={styles.label}>Avatar</Text>
                        <View style={styles.avatarGrid}>
                            {AVATAR_OPTIONS.map(em => (
                                <TouchableOpacity
                                    key={em}
                                    style={[styles.avatarOption, draftAvatar === em && styles.avatarSelected]}
                                    onPress={() => setDraftAvatar(em)}
                                >
                                    <Text style={{ fontSize: 26 }}>{em}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Nome</Text>
                        <TextInput
                            style={styles.input}
                            value={draftName}
                            onChangeText={setDraftName}
                            placeholder="Nome"
                            placeholderTextColor="#9ca3af"
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={draftEmail}
                            onChangeText={setDraftEmail}
                            placeholder="email@fe.up.pt"
                            placeholderTextColor="#9ca3af"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Tag</Text>
                        <TextInput
                            style={styles.input}
                            value={draftTag}
                            onChangeText={setDraftTag}
                            placeholder="@tag"
                            placeholderTextColor="#9ca3af"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, { height: 72, textAlignVertical: 'top' }]}
                            value={draftBio}
                            onChangeText={setDraftBio}
                            placeholder="Escreve algo sobre ti..."
                            placeholderTextColor="#9ca3af"
                            multiline
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.btnSecondary} onPress={() => setEditVisible(false)}>
                                <Text style={styles.btnSecondaryText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimary} onPress={saveEdit}>
                                <Text style={styles.btnPrimaryText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ── Modal: Convidar para a app ── */}
            <Modal visible={inviteAppVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>📩 Convidar para a app</Text>
                        <Text style={styles.modalSub}>Insere o email da pessoa que queres convidar para o CarbonCampus.</Text>
                        <TextInput
                            style={[styles.input, { marginTop: 12 }]}
                            value={inviteEmail}
                            onChangeText={setInviteEmail}
                            placeholder="email@exemplo.com"
                            placeholderTextColor="#9ca3af"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.btnSecondary} onPress={() => setInviteAppVisible(false)}>
                                <Text style={styles.btnSecondaryText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimary} onPress={sendAppInvite}>
                                <Text style={styles.btnPrimaryText}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={inviteChallengeVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>🏆 Convidar para desafio</Text>
                        <Text style={styles.modalSub}>Insere o email da pessoa que queres desafiar a reduzir CO₂.</Text>
                        <TextInput
                            style={[styles.input, { marginTop: 12 }]}
                            value={challengeEmail}
                            onChangeText={setChallengeEmail}
                            placeholder="email@exemplo.com"
                            placeholderTextColor="#9ca3af"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.btnSecondary} onPress={() => setInviteChallengeVisible(false)}>
                                <Text style={styles.btnSecondaryText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimary} onPress={sendChallengeInvite}>
                                <Text style={styles.btnPrimaryText}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}


function MenuItem({ icon, label, sub, danger, onPress }: {
    icon: any;
    label: string;
    sub: string;
    danger?: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
                <Ionicons name={icon} size={22} color={danger ? '#ef4444' : '#4CAF50'} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.menuLabel, danger && { color: '#ef4444' }]}>{label}</Text>
                <Text style={styles.menuSub}>{sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>
    );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    content: { padding: 24, gap: 24, paddingBottom: 48 },

    avatarSection: { alignItems: 'center', gap: 6, paddingTop: 8 },
    avatarLarge: { fontSize: 72 },
    name: { fontSize: 22, fontWeight: '700', color: '#111827' },
    tag: { fontSize: 14, color: '#6b7280' },
    bio: { fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 4 },

    menu: { gap: 10 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        gap: 14,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#e8f5e9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBoxDanger: { backgroundColor: '#fee2e2' },
    menuLabel: { fontSize: 15, fontWeight: '600', color: '#111827' },
    menuSub: { fontSize: 12, color: '#9ca3af', marginTop: 2 },

    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 420,
        gap: 6,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
    modalSub: { fontSize: 13, color: '#6b7280' },
    label: { fontSize: 13, fontWeight: '600', color: '#374151', marginTop: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#f9fafb',
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginVertical: 6,
    },
    avatarOption: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarSelected: {
        borderColor: '#4CAF50',
        backgroundColor: '#e8f5e9',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
    },
    btnPrimary: {
        flex: 1,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        padding: 13,
        alignItems: 'center',
    },
    btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    btnSecondary: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        padding: 13,
        alignItems: 'center',
    },
    btnSecondaryText: { color: '#374151', fontWeight: '600', fontSize: 15 },
});