import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSidebar from '../components/ProfileSidebar';
import { api, getCurrentUser } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

const AppSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [settings, setSettings] = useState({
    language: language,
    theme: 'dark',
    locationAccess: true,
    notificationsPermission: true
  });
  const [preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    loadSettings();
  }, []);
  
  useEffect(() => {
    // Update local settings when global language changes
    setSettings(prev => ({ ...prev, language }));
  }, [language]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.auth.getPreferences();
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
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    const previousLanguage = settings.language;
    try {
      setSaving(true);
      setSettings(prev => ({ ...prev, language: lang }));
      setLanguage(lang as Language); // Update global language
      
      const appSettings = {
        language: lang,
        theme: settings.theme,
        emailDigest: preferences?.app?.emailDigest || 'weekly',
        autoBackup: preferences?.app?.autoBackup !== false
      };
      
      const response = await api.auth.updateAppSettings(appSettings);
      
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
    } catch (error) {
      console.error('Failed to update language:', error);
      setSettings(prev => ({ ...prev, language: previousLanguage }));
      setLanguage(previousLanguage as Language); // Rollback global language
      alert(t('updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleThemeToggle = async (isDark: boolean) => {
    const previousTheme = settings.theme;
    try {
      setSaving(true);
      const theme = isDark ? 'dark' : 'light';
      setSettings(prev => ({ ...prev, theme }));
      
      const appSettings = {
        language: settings.language,
        theme,
        emailDigest: preferences?.app?.emailDigest || 'weekly',
        autoBackup: preferences?.app?.autoBackup !== false
      };
      
      const response = await api.auth.updateAppSettings(appSettings);
      
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
      notification.textContent = t('themeSaved');
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('Failed to update theme:', error);
      setSettings(prev => ({ ...prev, theme: previousTheme }));
      alert(t('updateFailed'));
    } finally {
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.hash = '#/';
    }
  };

  if (loading) {
    return (
      <Layout title="" role="User" fullWidth hideSidebar>
        <div className="bg-[#0B1116] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading settings...</p>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Background Ambient Blobs */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>

        <ProfileHeader />

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 mt-20 relative z-10">
            <div className="flex flex-col md:flex-row gap-8">
            <ProfileSidebar activePage="settings" />
            <div className="flex-1">
                <div className="flex flex-col gap-8">
                <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-wrap justify-between gap-3 border-b border-white/5 pb-6">
                            <div className="flex flex-col gap-1">
                                <p className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">{t('appSettings')}</p>
                                <p className="text-[#94a3b8] text-base font-normal leading-normal">{t('appSettingsDesc')}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">\
                            
                            {/* General Preferences */}
                            <section className="flex flex-col gap-5">
                                <h3 className="text-white text-lg font-bold leading-tight">{t('generalPreferences')}</h3>
                                <div className="grid gap-6">
                                    <div className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white font-medium text-base">{t('languageSelection')}</span>
                                            <span className="text-[#94a3b8] text-sm">{t('languageDesc')}</span>
                                        </div>
                                        <select 
                                            value={settings.language}
                                            onChange={(e) => handleLanguageChange(e.target.value)}
                                            disabled={saving}
                                            className="bg-[#0B1116] border border-white/10 text-white rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] outline-none min-w-[140px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="en">English (US)</option>
                                            <option value="es">Español</option>
                                            <option value="fr">Français</option>
                                            <option value="de">Deutsch</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white font-medium text-base">{t('displayTheme')}</span>
                                            <span className="text-[#94a3b8] text-sm">{t('themeDesc')}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[#94a3b8] text-sm font-medium">{t('light')}</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    checked={settings.theme === 'dark'}
                                                    onChange={(e) => handleThemeToggle(e.target.checked)}
                                                    className="sr-only peer" 
                                                    type="checkbox" 
                                                />
                                                <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                            </label>
                                            <span className="text-white text-sm font-medium">{t('dark')}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Permissions */}
                            <section className="flex flex-col gap-5">
                                <h3 className="text-white text-lg font-bold leading-tight">{t('permissions')}</h3>
                                <div className="flex flex-col gap-1 bg-[#0B1116]/50 rounded-lg border border-white/5 divide-y divide-white/5">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="size-10 rounded-full bg-[#151F26] flex items-center justify-center text-[#10b981] border border-white/5">
                                                <span className="material-symbols-outlined">location_on</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{t('locationAccess')}</span>
                                                <span className="text-[#94a3b8] text-sm">{t('locationDesc')}</span>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                checked={settings.locationAccess}
                                                onChange={(e) => setSettings(prev => ({ ...prev, locationAccess: e.target.checked }))}
                                                className="sr-only peer" 
                                                type="checkbox" 
                                            />
                                            <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="size-10 rounded-full bg-[#151F26] flex items-center justify-center text-[#10b981] border border-white/5">
                                                <span className="material-symbols-outlined">notifications</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{t('notificationsPermission')}</span>
                                                <span className="text-[#94a3b8] text-sm">{t('notificationsDesc')}</span>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                checked={settings.notificationsPermission}
                                                onChange={(e) => setSettings(prev => ({ ...prev, notificationsPermission: e.target.checked }))}
                                                className="sr-only peer" 
                                                type="checkbox" 
                                            />
                                            <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Data & Storage */}
                            <section className="flex flex-col gap-5">
                                <h3 className="text-white text-lg font-bold leading-tight">{t('dataManagement')}</h3>
                                <div className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white font-medium text-base">{t('clearCache')}</span>
                                        <span className="text-[#94a3b8] text-sm">{t('clearCacheDesc')}</span>
                                    </div>
                                    <button 
                                        onClick={handleClearCache}
                                        className="flex cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-[#151F26] hover:bg-white/5 border border-white/10 text-white text-sm font-medium transition-colors"
                                    >
                                        {t('clearCacheBtn')}
                                    </button>
                                </div>
                            </section>

                            {/* Legal & Support */}
                            <section className="flex flex-col gap-5">
                                <h3 className="text-white text-lg font-bold leading-tight">{t('legal')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => window.location.hash = '#/about'}
                                        className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer"
                                    >
                                        <span className="text-white font-medium">About Us</span>
                                        <span className="material-symbols-outlined text-[#94a3b8] group-hover:text-[#10b981] transition-colors">chevron_right</span>
                                    </button>
                                    <button className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer">
                                        <span className="text-white font-medium">{t('termsOfService')}</span>
                                        <span className="material-symbols-outlined text-[#94a3b8] group-hover:text-[#10b981] transition-colors">chevron_right</span>
                                    </button>
                                    <button className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer">
                                        <span className="text-white font-medium">{t('privacyPolicy')}</span>
                                        <span className="material-symbols-outlined text-[#94a3b8] group-hover:text-[#10b981] transition-colors">chevron_right</span>
                                    </button>
                                    <button 
                                        onClick={() => window.location.hash = '#/contact'}
                                        className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer"
                                    >
                                        <span className="text-white font-medium">Help & Support Access</span>
                                        <span className="material-symbols-outlined text-[#94a3b8] group-hover:text-[#10b981] transition-colors">open_in_new</span>
                                    </button>
                                </div>
                            </section>

                            <section className="pt-6 mt-2 border-t border-white/5">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-base font-bold transition-colors gap-2"
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                    {t('logoutBtn')}
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </main>
      </div>
    </Layout>
  );
};

export default AppSettings;