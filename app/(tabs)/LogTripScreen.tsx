import React, { useMemo, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
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
            <View style={styles.backgroundOrbTop} />
            <View style={styles.backgroundOrbBottom} />

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
                        <View>
                            <View style={styles.headerBlock}>
                                <Text style={styles.headerTitle}>Log a Trip</Text>
                                <Text style={styles.headerSubtitle}>
                                    Choose how you traveled and save your distance in seconds.
                                </Text>
                            </View>

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
                                                activeOpacity={0.85}
                                                onPress={() => {
                                                    setSelectedTransport(mode);
                                                    setTripLogged(false);
                                                    Keyboard.dismiss();
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
                                        <Text style={styles.kmBadgeText}>km</Text>
                                    </View>
                                </View>

                                {showDistanceError && (
                                    <Text style={styles.errorText}>
                                        Please enter a valid distance greater than 0
                                    </Text>
                                )}

                                {tripLogged && (
                                    <View style={styles.successContainer}>
                                        <Text style={styles.successMessage}>Trip logged successfully!</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.button, !canSaveTrip && styles.buttonDisabled]}
                            onPress={handleSaveTrip}
                            activeOpacity={canSaveTrip ? 0.9 : 1}
                            disabled={!canSaveTrip}
                        >
                            <Text style={styles.buttonText}>Save Trip</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#eff6ff',
    },
    container: {
        padding: 20,
        paddingBottom: 36,
        gap: 18,
    },
    backgroundOrbTop: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: '#dbeafe',
        top: -90,
        right: -70,
        opacity: 0.8,
    },
    backgroundOrbBottom: {
        position: 'absolute',
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: '#dcfce7',
        bottom: -110,
        left: -70,
        opacity: 0.8,
    },
    headerBlock: {
        marginBottom: 14,
    },
    headerTitle: {
        fontSize: 38,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: 0.2,
    },
    headerSubtitle: {
        marginTop: 6,
        fontSize: 15,
        lineHeight: 22,
        color: '#475569',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#0f172a',
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        elevation: 6,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 8,
        marginTop: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    selectedTransportText: {
        fontSize: 16,
        color: '#0f172a',
        marginBottom: 12,
        fontWeight: '700',
    },
    transportOptionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 9,
        marginBottom: 16,
    },
    transportOption: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 999,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: '#f8fafc',
    },
    transportOptionSelected: {
        borderColor: '#16a34a',
        backgroundColor: '#dcfce7',
    },
    transportOptionText: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '600',
    },
    transportOptionTextSelected: {
        color: '#166534',
        fontWeight: '700',
    },
    inputRow: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        paddingVertical: 13,
        paddingHorizontal: 12,
        paddingRight: 52,
        borderWidth: 1,
        borderColor: '#94a3b8',
        borderRadius: 14,
        backgroundColor: '#f8fafc',
        fontSize: 16,
        color: '#0f172a',
    },
    kmBadge: {
        position: 'absolute',
        right: 10,
        backgroundColor: '#e2e8f0',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    kmBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#334155',
    },
    inputError: {
        borderColor: '#ef4444',
        borderWidth: 1.8,
    },
    errorText: {
        marginTop: 8,
        fontSize: 13,
        color: '#dc2626',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#16a34a',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        shadowColor: '#14532d',
        shadowOpacity: 0.28,
        shadowRadius: 16,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        elevation: 7,
    },
    buttonDisabled: {
        backgroundColor: '#94a3b8',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    successContainer: {
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#86efac',
        backgroundColor: '#f0fdf4',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    successMessage: {
        fontSize: 14,
        color: '#16a34a',
        fontWeight: '700',
    },
});