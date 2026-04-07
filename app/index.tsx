import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function Index() {
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.replace('/login' as any);
        }, 100);
        return () => clearTimeout(timeout);
    }, []);

    return <View />;
}