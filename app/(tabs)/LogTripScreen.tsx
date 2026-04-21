import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTrips } from '@/contexts/TripsContext';
import React, { useMemo, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

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

// Pontos por km para cada modo de transporte
const POINTS_PER_KM: Record<TransportMode, number> = {
    'Bicycle': 20,
    'Car': 5,
    'Walking': 15,
    'Train': 10,
    'Bus': 12,
    'Metro': 10,
    'Electric Scooter': 18,
};

export default function LogTripScreen() {
    const { addTrip } = useTrips();
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

        if (!canSaveTrip || !selectedTransport) {
            return;
        }

        const points = calculatePoints(selectedTransport, parsedDistance);
        const today = new Date();
        const dateString = `${today.getDate()}/${today.getMonth() + 1}`;

        addTrip({
            id: `trip-${Date.now()}`,
            mode: selectedTransport,
            distance: parsedDistance,
            points: points,
            date: dateString,
        });

        setTripLogged(true);
        setDistance('');
        setSelectedTransport(null);
        setIsDistanceTouched(false);

        setTimeout(() => setTripLogged(false), 3000);
    };

    return (
        <ThemedView style={styles.screen}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Pressable
                    style={styles.flex}
                    onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}
                >
                    <ScrollView
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.headerBlock}>
                            <ThemedText type="title">Registar Viagem</ThemedText>
                            <ThemedText type="default" style={styles.headerSubtitle}>
                                Escolhe o transporte e adiciona a distancia percorrida.
                            </ThemedText>
                        </View>

                        <ThemedView style={styles.card}>
                            <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
                                Transport Mode
                            </ThemedText>
                            <ThemedText type="default" style={styles.selectedTransportText}>
                                {selectedTransport ?? 'Select...'}
                            </ThemedText>

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
                                                Keyboard.dismiss();
                                            }}
                                        >
                                            <ThemedText
                                                type="defaultSemiBold"
                                                style={[
                                                    styles.transportOptionText,
                                                    isSelected && styles.transportOptionTextSelected,
                                                ]}
                                            >
                                                {mode}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
                                Distance
                            </ThemedText>
                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.input, showDistanceError && styles.inputError]}
                                    placeholder="Distance (km)"
                                    keyboardType="decimal-pad"
                                    returnKeyType="done"
                                    value={distance}
                                    onBlur={() => setIsDistanceTouched(true)}
                                    onSubmitEditing={Keyboard.dismiss}
                                    onChangeText={(value) => {
                                        setDistance(value);
                                        setIsDistanceTouched(true);
                                        setTripLogged(false);
                                    }}
                                />
                                <View style={styles.kmBadge}>
                                    <ThemedText type="defaultSemiBold" style={styles.kmBadgeText}>
                                        km
                                    </ThemedText>
                                </View>
                            </View>

                            {showDistanceError && (
                                <ThemedText style={styles.errorText}>
                                    Please enter a valid distance greater than 0
                                </ThemedText>
                            )}

                            {tripLogged && (
                                <View style={styles.successContainer}>
                                    <ThemedText type="defaultSemiBold" style={styles.successMessage}>
                                        Trip logged successfully!
                                    </ThemedText>
                                </View>
                            )}
                        </ThemedView>

                        <TouchableOpacity
                            testID="save-trip-button"
                            style={[styles.button, !canSaveTrip && styles.buttonDisabled]}
                            onPress={handleSaveTrip}
                            activeOpacity={canSaveTrip ? 0.7 : 1}
                            disabled={!canSaveTrip}
                        >
                            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                                Save Trip
                            </ThemedText>
                        </TouchableOpacity>
                    </ScrollView>
                </Pressable>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    container: {
        padding: 20,
        paddingTop: 100,
        paddingBottom: 30,
        gap: 18,
    },
    headerBlock: {
        gap: 4,
    },
    headerSubtitle: {
        opacity: 0.8,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    sectionLabel: {
        marginBottom: 8,
        marginTop: 6,
    },
    selectedTransportText: {
        marginBottom: 12,
        opacity: 0.8,
    },
    transportOptionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    transportOption: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.45)',
        borderRadius: 12,
        paddingVertical: 9,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    transportOptionSelected: {
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76,175,80,0.18)',
    },
    transportOptionText: {
        fontSize: 14,
    },
    transportOptionTextSelected: {
        color: '#4CAF50',
    },
    inputRow: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 12,
        paddingRight: 50,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.12)',
        fontSize: 16,
        color: '#11181C',
    },
    kmBadge: {
        position: 'absolute',
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    kmBadgeText: {
        fontSize: 12,
        color: '#11181C',
    },
    inputError: {
        borderColor: '#ef4444',
        borderWidth: 1.5,
    },
    errorText: {
        marginTop: 8,
        color: '#dc2626',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    successContainer: {
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#86EFAC',
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    successMessage: {
        color: '#166534',
        fontSize: 15,
        lineHeight: 20,
    },
});