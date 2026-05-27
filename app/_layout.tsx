import { DrawerProvider } from '@/contexts/DrawerContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TripTrackingProvider } from '@/contexts/TripTrackingContext';
import { TripsProvider } from '@/contexts/TripsContext';
import { UserProvider } from '@/contexts/UserContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { onAuthStateChange } from '@/services/auth.service';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
    initialRouteName: 'login',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const pathname = usePathname();
    const [navigatorReady, setNavigatorReady] = useState(false);

    useEffect(() => {
        setNavigatorReady(true);
    }, []);

    useEffect(() => {
        if (!navigatorReady) return;

        return onAuthStateChange((uid) => {
            const isAuthRoute = pathname === '/login' || pathname === '/register';
            if (!uid && !isAuthRoute) {
                router.replace('/login' as any);
            }
        });
    }, [navigatorReady, pathname, router]);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <LanguageProvider>
                <UserProvider>
                    <DrawerProvider>
                        <TripTrackingProvider>
                            <TripsProvider>
                                <Stack initialRouteName="login">
                                    <Stack.Screen name="login" options={{ headerShown: false }} />
                                    <Stack.Screen name="register" options={{ headerShown: true, title: 'CarbonCampus' }} />
                                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                    <Stack.Screen name="profile" options={{ headerShown: true, title: 'CarbonCampus' }} />
                                </Stack>
                                <StatusBar style="auto" />
                            </TripsProvider>
                        </TripTrackingProvider>
                    </DrawerProvider>
                </UserProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}