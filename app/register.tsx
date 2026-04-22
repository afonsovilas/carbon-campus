import { validateRegister } from '@/utils/functional-requirements';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        const validation = validateRegister(email, password, confirmPassword);

        if (!validation.ok && validation.reason === 'missing_fields') {
            Alert.alert('Erro', 'Preenche todos os campos');
            return;
        }

        if (!validation.ok && validation.reason === 'password_mismatch') {
            Alert.alert('Erro', 'As passwords não coincidem');
            return;
        }

        if (!validation.ok && validation.reason === 'duplicate_email') {
            Alert.alert('Erro', 'Email já registado');
            return;
        }

        Alert.alert('Sucesso', 'Conta criada com sucesso!', [
            { text: 'OK', onPress: () => router.replace('/(tabs)' as any) }
        ]);
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

            <TouchableOpacity style={styles.button} onPress={handleRegister} testID="submit-button">
                <Text style={styles.buttonText}>Registar</Text>
            </TouchableOpacity>

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
    buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
    linkText: { textAlign: 'center', color: '#555', fontSize: 14 },
    linkBold: { color: '#4CAF50', fontWeight: 'bold' },
});