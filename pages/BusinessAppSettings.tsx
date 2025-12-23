import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getCurrentUser, User } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../i18n/translations';

const BusinessAppSettings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    language: language,
    theme: theme,
    locationAccess: true,
    notificationsPermission: true
  });
  const [preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    loadSettings();
  }, []);
  
  useEffect(() => {
    setSettings(prev => ({ ...prev, language }));
  }, [language]);

  useEffect(() => {
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
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    try {
      setSaving(true);
      setSettings(prev => ({ ...prev, language: lang }));
      setLanguage(lang as Language);
      
      const appSettings = {
        language: lang,
        theme: settings.theme,
        emailDigest: preferences?.app?.emailDigest || 'weekly',
        autoBackup: preferences?.app?.autoBackup !== false
      };
      
      await api.updateAppSettings(appSettings);
    } catch (error) {
      console.error('Failed to update language:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    try {
      setSaving(true);
      setSettings(prev => ({ ...prev, theme: newTheme }));
      setTheme(newTheme as 'light' | 'dark');
      
      const appSettings = {
        language: settings.language,
        theme: newTheme,
        emailDigest: preferences?.app?.emailDigest || 'weekly',
        autoBackup: preferences?.app?.autoBackup !== false
      };
      
      await api.updateAppSettings(appSettings);
    } catch (error) {
      console.error('Failed to update theme:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.hash = '#/login';
  };

  if (loading) {
    return (
      <Layout title="" role="Business" fullWidth hideSidebar>
        <div className="flex items-center justify-center min-h-screen bg-[#0B1116]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#06b6d4]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role="Business" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#06b6d4]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/business'}>
                <div className="p-2 bg-[#06b6d4]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#06b6d4]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#06b6d4]">Business</span></h2>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center size-10 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-red-400">logout</span>
                </button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-10">
              <div className="layout-content-container flex flex-col w-full max-w-6xl">
                {/* Back Button */}
                <button 
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 text-[#06b6d4] hover:text-[#0891b2] transition-colors mb-6 group"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span className="text-sm font-medium">Back to Settings</span>
                </button>

                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#06b6d4]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#06b6d4] text-[28px]">settings</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">App Settings</h1>
                      <p className="text-gray-400 text-sm">Customize your app experience with theme, language, and display preferences</p>
                    </div>
                  </div>
                </div>

                {/* Language Settings */}
                <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5 mb-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#06b6d4]">language</span>
                        <h3 className="text-white text-lg font-bold leading-tight">Language</h3>
                      </div>
                      <p className="text-[#94a3b8] text-sm">Select your preferred language for the application</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['en', 'es', 'fr', 'hi'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          disabled={saving}
                          className={`p-4 rounded-xl border transition-all ${
                            settings.language === lang
                              ? 'bg-[#06b6d4]/10 border-[#06b6d4] text-[#06b6d4]'
                              : 'bg-[#0B1116] border-white/10 text-gray-300 hover:border-[#06b6d4]/30 hover:bg-[#06b6d4]/5'
                          } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="font-medium">
                            {lang === 'en' && 'English'}
                            {lang === 'es' && 'Español'}
                            {lang === 'fr' && 'Français'}
                            {lang === 'hi' && 'हिन्दी'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Theme Settings */}
                <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5 mb-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#8b5cf6]">palette</span>
                        <h3 className="text-white text-lg font-bold leading-tight">Theme</h3>
                      </div>
                      <p className="text-[#94a3b8] text-sm">Choose between light and dark mode</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleThemeChange('light')}
                        disabled={saving}
                        className={`p-4 rounded-xl border transition-all ${
                          settings.theme === 'light'
                            ? 'bg-[#8b5cf6]/10 border-[#8b5cf6] text-[#8b5cf6]'
                            : 'bg-[#0B1116] border-white/10 text-gray-300 hover:border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/5'
                        } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined">light_mode</span>
                          <span className="font-medium">Light Mode</span>
                        </div>
                      </button>
                      <button
                        onClick={() => handleThemeChange('dark')}
                        disabled={saving}
                        className={`p-4 rounded-xl border transition-all ${
                          settings.theme === 'dark'
                            ? 'bg-[#8b5cf6]/10 border-[#8b5cf6] text-[#8b5cf6]'
                            : 'bg-[#0B1116] border-white/10 text-gray-300 hover:border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/5'
                        } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined">dark_mode</span>
                          <span className="font-medium">Dark Mode</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Display Settings */}
                <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#06b6d4]">display_settings</span>
                        <h3 className="text-white text-lg font-bold leading-tight">Display Preferences</h3>
                      </div>
                      <p className="text-[#94a3b8] text-sm">Customize how information is displayed</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">Compact View</span>
                          <span className="text-[#94a3b8] text-xs">Show more information on screen</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#06b6d4]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">Auto-refresh Data</span>
                          <span className="text-[#94a3b8] text-xs">Automatically update dashboard data</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#06b6d4]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">High Contrast</span>
                          <span className="text-[#94a3b8] text-xs">Increase contrast for better visibility</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#06b6d4]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#06b6d4]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessAppSettings;
