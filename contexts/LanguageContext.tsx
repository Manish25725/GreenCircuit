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
    // Load language preference from API on mount
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const response = await api.getPreferences();
      if (response.data?.preferences?.app?.language) {
        setLanguageState(response.data.preferences.app.language as Language);
      }
    } catch (error) {
      // If API fails, try localStorage
      const savedLang = localStorage.getItem('appLanguage');
      if (savedLang) {
        setLanguageState(savedLang as Language);
      }
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
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
