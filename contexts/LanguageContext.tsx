import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation, Language } from '../i18n/translations';
import { api } from '../services/api';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      // First, load from localStorage for instant display
      const savedLang = localStorage.getItem('appLanguage');
      if (savedLang) {
        setLanguageState(savedLang as Language);
      }

      // Then sync with MongoDB
      const response = await api.getPreferences();
      if (response.data?.preferences?.app?.language) {
        const dbLang = response.data.preferences.app.language as Language;
        setLanguageState(dbLang);
        localStorage.setItem('appLanguage', dbLang);
      }
    } catch (error) {
      // Keep localStorage value if API fails
    }
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
    try {
      await api.updatePreferences({
        app: { language: lang }
      });
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const t = (key: string): string => {
    return getTranslation(language, key as any);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
