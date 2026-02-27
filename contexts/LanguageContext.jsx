import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '../i18n/translations.js';
import { api } from '../services/api.js';
const LanguageContext = createContext(undefined);
export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState('en');
    useEffect(() => {
        loadLanguagePreference();
    }, []);
    const loadLanguagePreference = async () => {
        try {
            // First, load from localStorage for instant display
            const savedLang = localStorage.getItem('appLanguage');
            if (savedLang) {
                setLanguageState(savedLang);
            }
            // Then sync with MongoDB
            const response = await api.getPreferences();
            if (response.data?.preferences?.app?.language) {
                const dbLang = response.data.preferences.app.language;
                setLanguageState(dbLang);
                localStorage.setItem('appLanguage', dbLang);
            }
        }
        catch (error) {
            // Keep localStorage value if API fails
        }
    };
    const setLanguage = async (lang) => {
        setLanguageState(lang);
        localStorage.setItem('appLanguage', lang);
        try {
            await api.updateAppSettings({
                language: lang
            });
        }
        catch (error) {
        }
    };
    const t = (key) => {
        return getTranslation(language, key);
    };
    return (_jsx(LanguageContext.Provider, { value: { language, setLanguage, t }, children: children }));
};
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
