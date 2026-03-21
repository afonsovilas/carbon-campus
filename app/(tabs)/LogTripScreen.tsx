import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type TransportMode =
    | 'Bicycle'
    | 'Car'
    | 'Walking'
    | 'Train'
    | 'Bus'
    | 'Metro'
    | 'Electric Scooter'

const TRANSPORT_MODES: TransportMode[] = [
    'Bicycle',
    'Car',
    'Walking',
    'Train',
    'Bus',
    'Metro',
    'Electric Scooter',
];

export default function LogTripScreen() {
    const [selectedTransport, setSelectedTransport] = useState<TransportMode | null>(null);
    const [distance, setDistance] = useState('');
    const [tripLogged, setTripLogged] = useState(false);
    const [isDistanceTouched, setIsDistanceTouched] = useState(false);

    const parsedDistance = useMemo(() => Number(distance.replace(',', '.')), [distance]);
    const isDistanceValid = distance.trim() !== '' && Number.isFinite(parsedDistance) && parsedDistance > 0;
    const showDistanceError = isDistanceTouched && !isDistanceValid;
    const canSaveTrip = isDistanceValid && selectedTransport !== null;

    const handleSaveTrip = () => {
        setIsDistanceTouched(true);

        if (!canSaveTrip) {
            return;
        }

        setTripLogged(true);
        setDistance('');
        setSelectedTransport(null);
        setIsDistanceTouched(false);

        setTimeout(() => setTripLogged(false), 3000);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.headerTitle}>Log a Trip</Text>

                    <View style={styles.card}>
                        <Text style={styles.sectionLabel}>Transport Mode</Text>
                        <Text style={styles.selectedTransportText}>
                            {selectedTransport ?? 'Select...'}
                        </Text>

                        <View style={styles.transportOptionsRow}>
                            {TRANSPORT_MODES.map((mode) => {
                                const isSelected = selectedTransport === mode;

                                return (
                                    <TouchableOpacity
                                        key={mode}
                                        style={[
                                            styles.transportOption,
                                            isSelected && styles.transportOptionSelected,
                                        ]}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setSelectedTransport(mode);
                                            setTripLogged(false);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.transportOptionText,
                                                isSelected && styles.transportOptionTextSelected,
                                            ]}
                                        >
                                            {mode}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={styles.sectionLabel}>Distance</Text>
                        <TextInput
                            style={[styles.input, showDistanceError && styles.inputError]}
                            placeholder="Distance (km)"
                            keyboardType="numeric"
                            value={distance}
                            onBlur={() => setIsDistanceTouched(true)}
                            onChangeText={(value) => {
                                setDistance(value);
                                setIsDistanceTouched(true);
                                setTripLogged(false);
                            }}
                        />

                        {showDistanceError && (
                            <Text style={styles.errorText}>
                                Please enter a valid distance greater than 0
                            </Text>
                        )}

                        {tripLogged && (
                            <Text style={styles.successMessage}>Trip logged successfully!</Text>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, !canSaveTrip && styles.buttonDisabled]}
                    onPress={handleSaveTrip}
                    activeOpacity={canSaveTrip ? 0.85 : 1}
                    disabled={!canSaveTrip}
                >
                    <Text style={styles.buttonText}>Save Trip</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f6f8fb',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#f6f8fb',
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 20,
        letterSpacing: 0.4,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 16,
        shadowColor: '#0f172a',
        shadowOpacity: 0.09,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 4,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 8,
        marginTop: 8,
    },
    selectedTransportText: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 12,
        fontWeight: '600',
    },
    transportOptionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    transportOption: {
        borderWidth: 1,
        borderColor: '#dbe3ef',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#f8fafc',
    },
    transportOptionSelected: {
        borderColor: '#22c55e',
        backgroundColor: '#e9fbe7',
    },
    transportOptionText: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '600',
    },
    transportOptionTextSelected: {
        color: '#15803d',
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 12,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#0f172a',
    },
    inputError: {
        borderColor: '#ef4444',
        borderWidth: 1.5,
    },
    errorText: {
        marginTop: 8,
        fontSize: 12,
        color: '#dc2626',
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#22c55e',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        shadowColor: '#14532d',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: '#9ca3af',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    successMessage: {
        marginTop: 14,
        fontSize: 14,
        color: '#16a34a',
        fontWeight: '600',
    },
});