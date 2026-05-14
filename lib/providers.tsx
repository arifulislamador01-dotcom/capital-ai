'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'bn' | 'en';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  notifications: string[];
  addNotification: (message: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('bn');
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [message, ...prev]);
  };

  const clearNotifications = () => setNotifications([]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppContext.Provider value={{ language, setLanguage, notifications, addNotification, clearNotifications }}>
        {children}
      </AppContext.Provider>
    </NextThemesProvider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
