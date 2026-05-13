import { registerWithEmail } from '@/services/auth.service';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { isFirebaseConfigured } from '@/services/firebase';
import { upsertUserProfile } from '@/services/users.service';
import { validateRegister } from '@/utils/functional-requirements';
import { COURSES } from '@/utils/courses';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const { updateUser } = useUser();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [course, setCourse] = useState('');
    const [coursePickerVisible, setCoursePickerVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);

    const showError = (message: string) => {
        setFeedbackType('error');
        setFeedbackMessage(message);
        Alert.alert(t.error, message);
    };

    const showSuccess = (message: string) => {
        setFeedbackType('success');
        setFeedbackMessage(message);
    };

    const handleRegister = async () => {
        if (isSubmitting) return;

        setFeedbackType(null);
        setFeedbackMessage('');

        const validation = validateRegister(email, password, confirmPassword, course);

        if (!validation.ok && validation.reason === 'missing_fields') {
            showError(t.fill_all_fields);
            return;
        }
        if (!validation.ok && validation.reason === 'password_mismatch') {
            showError(t.passwords_dont_match);
            return;
        }
        if (!validation.ok && validation.reason === 'duplicate_email') {
            showError(t.email_already_in_use);
            return;
        }

        try {
            setIsSubmitting(true);

            if (isFirebaseConfigured && process.env.NODE_ENV !== 'test') {
                const { uid } = await registerWithEmail(email, password);
                await upsertUserProfile(uid, { email, course });
                await updateUser({ course });
            }

            showSuccess(t.account_created);

            if (Platform.OS === 'web') {
                router.replace('/(tabs)' as any);
                return;
            }

            Alert.alert(t.success, t.account_created, [
                { text: 'OK', onPress: () => router.replace('/(tabs)' as any) }
            ]);
        } catch (error: any) {
            if (error?.code === 'auth/email-already-in-use') { showError(t.email_already_in_use); return; }
            if (error?.code === 'auth/operation-not-allowed') { showError('Email/Password sign-up is not enabled in Firebase Auth.'); return; }
            if (error?.code === 'auth/invalid-email') { showError(t.invalid_email); return; }
            if (error?.code === 'auth/weak-password') { showError(t.weak_password); return; }
            if (error?.code === 'auth/network-request-failed') { showError(t.network_error); return; }
            if (error?.code === 'auth/too-many-requests') { showError(t.too_many_requests); return; }
            if (error?.code === 'auth/invalid-api-key') { showError(t.invalid_api_key); return; }
            const code = typeof error?.code === 'string' ? error.code : null;
            showError(code ? `${t.cannot_create_account} (${code})` : t.cannot_create_account);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>🌿 CarbonCampus</Text>
            <Text style={styles.subtitle}>{t.create_account_subtitle}</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="email-input"
            />
            <TextInput
                style={styles.input}
                placeholder={t.password}
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                testID="password-input"
            />
            <TextInput
                style={styles.input}
                placeholder={t.confirm_password}
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                testID="confirm-password-input"
            />

            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setCoursePickerVisible(true)}
                testID="course-picker-button"
            >
                <Text style={course ? styles.pickerText : styles.pickerPlaceholder}>
                    {course ? (COURSES.find((c) => c.code === course)?.label ?? course) : t.select_course}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={coursePickerVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setCoursePickerVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{t.select_course}</Text>
                        <ScrollView>
                            {COURSES.map((c) => (
                                <TouchableOpacity
                                    key={c.code}
                                    style={styles.courseOption}
                                    onPress={() => { setCourse(c.code); setCoursePickerVisible(false); }}
                                    testID={`course-option-${c.code}`}
                                >
                                    <Text style={styles.courseOptionText}>{c.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.modalCancel}
                            onPress={() => setCoursePickerVisible(false)}
                            testID="course-picker-cancel"
                        >
                            <Text style={styles.modalCancelText}>{t.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleRegister}
                testID="submit-button"
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>{isSubmitting ? t.registering : t.register_btn}</Text>
            </TouchableOpacity>

            {feedbackMessage ? (
                <Text
                    testID="register-feedback"
                    style={[styles.feedback, feedbackType === 'error' ? styles.feedbackError : styles.feedbackSuccess]}
                >
                    {feedbackMessage}
                </Text>
            ) : null}

            <TouchableOpacity onPress={() => router.replace('/login' as any)}>
                <Text style={styles.linkText}>{t.already_have_account} <Text style={styles.linkBold}>{t.sign_in_link}</Text></Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 30, justifyContent: 'center', gap: 20 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#2e7d32' },
    subtitle: { fontSize: 14, textAlign: 'center', color: '#555', marginTop: -10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, color: '#000', backgroundColor: '#fff' },
    pickerButton: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center' },
    pickerText: { color: '#000', fontSize: 16 },
    pickerPlaceholder: { color: '#999', fontSize: 16 },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8 },
    buttonDisabled: { backgroundColor: '#93c5a5' },
    buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
    feedback: { textAlign: 'center', fontSize: 14, marginTop: -6 },
    feedbackError: { color: '#b91c1c' },
    feedbackSuccess: { color: '#166534' },
    linkText: { textAlign: 'center', color: '#555', fontSize: 14 },
    linkBold: { color: '#4CAF50', fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '70%', padding: 16 },
    modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32', marginBottom: 12, textAlign: 'center' },
    courseOption: { paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    courseOptionText: { fontSize: 14, color: '#333' },
    modalCancel: { marginTop: 12, padding: 14, alignItems: 'center' },
    modalCancelText: { color: '#b91c1c', fontWeight: 'bold', fontSize: 15 },
});