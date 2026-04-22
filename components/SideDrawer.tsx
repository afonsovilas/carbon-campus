import { useDrawer } from '@/contexts/DrawerContext';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.72, 320);

export default function SideDrawer() {
    const { isOpen, close } = useDrawer();
    const { user } = useUser();
    const router = useRouter();

    const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 0 }),
                Animated.timing(backdropAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
            ]).start();
            return;
        }

        Animated.parallel([
            Animated.spring(slideAnim, { toValue: DRAWER_WIDTH, useNativeDriver: true, bounciness: 0 }),
            Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(({ finished }) => {
            if (finished) {
                setVisible(false);
            }
        });
    }, [backdropAnim, isOpen, slideAnim]);

    const handleManageAccounts = () => {
        close();
        router.push('/profile' as any);
    };

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: () => {
                    close();
                    router.replace('/login' as any);
                },
            },
        ]);
    };

    if (!visible) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <Animated.View
                style={[styles.backdrop, { opacity: backdropAnim }]}
                pointerEvents={isOpen ? 'auto' : 'none'}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={close} testID="drawer-backdrop" />
            </Animated.View>

            {/* Drawer panel */}
            <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.drawerContent}>
                    {/* Avatar + info */}
                    <View style={styles.profileHeader}>
                        <Text style={styles.avatarLarge}>{user.avatarEmoji}</Text>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userTag}>{user.tag}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Menu items */}
                    <DrawerItem
                        icon="person-outline"
                        label="Manage Accounts"
                        onPress={handleManageAccounts}
                        testID="drawer-manage-accounts"
                    />
                    <DrawerItem
                        icon="log-out-outline"
                        label="Log Out"
                        danger
                        onPress={handleLogout}
                        testID="drawer-log-out"
                    />
                </View>
            </Animated.View>
        </>
    );
}

function DrawerItem({
    icon,
    label,
    danger,
    onPress,
    testID,
}: {
    icon: any;
    label: string;
    danger?: boolean;
    onPress: () => void;
    testID?: string;
}) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7} testID={testID}>
            <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
                <Ionicons name={icon} size={20} color={danger ? '#f87171' : '#7ee08d'} />
            </View>
            <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#8fb5a1" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(4, 17, 10, 0.58)',
        zIndex: 100,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#10231a',
        zIndex: 101,
        shadowColor: '#04110a',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.32,
        shadowRadius: 12,
        elevation: 20,
    },
    drawerContent: {
        flex: 1,
        paddingTop: 72,
        paddingHorizontal: 20,
    },
    profileHeader: {
        alignItems: 'center',
        paddingBottom: 20,
        gap: 4,
    },
    avatarLarge: { fontSize: 56 },
    userName: { fontSize: 18, fontWeight: '700', color: '#eaf7ef', marginTop: 6 },
    userTag: { fontSize: 13, color: '#a7c5b3' },
    divider: { height: 1, backgroundColor: '#2a4a3a', marginVertical: 10 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        gap: 12,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#183427',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBoxDanger: { backgroundColor: '#3a1b1f' },
    menuLabel: { fontSize: 14, fontWeight: '600', color: '#dcefe3' },
    menuLabelDanger: { color: '#fda4af' },
});