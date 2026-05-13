import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Lang, translations } from '@/utils/i18n';

const STORAGE_KEY = 'app_language';

interface LanguageContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<Lang>('en');

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
            if (stored === 'en' || stored === 'pt') {
                setLangState(stored);
            }
        });
    }, []);

    const setLang = useCallback((newLang: Lang) => {
        setLangState(newLang);
        AsyncStorage.setItem(STORAGE_KEY, newLang);
    }, []);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
    return ctx;
}