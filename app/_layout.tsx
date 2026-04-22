import { TripsProvider } from '@/contexts/TripsContext';
import { UserProvider } from '@/contexts/UserContext';
import { DrawerProvider } from '@/contexts/DrawerContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
    initialRouteName: 'login',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <UserProvider>
                <DrawerProvider>
                    <TripsProvider>
                        <Stack initialRouteName="login">
                            <Stack.Screen name="login" options={{ headerShown: false }} />
                            <Stack.Screen name="register" options={{ headerShown: true, title: 'CarbonCampus Registo' }} />
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="profile" options={{ headerShown: true, title: 'O meu perfil' }} />
                            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                        </Stack>
                        <StatusBar style="auto" />
                    </TripsProvider>
                </DrawerProvider>
            </UserProvider>
        </ThemeProvider>
    );
}