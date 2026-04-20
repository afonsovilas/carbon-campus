import React, { createContext, useContext, useState } from 'react';

interface DrawerContextType {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <DrawerContext.Provider value={{
            isOpen,
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
            toggle: () => setIsOpen(prev => !prev),
        }}>
            {children}
        </DrawerContext.Provider>
    );
};

export const useDrawer = () => {
    const ctx = useContext(DrawerContext);
    if (!ctx) throw new Error('useDrawer must be used within DrawerProvider');
    return ctx;
};