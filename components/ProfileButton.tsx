import { useDrawer } from '@/contexts/DrawerContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

type ProfileButtonProps = {
    iconColor?: string;
};

export default function ProfileButton({ iconColor }: ProfileButtonProps) {
    const { toggle } = useDrawer();
    const fallbackColor = useThemeColor({}, 'text');

    return (
        <Pressable
            onPress={toggle}
            style={styles.button}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            testID="open-drawer-button"
        >
            <Ionicons name="ellipsis-vertical" size={22} color={iconColor ?? fallbackColor} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: 12,
        padding: 4,
    },
});