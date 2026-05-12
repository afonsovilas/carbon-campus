import { useUser } from '@/contexts/UserContext';
import { signOutUser } from '@/services/auth.service';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal, Platform, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const AVATAR_OPTIONS = ['🧑', '👩', '🧔', '👩‍💻', '🧑‍🎓', '👨‍🎓', '🌱', '🚴', '🌍'];
const COURSE_OPTIONS = [
    'Engenharia Informática',
    'Engenharia Ambiental',
    'Administração',
    'Gestão',
    'Contabilidade',
    'Marketing',
    'Recursos Humanos',
    'Sem curso',
];

export default function ProfileScreen() {
    const router = useRouter();
    const { user, updateUser } = useUser();

    const [editVisible, setEditVisible] = useState(false);
    const [inviteAppVisible, setInviteAppVisible] = useState(false);
    const [inviteChallengeVisible, setInviteChallengeVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [draftName, setDraftName] = useState(user.name);
    const [draftEmail] = useState(user.email);
    const [draftTag, setDraftTag] = useState(user.tag);
    const [draftBio, setDraftBio] = useState(user.bio);
    const [draftAvatar, setDraftAvatar] = useState(user.avatarEmoji);
    const [draftCourse, setDraftCourse] = useState(user.course);

    const [inviteEmail, setInviteEmail] = useState('');
    const [challengeEmail, setChallengeEmail] = useState('');

    const openEdit = () => {
        setDraftName(user.name);
        setDraftTag(user.tag);
        setDraftBio(user.bio);
        setDraftAvatar(user.avatarEmoji);
        setDraftCourse(user.course);
        setEditVisible(true);
    };

    const saveEdit = async () => {
        if (!draftName.trim()) {
            Alert.alert('Erro', 'O nome não pode estar vazio.');
            return;
        }

        try {
            setIsSaving(true);
            await updateUser({
                name: draftName.trim(),
                tag: draftTag.trim(),
                bio: draftBio.trim(),
                avatarEmoji: draftAvatar,
                course: draftCourse,
            });
            setEditVisible(false);
            Alert.alert('Guardado', 'Perfil atualizado com sucesso!');
        } catch {
            Alert.alert('Erro', 'Não foi possível guardar o perfil.');
        } finally {
            setIsSaving(false);
        }
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
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const ok = window.confirm('Tens a certeza que queres sair?');
            if (!ok) return;

            (async () => {
                try {
                    await signOutUser();
                } catch (error) {
                    console.warn('Failed to sign out cleanly:', error);
                } finally {
                    router.replace('/login' as any);
                }
            })();

            return;
        }

        Alert.alert('Terminar sessão', 'Tens a certeza que queres sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await signOutUser();
                    } catch (error) {
                        console.warn('Failed to sign out cleanly:', error);
                    } finally {
                        router.replace('/login' as any);
                    }
                },
            },
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.avatarSection}>
                <Text style={styles.avatarLarge}>{user.avatarEmoji}</Text>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.tag}>{user.tag}</Text>
                <Text style={styles.course}>{user.course}</Text>
                {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
            </View>

            <View style={styles.menu}>
                <MenuItem
                    icon="person-outline"
                    label="Gerir conta"
                    sub="Editar nome, foto, tag, curso e bio"
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
                            {AVATAR_OPTIONS.map((avatar) => (
                                <TouchableOpacity
                                    key={avatar}
                                    style={[styles.avatarOption, draftAvatar === avatar && styles.avatarSelected]}
                                    onPress={() => setDraftAvatar(avatar)}
                                >
                                    <Text style={{ fontSize: 26 }}>{avatar}</Text>
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
                            style={[styles.input, styles.inputLocked]}
                            value={draftEmail}
                            placeholder="email@fe.up.pt"
                            placeholderTextColor="#9ca3af"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={false}
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
                            style={[styles.input, styles.bioInput]}
                            value={draftBio}
                            onChangeText={setDraftBio}
                            placeholder="Escreve algo sobre ti..."
                            placeholderTextColor="#9ca3af"
                            multiline
                        />

                        <Text style={styles.label}>Curso</Text>
                        <View style={styles.courseGrid}>
                            {COURSE_OPTIONS.map((course) => (
                                <TouchableOpacity
                                    key={course}
                                    style={[styles.courseChip, draftCourse === course && styles.courseChipSelected]}
                                    onPress={() => setDraftCourse(course)}
                                >
                                    <Text
                                        style={[
                                            styles.courseChipText,
                                            draftCourse === course && styles.courseChipTextSelected,
                                        ]}
                                    >
                                        {course}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.btnSecondary}
                                onPress={() => setEditVisible(false)}
                                disabled={isSaving}
                            >
                                <Text style={styles.btnSecondaryText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimary} onPress={saveEdit} disabled={isSaving}>
                                {isSaving ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.btnPrimaryText}>Guardar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={inviteAppVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>📩 Convidar para a app</Text>
                        <Text style={styles.modalSub}>
                            Insere o email da pessoa que queres convidar para o CarbonCampus.
                        </Text>
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
                        <Text style={styles.modalSub}>
                            Insere o email da pessoa que queres desafiar a reduzir CO₂.
                        </Text>
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
                            <TouchableOpacity
                                style={styles.btnSecondary}
                                onPress={() => setInviteChallengeVisible(false)}
                            >
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

function MenuItem({
    icon,
    label,
    sub,
    danger,
    onPress,
}: {
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    content: { padding: 24, gap: 24, paddingBottom: 48 },

    avatarSection: { alignItems: 'center', gap: 6, paddingTop: 8 },
    avatarLarge: { fontSize: 72 },
    name: { fontSize: 22, fontWeight: '700', color: '#111827' },
    tag: { fontSize: 14, color: '#6b7280' },
    course: { fontSize: 13, color: '#166534', fontWeight: '600' },
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
    inputLocked: {
        opacity: 0.75,
    },
    bioInput: {
        minHeight: 72,
        textAlignVertical: 'top',
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
    courseGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 4,
    },
    courseChip: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: '#eef2ff',
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    courseChipSelected: {
        backgroundColor: '#16a34a',
        borderColor: '#16a34a',
    },
    courseChipText: {
        color: '#1f2937',
        fontSize: 12,
        fontWeight: '600',
    },
    courseChipTextSelected: {
        color: '#ffffff',
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
