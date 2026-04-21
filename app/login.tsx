import { validateLogin } from '@/utils/functional-requirements';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const validation = validateLogin(email, password);

        if (!validation.ok && validation.reason === 'missing_fields') {
            Alert.alert('Erro', 'Preenche todos os campos');
            return;
        }

        if (validation.ok) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Erro', 'Email ou password incorretos');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🌿 CarbonCampus</Text>
            <Text style={styles.subtitle}>Inicia sessão na tua conta</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleLogin} testID="submit-button">
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register')} testID="register-link">
                <Text style={styles.linkText}>Não tens conta? <Text style={styles.linkBold}>Regista-te aqui</Text></Text>
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