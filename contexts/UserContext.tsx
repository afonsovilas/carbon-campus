import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
    name: string;
    email: string;
    tag: string;
    bio: string;
    avatarEmoji: string;
}

interface UserContextType {
    user: UserProfile;
    updateUser: (fields: Partial<UserProfile>) => void;
}

const DEFAULT_USER: UserProfile = {
    name: 'Utilizador',
    email: 'utilizador@fe.up.pt',
    tag: '@user',
    bio: '',
    avatarEmoji: '🧑',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

    const updateUser = (fields: Partial<UserProfile>) => {
        setUser(prev => ({ ...prev, ...fields }));
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