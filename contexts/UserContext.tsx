import { getCurrentUserEmail, getCurrentUserUid, onAuthStateChange } from '@/services/auth.service';
import { emitLeaderboardRefresh } from '@/services/leaderboard-events';
import { ensureUserProfile, syncPublicLeaderboardEntry, updateUserProfile } from '@/services/users.service';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
    name: string;
    email: string;
    tag: string;
    bio: string;
    avatarEmoji: string;
    course: string;
}

interface UserContextType {
    user: UserProfile;
    updateUser: (fields: Partial<UserProfile>) => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
    name: 'Utilizador',
    email: 'utilizador@fe.up.pt',
    tag: '@user',
    bio: '',
    avatarEmoji: '🧑',
    course: 'Sem curso',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

    useEffect(() => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }

        let mounted = true;

        const syncProfile = async () => {
            const uid = getCurrentUserUid();
            const email = getCurrentUserEmail() || DEFAULT_USER.email;

            if (!uid) {
                if (mounted) {
                    setUser(DEFAULT_USER);
                }
                return;
            }

            try {
                const profile = await ensureUserProfile(uid, email);
                if (!mounted) {
                    return;
                }

                setUser({
                    name: profile.name,
                    email: profile.email,
                    tag: profile.tag,
                    bio: profile.bio,
                    avatarEmoji: profile.avatarEmoji,
                    course: profile.course,
                });

                // Ensure leaderboard entry always has up-to-date profile info
                syncPublicLeaderboardEntry(uid, {
                    name: profile.name,
                    tag: profile.tag,
                    course: profile.course,
                }).catch((err) => console.warn('Failed to sync leaderboard entry on login:', err));
            } catch (error) {
                console.warn('Failed to sync user profile from Firebase:', error);
            }
        };

        const unsubscribe = onAuthStateChange(() => {
            syncProfile();
        });

        syncProfile();

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const updateUser = async (fields: Partial<UserProfile>) => {
        setUser(prev => ({ ...prev, ...fields }));

        const uid = getCurrentUserUid();
        if (!uid) {
            return;
        }

        await updateUserProfile(uid, fields);
        emitLeaderboardRefresh('profile-updated');
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used within a UserProvider');
    return ctx;
};