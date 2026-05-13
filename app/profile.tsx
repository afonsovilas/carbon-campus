import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { signOutUser } from '@/services/auth.service';
import { COURSES, getCourseLabel } from '@/utils/courses';
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

export default function ProfileScreen() {
    const router = useRouter();
    const { user, updateUser } = useUser();
    const { t, lang, setLang } = useLanguage();

    const [editVisible, setEditVisible] = useState(false);
    const [coursePickerVisible, setCoursePickerVisible] = useState(false);
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
            Alert.alert(t.error, t.name_empty);
            return;
        }
        try {
            setIsSaving(true);
            await updateUser({ name: draftName.trim(), tag: draftTag.trim(), bio: draftBio.trim(), avatarEmoji: draftAvatar, course: draftCourse });
            setEditVisible(false);
            Alert.alert(t.saved_title, t.profile_updated);
        } catch {
            Alert.alert(t.error, t.cannot_save_profile);
        } finally {
            setIsSaving(false);
        }
    };

    const sendAppInvite = () => {
        if (!inviteEmail.trim()) { Alert.alert(t.error, t.insert_email); return; }
        Alert.alert('📩', t.app_invite_sent(inviteEmail.trim()));
        setInviteEmail(''); setInviteAppVisible(false);
    };

    const sendChallengeInvite = () => {
        if (!challengeEmail.trim()) { Alert.alert(t.error, t.insert_email); return; }
        Alert.alert('🏆', t.challenge_invite_sent(challengeEmail.trim()));
        setChallengeEmail(''); setInviteChallengeVisible(false);
    };

    const handleLogout = () => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const ok = window.confirm(t.sign_out_confirm_msg);
            if (!ok) return;
            (async () => {
                try { await signOutUser(); } catch (error) { console.warn('Failed to sign out cleanly:', error); } finally { router.replace('/login' as any); }
            })();
            return;
        }
        Alert.alert(t.sign_out_confirm_title, t.sign_out_confirm_msg, [
            { text: t.sign_out_confirm_cancel, style: 'cancel' },
            { text: t.sign_out_confirm_ok, style: 'destructive', onPress: async () => {
                try { await signOutUser(); } catch (error) { console.warn('Failed to sign out cleanly:', error); } finally { router.replace('/login' as any); }
            }},
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.avatarSection}>
                <Text style={styles.avatarLarge}>{user.avatarEmoji}</Text>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.tag}>{user.tag}</Text>
                <Text style={styles.course}>{user.course || 'Sem curso'}</Text>
                {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
            </View>

            <View style={styles.menu}>
                <MenuItem icon="person-outline" label={t.manage_account} sub={t.manage_account_sub} onPress={openEdit} />
                <MenuItem icon="share-social-outline" label={t.invite_to_app} sub={t.invite_to_app_sub} onPress={() => setInviteAppVisible(true)} />
                <MenuItem icon="trophy-outline" label={t.invite_to_challenge} sub={t.invite_to_challenge_sub} onPress={() => setInviteChallengeVisible(true)} />
                <MenuItem icon="log-out-outline" label={t.sign_out} sub={t.sign_out_sub} danger onPress={handleLogout} />
            </View>

            {/* Manage Account Modal */}
            <Modal visible={editVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>{t.manage_account_modal_title}</Text>
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            <Text style={styles.label}>{t.avatar_label}</Text>
                            <View style={styles.avatarGrid}>
                                {AVATAR_OPTIONS.map((avatar) => (
                                    <TouchableOpacity key={avatar} style={[styles.avatarOption, draftAvatar === avatar && styles.avatarSelected]} onPress={() => setDraftAvatar(avatar)}>
                                        <Text style={{ fontSize: 26 }}>{avatar}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.label}>{t.name_label}</Text>
                            <TextInput style={styles.input} value={draftName} onChangeText={setDraftName} placeholder={t.name_label} placeholderTextColor="#9ca3af" />

                            <Text style={styles.label}>Email</Text>
                            <TextInput style={[styles.input, styles.inputLocked]} value={draftEmail} placeholder="email@fe.up.pt" placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" editable={false} />

                            <Text style={styles.label}>{t.tag_label}</Text>
                            <TextInput style={styles.input} value={draftTag} onChangeText={setDraftTag} placeholder="@tag" placeholderTextColor="#9ca3af" autoCapitalize="none" />

                            <Text style={styles.label}>{t.bio_label}</Text>
                            <TextInput style={[styles.input, styles.bioInput]} value={draftBio} onChangeText={setDraftBio} placeholder="..." placeholderTextColor="#9ca3af" multiline />

                            <Text style={styles.label}>{t.course_label}</Text>
                            <TouchableOpacity style={styles.pickerButton} onPress={() => setCoursePickerVisible(v => !v)}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={draftCourse && draftCourse !== 'Sem curso' ? styles.pickerText : styles.pickerPlaceholder}>
                                        {draftCourse && draftCourse !== 'Sem curso' ? getCourseLabel(draftCourse) : t.select_course}
                                    </Text>
                                    <Ionicons name={coursePickerVisible ? 'chevron-up' : 'chevron-down'} size={16} color="#6b7280" />
                                </View>
                            </TouchableOpacity>
                            {coursePickerVisible && (
                                <ScrollView style={styles.inlineCourseList} nestedScrollEnabled showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                                    {COURSES.map((c) => (
                                        <TouchableOpacity key={c.code} style={[styles.courseOption, draftCourse === c.code && styles.courseOptionSelected]} onPress={() => { setDraftCourse(c.code); setCoursePickerVisible(false); }}>
                                            <Text style={[styles.courseOptionText, draftCourse === c.code && styles.courseOptionTextSelected]}>{c.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}

                            {/* Language switcher inside manage account */}
                            <Text style={styles.label}>{t.language_label}</Text>
                            <View style={styles.langRow}>
                                <TouchableOpacity style={[styles.langBtn, lang === 'en' && styles.langBtnActive]} onPress={() => setLang('en')}>
                                    <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>🇬🇧 English</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.langBtn, lang === 'pt' && styles.langBtnActive]} onPress={() => setLang('pt')}>
                                    <Text style={[styles.langBtnText, lang === 'pt' && styles.langBtnTextActive]}>🇵🇹 Português</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.btnSecondary} onPress={() => setEditVisible(false)} disabled={isSaving}>
                                <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimary} onPress={saveEdit} disabled={isSaving}>
                                {isSaving ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.btnPrimaryText}>{t.save_btn}</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Invite to App Modal */}
            <Modal visible={inviteAppVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>{t.invite_app_modal_title}</Text>
                        <Text style={styles.modalSub}>{t.invite_app_modal_sub}</Text>
                        <TextInput style={[styles.input, { marginTop: 12 }]} value={inviteEmail} onChangeText={setInviteEmail} placeholder="email@exemplo.com" placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.btnSecondary} onPress={() => setInviteAppVisible(false)}>
                                <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimary} onPress={sendAppInvite}>
                                <Text style={styles.btnPrimaryText}>{t.send_btn}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Invite to Challenge Modal */}
            <Modal visible={inviteChallengeVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>{t.invite_challenge_modal_title}</Text>
                        <Text style={styles.modalSub}>{t.invite_challenge_modal_sub}</Text>
                        <TextInput style={[styles.input, { marginTop: 12 }]} value={challengeEmail} onChangeText={setChallengeEmail} placeholder="email@exemplo.com" placeholderTextColor="#9ca3af" keyboardType="email-address" autoCapitalize="none" />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.btnSecondary} onPress={() => setInviteChallengeVisible(false)}>
                                <Text style={styles.btnSecondaryText}>{t.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnPrimary} onPress={sendChallengeInvite}>
                                <Text style={styles.btnPrimaryText}>{t.send_btn}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

function MenuItem({ icon, label, sub, danger, onPress }: { icon: any; label: string; sub: string; danger?: boolean; onPress: () => void }) {
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
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    iconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center' },
    iconBoxDanger: { backgroundColor: '#fee2e2' },
    menuLabel: { fontSize: 15, fontWeight: '600', color: '#111827' },
    menuSub: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalBox: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 420, maxHeight: '90%', gap: 6 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
    modalSub: { fontSize: 13, color: '#6b7280' },
    label: { fontSize: 13, fontWeight: '600', color: '#374151', marginTop: 8 },
    input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, fontSize: 14, color: '#111827', backgroundColor: '#f9fafb' },
    inputLocked: { opacity: 0.75 },
    bioInput: { minHeight: 72, textAlignVertical: 'top' },
    avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 6 },
    avatarOption: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderWidth: 2, borderColor: 'transparent' },
    avatarSelected: { borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
    pickerButton: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, backgroundColor: '#f9fafb', justifyContent: 'center', marginTop: 4 },
    pickerText: { color: '#111827', fontSize: 14 },
    pickerPlaceholder: { color: '#9ca3af', fontSize: 14 },
    inlineCourseList: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, backgroundColor: '#fff', marginTop: 4, maxHeight: 220 },
    courseOption: { paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    courseOptionSelected: { backgroundColor: '#e8f5e9' },
    courseOptionText: { fontSize: 14, color: '#374151' },
    courseOptionTextSelected: { color: '#166534', fontWeight: '600' },
    langRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    langBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center', backgroundColor: '#f9fafb' },
    langBtnActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
    langBtnText: { fontSize: 14, color: '#374151', fontWeight: '500' },
    langBtnTextActive: { color: '#fff', fontWeight: '700' },
    modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
    btnPrimary: { flex: 1, backgroundColor: '#4CAF50', borderRadius: 10, padding: 13, alignItems: 'center' },
    btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    btnSecondary: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 10, padding: 13, alignItems: 'center' },
    btnSecondaryText: { color: '#374151', fontWeight: '600', fontSize: 15 },
});