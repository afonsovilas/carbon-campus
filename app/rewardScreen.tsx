import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import QRCode from 'react-native-qrcode-svg';

export default function RewardScreen() {

    const [points, setPoints] = useState(500);
    const rewardCost = 200;

    const [locationStatus, setLocationStatus] = useState('A verificar localização...');
    const [isAtStation, setIsAtStation] = useState(false);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Coordenadas Trindade
    const STATION_LAT = 41.1517;
    const STATION_LON = -8.6096;
    const MAX_DISTANCE_METERS = 100; // Distância máxima para validar a presença na estação

    //calcular a distância em metros (Fórmula de Haversine)
    const getDistanceFromLatLonInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // Raio da Terra em metros
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Efeito de allow do gps
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationStatus('Permissão de localização negada.');
                setLoading(false);
                return;
            }

            // Obtém a localização atual
            let location = await Location.getCurrentPositionAsync({});
            const distance = getDistanceFromLatLonInMeters(
                location.coords.latitude,
                location.coords.longitude,
                STATION_LAT,
                STATION_LON
            );

            // Test - Verifica se estás dentro do raio de 100m da estação (Trindade)
            if (distance <= MAX_DISTANCE_METERS) {
                setIsAtStation(true);
                setLocationStatus('Estás na estação!');
            } else {
                setIsAtStation(false);
                setLocationStatus(`Estás a ${Math.round(distance)}m da estação.`);
            }
            setLoading(false);
        })();
    }, []);

    // QR handling
    const handleGetReward = () => {
        if (!isAtStation) return;

        // Test - Verifica os pontos
        if (points >= rewardCost) {
            // Aplicação deduz os teus pontos
            setPoints(points - rewardCost);
            setQrCodeData(`REWARD-CAFE-${Date.now()}`); // Gera um código único
        } else {
            alert('Pontos insuficientes para esta recompensa.');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.statusText}>{locationStatus}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.pointsText}>Os teus pontos: <Text style={styles.points}>{points}</Text></Text>

            {/* User in Trindade */}
            {isAtStation ? (
                <View style={styles.card}>
                    <Text style={styles.welcomeText}>Bem-vindo!</Text>
                    <Text style={styles.offerText}>Oferta: Café Expresso (Custo: {rewardCost} pts)</Text>

                    {qrCodeData ? (
                        <View style={styles.qrContainer}>
                            <Text style={styles.successText}>Mostra este código na loja:</Text>
                            <QRCode value={qrCodeData} size={150} />
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={handleGetReward}>
                            <Text style={styles.buttonText}>Obter Código QR</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                //User not in Trindade
                <View style={styles.card}>
                    <View style={[styles.qrContainer, { opacity: 0.2 }]}>
                        {/* Simula QR Blocked  */}
                        <QRCode value="BLOCKED" size={150} />
                    </View>
                    <Text style={styles.errorText}>
                        Aproxima-te da estação para desbloqueares a recompensa.
                    </Text>
                </View>
            )}

            <Text style={styles.statusText}>{locationStatus}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    card: {
        padding: 25,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    points: {
        color: '#FFFFFF',
    },
    pointsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    offerText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        padding: 18,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    qrContainer: {
        alignItems: 'center',
        marginTop: 15,
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
    },
    successText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: '#FF5252',
        textAlign: 'center',
        marginTop: 15,
        fontWeight: '600',
    },
    statusText: {
        marginTop: 30,
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
    },
});