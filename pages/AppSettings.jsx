import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import ProfileHeader from '../components/ProfileHeader.jsx';
import ProfileSidebar from '../components/ProfileSidebar.jsx';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import Loader from '../components/Loader.jsx';
import { useNavigate } from 'react-router-dom';
const AppSettings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [settings, setSettings] = useState({
        language: language,
        theme: theme,
        locationAccess: true,
        notificationsPermission: true
    });
    const [preferences, setPreferences] = useState(null);
    useEffect(() => {
        loadSettings();
    }, []);
    useEffect(() => {
        // Update local settings when global language changes
        setSettings(prev => ({ ...prev, language }));
    }, [language]);
    useEffect(() => {
        // Update local settings when global theme changes
        setSettings(prev => ({ ...prev, theme }));
    }, [theme]);
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
                    notificationsPermission: true
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
        const previousLanguage = settings.language;
        try {
            setSaving(true);
            setSettings(prev => ({ ...prev, language: lang }));
            setLanguage(lang); // Update global language
            const appSettings = {
                language: lang,
                theme: settings.theme,
                emailDigest: preferences?.app?.emailDigest || 'weekly',
                autoBackup: preferences?.app?.autoBackup !== false
            };
            const response = await api.updateAppSettings(appSettings);
            if (response.data?.preferences?.app) {
                setPreferences(response.data.preferences);
                // Update settings state with saved values
                setSettings(prev => ({
                    ...prev,
                    language: response.data.preferences.app.language,
                    theme: response.data.preferences.app.theme
                }));
            }
            // Show success feedback
            const notification = document.createElement('div');
            notification.className = 'fixed top-24 right-4 bg-[#10b981] text-white px-6 py-3 rounded-lg shadow-lg z-50';
            notification.textContent = t('languageSaved');
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
        catch (error) {
            setSettings(prev => ({ ...prev, language: previousLanguage }));
            setLanguage(previousLanguage); // Rollback global language
            alert(t('updateFailed'));
        }
        finally {
            setSaving(false);
        }
    };
    const handleThemeToggle = async (isDark) => {
        const previousTheme = theme;
        try {
            setSaving(true);
            const newTheme = isDark ? 'dark' : 'light';
            setTheme(newTheme);
            const appSettings = {
                language: settings.language,
                theme: newTheme,
                emailDigest: preferences?.app?.emailDigest || 'weekly',
                autoBackup: preferences?.app?.autoBackup !== false
            };
            const response = await api.updateAppSettings(appSettings);
            if (response.data?.preferences?.app) {
                setPreferences(response.data.preferences);
            }
            // Show success feedback
            const notification = document.createElement('div');
            notification.className = 'fixed top-24 right-4 bg-[#10b981] text-white px-6 py-3 rounded-lg shadow-lg z-50';
            notification.textContent = t('themeSaved');
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
        catch (error) {
            setTheme(previousTheme);
            alert(t('updateFailed'));
        }
        finally {
            setSaving(false);
        }
    };
    const handleClearCache = () => {
        if (window.confirm(t('cacheClearConfirm'))) {
            localStorage.removeItem('agenciesCache');
            localStorage.removeItem('bookingsCache');
            alert(t('cacheCleared'));
        }
    };
    const handleLogout = () => {
        if (window.confirm(t('logoutConfirm'))) {
            api.logout();
            navigate('/');
        }
    };
    if (loading) {
        return (_jsx(Layout, { title: "", role: "User", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "bg-[#0B1116] min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader, { size: "md", color: "#10b981" }), _jsx("p", { className: "text-slate-400 mt-4", children: "Loading settings..." })] }) }) }));
    }
    return (_jsx(Layout, { title: "", role: "User", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased min-h-screen flex flex-col relative overflow-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] fixed bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] fixed bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsx(ProfileHeader, {}), _jsx("main", { className: "flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 mt-20 relative z-10", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsx(ProfileSidebar, { activePage: "settings" }), _jsx("div", { className: "flex-1", children: _jsx("div", { className: "flex flex-col gap-8", children: _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl", children: _jsxs("div", { className: "flex flex-col gap-8", children: [_jsx("div", { className: "flex flex-wrap justify-between gap-3 border-b border-white/5 pb-6", children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("p", { className: "text-white text-2xl font-bold leading-tight tracking-[-0.033em]", children: t('appSettings') }), _jsx("p", { className: "text-slate-400 text-base font-normal leading-normal", children: t('appSettingsDesc') })] }) }), _jsxs("div", { className: "flex flex-col gap-8", children: [_jsxs("section", { className: "flex flex-col gap-5", children: [_jsx("h3", { className: "text-white text-lg font-bold leading-tight", children: t('generalPreferences') }), _jsxs("div", { className: "grid gap-6", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-[#151F26] rounded-lg border-white/5 border", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-white font-medium text-base", children: t('languageSelection') }), _jsx("span", { className: "text-slate-400 text-sm", children: t('languageDesc') })] }), _jsxs("select", { value: settings.language, onChange: (e) => handleLanguageChange(e.target.value), disabled: saving, className: "bg-[#0B1116] border border-white/5 text-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] outline-none min-w-[140px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("option", { value: "en", children: "English (US)" }), _jsx("option", { value: "es", children: "Espa\u00F1ol" }), _jsx("option", { value: "fr", children: "Fran\u00E7ais" }), _jsx("option", { value: "de", children: "Deutsch" })] })] }), _jsxs("div", { className: "flex items-center justify-between p-4 bg-[#151F26] rounded-lg border-white/5 border", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-white font-medium text-base", children: t('displayTheme') }), _jsx("span", { className: "text-slate-400 text-sm", children: t('themeDesc') })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-slate-400 text-sm font-medium", children: t('light') }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { checked: settings.theme === 'dark', onChange: (e) => handleThemeToggle(e.target.checked), className: "sr-only peer", type: "checkbox" }), _jsx("div", { className: "w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/5" })] }), _jsx("span", { className: "text-white text-sm font-medium", children: t('dark') })] })] })] })] }), _jsxs("section", { className: "flex flex-col gap-5", children: [_jsx("h3", { className: "text-white text-lg font-bold leading-tight", children: t('permissions') }), _jsxs("div", { className: "flex flex-col gap-1 bg-[#151F26] rounded-lg border-white/5 border divide-y border-white/5", children: [_jsxs("div", { className: "flex items-center justify-between p-4", children: [_jsxs("div", { className: "flex gap-4 items-center", children: [_jsx("div", { className: "size-10 rounded-full bg-[#151F26] flex items-center justify-center text-[#10b981] border border-white/5", children: _jsx("span", { className: "material-symbols-outlined", children: "location_on" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-white font-medium", children: t('locationAccess') }), _jsx("span", { className: "text-slate-400 text-sm", children: t('locationDesc') })] })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { checked: settings.locationAccess, onChange: (e) => setSettings(prev => ({ ...prev, locationAccess: e.target.checked })), className: "sr-only peer", type: "checkbox" }), _jsx("div", { className: "w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/5" })] })] }), _jsxs("div", { className: "flex items-center justify-between p-4", children: [_jsxs("div", { className: "flex gap-4 items-center", children: [_jsx("div", { className: "size-10 rounded-full bg-[#151F26] flex items-center justify-center text-[#10b981] border border-white/5", children: _jsx("span", { className: "material-symbols-outlined", children: "notifications" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-white font-medium", children: t('notificationsPermission') }), _jsx("span", { className: "text-[#94a3b8] text-sm", children: t('notificationsDesc') })] })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { checked: settings.notificationsPermission, onChange: (e) => setSettings(prev => ({ ...prev, notificationsPermission: e.target.checked })), className: "sr-only peer", type: "checkbox" }), _jsx("div", { className: "w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/5" })] })] })] })] }), _jsxs("section", { className: "flex flex-col gap-5", children: [_jsx("h3", { className: "text-white text-lg font-bold leading-tight", children: t('dataManagement') }), _jsxs("div", { className: "flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-white font-medium text-base", children: t('clearCache') }), _jsx("span", { className: "text-[#94a3b8] text-sm", children: t('clearCacheDesc') })] }), _jsx("button", { onClick: handleClearCache, className: "flex cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-[#151F26] hover:bg-white/5 border border-white/5 text-white text-sm font-medium transition-colors", children: t('clearCacheBtn') })] })] }), _jsxs("section", { className: "flex flex-col gap-5", children: [_jsx("h3", { className: "text-white text-lg font-bold leading-tight", children: t('legal') }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("button", { onClick: () => navigate('/about'), className: "flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer", children: [_jsx("span", { className: "text-white font-medium", children: "About Us" }), _jsx("span", { className: "material-symbols-outlined text-[#94a3b8] group-hover:text-[#10b981] transition-colors", children: "chevron_right" })] }), _jsxs("button", { className: "flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer", children: [_jsx("span", { className: "text-white font-medium", children: t('termsOfService') }), _jsx("span", { className: "material-symbols-outlined text-[#94a3b8] group-hover:text-[#10b981] transition-colors", children: "chevron_right" })] }), _jsxs("button", { className: "flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer", children: [_jsx("span", { className: "text-white font-medium", children: t('privacyPolicy') }), _jsx("span", { className: "material-symbols-outlined text-[#94a3b8] group-hover:text-[#10b981] transition-colors", children: "chevron_right" })] }), _jsxs("button", { onClick: () => navigate('/contact'), className: "flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer", children: [_jsx("span", { className: "text-white font-medium", children: "Help & Support Access" }), _jsx("span", { className: "material-symbols-outlined text-[#94a3b8] group-hover:text-[#10b981] transition-colors", children: "open_in_new" })] })] })] }), _jsx("section", { className: "pt-6 mt-2 border-t border-white/5", children: _jsxs("button", { onClick: handleLogout, className: "w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-base font-bold transition-colors gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "logout" }), t('logoutBtn')] }) })] })] }) }) }) })] }) })] }) }));
};
export default AppSettings;
