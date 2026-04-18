import { Ionicons } from '@expo/vector-icons'; // ← IMPORTA ÍCONES
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: '#999',
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
                    tabBarLabel: 'Home',
                }}
            />
            <Tabs.Screen
                name="rankings"
                options={{
                    title: 'Ranking',
                    tabBarIcon: ({ color, size }) => <Ionicons name="trophy" color={color} size={size} />,
                    tabBarLabel: 'Ranking',
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Histórico',
                    tabBarIcon: ({ color, size }) => <Ionicons name="document-text" color={color} size={size} />,
                    tabBarLabel: 'Histórico',
                }}
            />
            <Tabs.Screen
                name="challenge"
                options={{
                    title: 'Desafios',
                    tabBarIcon: ({ color, size }) => <Ionicons name="flag" color={color} size={size} />,
                    tabBarLabel: 'Desafios',
                }}
            />
            <Tabs.Screen
                name="invites"
                options={{
                    title: 'Convites',
                    tabBarIcon: ({ color, size }) => <Ionicons name="send" color={color} size={size} />,
                    tabBarLabel: 'Convites',
                }}
            />
            <Tabs.Screen
                name="LogTripScreen"
                options={{
                    title: 'Registar Viagem',
                    tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
                    tabBarLabel: 'Viagem',
                }}
            />
        </Tabs>
    );
}

