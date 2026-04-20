import { useDrawer } from '@/contexts/DrawerContext';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.65;

const AVATAR_OPTIONS = ['🧑', '👩', '🧔', '👩‍💻', '🧑‍🎓', '👨‍🎓', '🌱', '🚴', '🌍'];

export default function SideDrawer() {
    const { isOpen, close } = useDrawer();
    const { user, updateUser } = useUser();
    const router = useRouter();

    const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    // Sub-modal states
    const [editVisible, setEditVisible] = useState(false);
    const [inviteAppVisible, setInviteAppVisible] = useState(false);
    const [inviteChallengeVisible, setInviteChallengeVisible] = useState(false);

    // Edit form
    const [draftName, setDraftName] = useState(user.name);
    const [draftEmail, setDraftEmail] = useState(user.email);
    const [draftTag, setDraftTag] = useState(user.tag);
    const [draftBio, setDraftBio] = useState(user.bio);
    const [draftAvatar, setDraftAvatar] = useState(user.avatarEmoji);

    // Invite
    const [inviteEmail, setInviteEmail] = useState('');
    const [challengeEmail, setChallengeEmail] = useState('');

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 0 }),
                Animated.timing(backdropAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: DRAWER_WIDTH, useNativeDriver: true, bounciness: 0 }),
                Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]).start(({ finished }) => { if (finished) setVisible(false); });
        }
    }, [isOpen]);

    const openEdit = () => {
        setDraftName(user.name);
        setDraftEmail(user.email);
        setDraftTag(user.tag);
        setDraftBio(user.bio);
        setDraftAvatar(user.avatarEmoji);
        setEditVisible(true);
    };

    const saveEdit = () => {
        if (!draftName.trim()) { Alert.alert('Erro', 'O nome não pode estar vazio.'); return; }
        updateUser({ name: draftName.trim(), email: draftEmail.trim(), tag: draftTag.trim(), bio: draftBio.trim(), avatarEmoji: draftAvatar });
        setEditVisible(false);
        Alert.alert('✅ Guardado', 'Perfil atualizado com sucesso!');
    };

    const sendAppInvite = () => {
        if (!inviteEmail.trim()) { Alert.alert('Erro', 'Insere um email.'); return; }
        Alert.alert('📩 Enviado', `Convite para a app enviado para ${inviteEmail.trim()}.`);
        setInviteEmail('');
        setInviteAppVisible(false);
    };

    const sendChallengeInvite = () => {
        if (!challengeEmail.trim()) { Alert.alert('Erro', 'Insere um email.'); return; }
        Alert.alert('🏆 Enviado', `Convite para desafio enviado para ${challengeEmail.trim()}.`);
        setChallengeEmail('');
        setInviteChallengeVisible(false);
    };

    const handleLogout = () => {
        Alert.alert('Terminar sessão', 'Tens a certeza que queres sair?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sair', style: 'destructive', onPress: () => { close(); router.replace('/login' as any); } },
        ]);
    };

    if (!visible) return null;

    return (
        <>
            {/* Backdrop */}
            <Animated.View
                style={[styles.backdrop, { opacity: backdropAnim }]}
                pointerEvents={isOpen ? 'auto' : 'none'}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={close} />
            </Animated.View>

            {/* Drawer panel */}
            <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                <ScrollView contentContainerStyle={styles.drawerContent} showsVerticalScrollIndicator={false}>

                    {/* Avatar + info */}
                    <View style={styles.profileHeader}>
                        <Text style={styles.avatarLarge}>{user.avatarEmoji}</Text>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userTag}>{user.tag}</Text>
                        {user.bio ? <Text style={styles.userBio}>{user.bio}</Text> : null}
                    </View>

                    <View style={styles.divider} />

                    {/* Menu items */}
                    <DrawerItem icon="person-outline" label="Gerir conta" onPress={openEdit} />
                    <DrawerItem icon="share-social-outline" label="Convidar para a app" onPress={() => setInviteAppVisible(true)} />
                    <DrawerItem icon="trophy-outline" label="Convidar para desafio" onPress={() => setInviteChallengeVisible(true)} />

                    <View style={styles.divider} />

                    <DrawerItem icon="log-out-outline" label="Terminar sessão" danger onPress={handleLogout} />

                </ScrollView>
            </Animated.View>

            {/* ── Sub-modal: Editar conta ── */}
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
                                    <Text style={{ fontSize: 24 }}>{em}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Nome</Text>
                        <TextInput style={styles.input} value={draftName} onChangeText={setDraftName} placeholder="Nome" placeholderTextColor="#9ca3af" />

                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.input} value={draftEmail} onChangeText={setDraftEmail} placeholder="email@fe.up.pt" placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" />

                        <Text style={styles.label}>Tag</Text>
                        <TextInput style={styles.input} value={draftTag} onChangeText={setDraftTag} placeholder="@tag" placeholderTextColor="#9ca3af" autoCapitalize="none" />

                        <Text style={styles.label}>Bio</Text>
                        <TextInput style={[styles.input, { height: 68, textAlignVertical: 'top' }]} value={draftBio} onChangeText={setDraftBio} placeholder="Escreve algo sobre ti..." placeholderTextColor="#9ca3af" multiline />

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

            {/* ── Sub-modal: Convidar para a app ── */}
            <Modal visible={inviteAppVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>📩 Convidar para a app</Text>
                        <Text style={styles.modalSub}>Insere o email da pessoa que queres convidar para o CarbonCampus.</Text>
                        <TextInput style={[styles.input, { marginTop: 10 }]} value={inviteEmail} onChangeText={setInviteEmail} placeholder="email@exemplo.com" placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" />
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

            {/* ── Sub-modal: Convidar para desafio ── */}
            <Modal visible={inviteChallengeVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>🏆 Convidar para desafio</Text>
                        <Text style={styles.modalSub}>Insere o email da pessoa que queres desafiar a reduzir CO₂.</Text>
                        <TextInput style={[styles.input, { marginTop: 10 }]} value={challengeEmail} onChangeText={setChallengeEmail} placeholder="email@exemplo.com" placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" />
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
        </>
    );
}

function DrawerItem({ icon, label, danger, onPress }: { icon: any; label: string; danger?: boolean; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
                <Ionicons name={icon} size={20} color={danger ? '#ef4444' : '#4CAF50'} />
            </View>
            <Text style={[styles.menuLabel, danger && { color: '#ef4444' }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 100,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#fff',
        zIndex: 101,
        shadowColor: '#000',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 20,
    },
    drawerContent: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
        gap: 4,
    },
    profileHeader: {
        alignItems: 'center',
        paddingBottom: 20,
        gap: 4,
    },
    avatarLarge: { fontSize: 60 },
    userName: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 6 },
    userTag: { fontSize: 13, color: '#6b7280' },
    userBio: { fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 4 },
    divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 10 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        gap: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#e8f5e9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBoxDanger: { backgroundColor: '#fee2e2' },
    menuLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },

    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 200,
    },
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 420,
    },
    modalTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 4 },
    modalSub: { fontSize: 13, color: '#6b7280' },
    label: { fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 10, marginBottom: 4 },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        padding: 11,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#f9fafb',
    },
    avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 4 },
    avatarOption: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarSelected: { borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
    modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
    btnPrimary: { flex: 1, backgroundColor: '#4CAF50', borderRadius: 10, padding: 12, alignItems: 'center' },
    btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    btnSecondary: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 10, padding: 12, alignItems: 'center' },
    btnSecondaryText: { color: '#374151', fontWeight: '600', fontSize: 14 },
});