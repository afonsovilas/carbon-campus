import { registerWithEmail } from '@/services/auth.service';
import { isFirebaseConfigured } from '@/services/firebase';
import { upsertUserProfile } from '@/services/users.service';
import { validateRegister } from '@/utils/functional-requirements';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);

    const showError = (message: string) => {
        setFeedbackType('error');
        setFeedbackMessage(message);
        Alert.alert('Erro', message);
    };

    const showSuccess = (message: string) => {
        setFeedbackType('success');
        setFeedbackMessage(message);
    };

    const handleRegister = async () => {
        if (isSubmitting) {
            return;
        }

        setFeedbackType(null);
        setFeedbackMessage('');

        const validation = validateRegister(email, password, confirmPassword);

        if (!validation.ok && validation.reason === 'missing_fields') {
            showError('Preenche todos os campos');
            return;
        }

        if (!validation.ok && validation.reason === 'password_mismatch') {
            showError('As passwords não coincidem');
            return;
        }

        if (!validation.ok && validation.reason === 'duplicate_email') {
            showError('Email já registado');
            return;
        }

        try {
            setIsSubmitting(true);

            if (isFirebaseConfigured && process.env.NODE_ENV !== 'test') {
                const { uid } = await registerWithEmail(email, password);
                await upsertUserProfile(uid, email);
            }

            showSuccess('Conta criada com sucesso!');

            if (Platform.OS === 'web') {
                router.replace('/(tabs)' as any);
                return;
            }

            Alert.alert('Sucesso', 'Conta criada com sucesso!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)' as any) }
            ]);
        } catch (error: any) {
            if (error?.code === 'auth/email-already-in-use') {
                showError('Email já registado');
                return;
            }

            if (error?.code === 'auth/operation-not-allowed') {
                showError('Registo por Email/Password não está ativo no Firebase Auth.');
                return;
            }

            if (error?.code === 'auth/invalid-email') {
                showError('Email inválido');
                return;
            }

            if (error?.code === 'auth/weak-password') {
                showError('Password fraca. Usa pelo menos 6 caracteres.');
                return;
            }

            if (error?.code === 'auth/network-request-failed') {
                showError('Falha de rede ao criar conta. Verifica a ligação.');
                return;
            }

            if (error?.code === 'auth/too-many-requests') {
                showError('Demasiadas tentativas. Tenta novamente mais tarde.');
                return;
            }

            if (error?.code === 'auth/invalid-api-key') {
                showError('Configuração Firebase inválida (API key).');
                return;
            }

            const code = typeof error?.code === 'string' ? error.code : null;
            showError(code ? `Não foi possível criar conta (${code}).` : 'Não foi possível criar conta. Tenta novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🌿 CarbonCampus</Text>
            <Text style={styles.subtitle}>Cria a tua conta</Text>

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
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                testID="password-input"
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmar Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                testID="confirm-password-input"
            />

            <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleRegister}
                testID="submit-button"
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>{isSubmitting ? 'A registar...' : 'Registar'}</Text>
            </TouchableOpacity>

            {feedbackMessage ? (
                <Text
                    testID="register-feedback"
                    style={[
                        styles.feedback,
                        feedbackType === 'error' ? styles.feedbackError : styles.feedbackSuccess,
                    ]}
                >
                    {feedbackMessage}
                </Text>
            ) : null}

            <TouchableOpacity onPress={() => router.replace('/login' as any)}>
                <Text style={styles.linkText}>Já tens conta? <Text style={styles.linkBold}>Inicia sessão</Text></Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, justifyContent: 'center', gap: 20 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#2e7d32' },
    subtitle: { fontSize: 14, textAlign: 'center', color: '#555', marginTop: -10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, color: '#000', backgroundColor: '#fff' },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8 },
    buttonDisabled: { backgroundColor: '#93c5a5' },
    buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
    feedback: { textAlign: 'center', fontSize: 14, marginTop: -6 },
    feedbackError: { color: '#b91c1c' },
    feedbackSuccess: { color: '#166534' },
    linkText: { textAlign: 'center', color: '#555', fontSize: 14 },
    linkBold: { color: '#4CAF50', fontWeight: 'bold' },
});