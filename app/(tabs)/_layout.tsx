import { Ionicons } from '@expo/vector-icons';
import ProfileButton from '@/components/ProfileButton';
import SideDrawer from '@/components/SideDrawer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
    const { t } = useLanguage();

    return (
        <View style={styles.root}>
            <Tabs screenOptions={{
                headerShown: true,
                headerRight: ({ tintColor }) => <ProfileButton iconColor={tintColor} />,
                tabBarActiveTintColor: '#4CAF50',
                tabBarInactiveTintColor: '#999',
            }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: t.tab_home_title,
                        tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
                        tabBarLabel: t.tab_home,
                    }}
                />
                <Tabs.Screen
                    name="rankings"
                    options={{
                        title: t.tab_ranking,
                        tabBarIcon: ({ color, size }) => <Ionicons name="trophy" color={color} size={size} />,
                        tabBarLabel: t.tab_ranking,
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: t.tab_history_title,
                        tabBarIcon: ({ color, size }) => <Ionicons name="document-text" color={color} size={size} />,
                        tabBarLabel: t.tab_history,
                    }}
                />
                <Tabs.Screen
                    name="challenge"
                    options={{
                        title: t.tab_challenges_title,
                        tabBarIcon: ({ color, size }) => <Ionicons name="flag" color={color} size={size} />,
                        tabBarLabel: t.tab_challenges,
                    }}
                />
                <Tabs.Screen
                    name="invites"
                    options={{
                        title: t.tab_invites_title,
                        tabBarIcon: ({ color, size }) => <Ionicons name="send" color={color} size={size} />,
                        tabBarLabel: t.tab_invites,
                    }}
                />
                <Tabs.Screen
                    name="LogTripScreen"
                    options={{
                        title: t.tab_trip_title,
                        tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
                        tabBarLabel: t.tab_trip,
                    }}
                />
            </Tabs>

            <SideDrawer />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
});