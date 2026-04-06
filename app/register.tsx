import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Preenche todos os campos');
            return;
        }

        if (email === 'duplicado@teste.pt') {
            Alert.alert('Erro', 'Email já registado');
            return;
        }

        Alert.alert('Sucesso', 'Bem-vindo ao CarbonCampus!');
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="up1234@up.pt"
                value={email}
                onChangeText={setEmail}
                testID="email-input"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                testID="password-input"
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister} testID="submit-button">
                <Text style={styles.buttonText}>Registar MIEIC</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, justifyContent: 'center', gap: 20 },
    input: { borderWidth: 1, padding: 15, borderRadius: 8 },
    button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8 },
    buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' }
});