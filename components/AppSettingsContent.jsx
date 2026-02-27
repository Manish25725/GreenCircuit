import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import RolePageShell, { getRoleTheme } from './RolePageShell.jsx';
import BackButton from './BackButton.jsx';
import PageHeader from './PageHeader.jsx';
import SettingsSection from './SettingsSection.jsx';
import ToggleRow from './ToggleRow.jsx';
import Loader from './Loader.jsx';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
];
const THEMES = [
    { code: 'light', label: 'Light Mode', icon: 'light_mode' },
    { code: 'dark', label: 'Dark Mode', icon: 'dark_mode' },
];
const AppSettingsContent = ({ role }) => {
    const theme = getRoleTheme(role);
    const accent = theme.accent;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { language, setLanguage } = useLanguage();
    const { theme: currentTheme, setTheme } = useTheme();
    const [settings, setSettings] = useState({
        language,
        theme: currentTheme,
        locationAccess: true,
        notificationsPermission: true,
    });
    const [preferences, setPreferences] = useState(null);
    useEffect(() => {
        loadSettings();
    }, []);
    useEffect(() => {
        setSettings((prev) => ({ ...prev, language }));
    }, [language]);
    useEffect(() => {
        setSettings((prev) => ({ ...prev, theme: currentTheme }));
    }, [currentTheme]);
    const loadSettings = async () => {
        try {
            setLoading(true);
            const response = await api.getPreferences();
            if (response.data?.preferences?.app) {
                const appSettings = response.data.preferences.app;
                setSettings({
                    language: appSettings.language || 'en',
                    theme: appSettings.theme || 'dark',
                    locationAccess: true,
                    notificationsPermission: true,
                });
                setPreferences(response.data.preferences);
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const handleLanguageChange = async (lang) => {
        try {
            setSaving(true);
            setSettings((prev) => ({ ...prev, language: lang }));
            setLanguage(lang);
            await api.updateAppSettings({
                language: lang,
                theme: settings.theme,
                emailDigest: preferences?.app?.emailDigest || 'weekly',
                autoBackup: preferences?.app?.autoBackup !== false,
            });
        }
        catch (error) {
        }
        finally {
            setSaving(false);
        }
    };
    const handleThemeChange = async (newTheme) => {
        try {
            setSaving(true);
            setSettings((prev) => ({ ...prev, theme: newTheme }));
            setTheme(newTheme);
            await api.updateAppSettings({
                language: settings.language,
                theme: newTheme,
                emailDigest: preferences?.app?.emailDigest || 'weekly',
                autoBackup: preferences?.app?.autoBackup !== false,
            });
        }
        catch (error) {
        }
        finally {
            setSaving(false);
        }
    };
    const optionClass = (isActive) => `p-4 rounded-xl border transition-all ${isActive
        ? `border-current`
        : 'bg-[#0B1116] border-white/5 text-gray-200 hover:border-current/30 hover:bg-current/5'} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`;
    if (loading) {
        return (_jsx(RolePageShell, { role: role, children: _jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: _jsx(Loader, { size: "md", color: accent }) }) }));
    }
    return (_jsxs(RolePageShell, { role: role, children: [_jsx(BackButton, { label: "Back to Settings", color: accent, hoverColor: theme.hover }), _jsx(PageHeader, { icon: "settings", iconColor: accent, title: "App Settings", subtitle: "Customize your app experience with theme, language, and display preferences" }), _jsx(SettingsSection, { icon: "language", iconColor: accent, title: "Language", description: "Select your preferred language for the application", children: _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: LANGUAGES.map(({ code, label, flag }) => (_jsx("button", { onClick: () => handleLanguageChange(code), disabled: saving, className: optionClass(settings.language === code), style: settings.language === code ? { backgroundColor: `${accent}1a`, borderColor: accent, color: accent } : undefined, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: flag }), _jsx("span", { className: "font-medium", children: label })] }) }, code))) }) }), _jsx(SettingsSection, { icon: "palette", iconColor: "#8b5cf6", title: "Theme", description: "Choose between light and dark mode", children: _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: THEMES.map(({ code, label, icon }) => (_jsx("button", { onClick: () => handleThemeChange(code), disabled: saving, className: optionClass(settings.theme === code), style: settings.theme === code ? { backgroundColor: '#8b5cf61a', borderColor: '#8b5cf6', color: '#8b5cf6' } : undefined, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "material-symbols-outlined", children: icon }), _jsx("span", { className: "font-medium", children: label })] }) }, code))) }) }), _jsx(SettingsSection, { icon: "display_settings", iconColor: accent, title: "Display Preferences", description: "Customize how information is displayed", className: "", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(ToggleRow, { label: "Compact View", description: "Show more information on screen", color: accent }), _jsx(ToggleRow, { label: "Auto-refresh Data", description: "Automatically update dashboard data", defaultChecked: true, color: accent }), _jsx(ToggleRow, { label: "High Contrast", description: "Increase contrast for better visibility", color: accent, showBorder: false })] }) })] }));
};
export default AppSettingsContent;
