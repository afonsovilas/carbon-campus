import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // ← IMPORTA ÍCONES

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="ranking"
                options={{
                    title: 'Ranking',
                    tabBarIcon: ({ color, size }) => <Ionicons name="trophy" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Histórico',
                    tabBarIcon: ({ color, size }) => <Ionicons name="time" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}

