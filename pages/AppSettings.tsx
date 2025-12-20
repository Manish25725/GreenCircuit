import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSidebar from '../components/ProfileSidebar';
import { api, getCurrentUser } from '../services/api';

const AppSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    language: 'en',
    theme: 'dark',
    locationAccess: true,
    notificationsPermission: true
  });
  const [preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    loadSettings();
  }, []);

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

  const handleLanguageChange = async (language: string) => {
    try {
      setSettings(prev => ({ ...prev, language }));
      await api.auth.updateAppSettings({
        ...preferences?.app,
        language
      });
    } catch (error) {
      console.error('Failed to update language:', error);
      alert('Failed to update language');
    }
  };

  const handleThemeToggle = async (isDark: boolean) => {
    try {
      const theme = isDark ? 'dark' : 'light';
      setSettings(prev => ({ ...prev, theme }));
      await api.auth.updateAppSettings({
        ...preferences?.app,
        theme
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
      alert('Failed to update theme');
    }
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear the cache? This will remove temporary data and may require reloading.')) {
      localStorage.removeItem('agenciesCache');
      localStorage.removeItem('bookingsCache');
      alert('Cache cleared successfully!');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
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
                                <p className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">App Settings</p>
                                <p className="text-[#94a3b8] text-base font-normal leading-normal">Customize your app experience, manage permissions, and view legal info.</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">
                            
                            {/* General Preferences */}
                            <section className="flex flex-col gap-5">
                                <h3 className="text-white text-lg font-bold leading-tight">General Preferences</h3>
                                <div className="grid gap-6">
                                    <div className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white font-medium text-base">Language Selection</span>
                                            <span className="text-[#94a3b8] text-sm">Choose the language for the application interface.</span>
                                        </div>
                                        <select 
                                            value={settings.language}
                                            onChange={(e) => handleLanguageChange(e.target.value)}
                                            className="bg-[#0B1116] border border-white/10 text-white rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] outline-none min-w-[140px] cursor-pointer"
                                        >
                                            <option value="en">English (US)</option>
                                            <option value="es">Español</option>
                                            <option value="fr">Français</option>
                                            <option value="de">Deutsch</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white font-medium text-base">Display Theme</span>
                                            <span className="text-[#94a3b8] text-sm">Switch between dark and light appearance.</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[#94a3b8] text-sm font-medium">Light</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    checked={settings.theme === 'dark'}
                                                    onChange={(e) => handleThemeToggle(e.target.checked)}
                                                    className="sr-only peer" 
                                                    type="checkbox" 
                                                />
                                                <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                            </label>
                                            <span className="text-white text-sm font-medium">Dark</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Permissions */}
                            <section className="flex flex-col gap-5">
                                <h3 className="text-white text-lg font-bold leading-tight">Permissions</h3>
                                <div className="flex flex-col gap-1 bg-[#0B1116]/50 rounded-lg border border-white/5 divide-y divide-white/5">
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="size-10 rounded-full bg-[#151F26] flex items-center justify-center text-[#10b981] border border-white/5">
                                                <span className="material-symbols-outlined">location_on</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">Location Access</span>
                                                <span className="text-[#94a3b8] text-sm">Allow app to access your location for pickups.</span>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input defaultChecked className="sr-only peer" type="checkbox" />
                                            <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="size-10 rounded-full bg-[#151F26] flex items-center justify-center text-[#10b981] border border-white/5">
                                                <span className="material-symbols-outlined">notifications</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">Notifications</span>
                                                <span className="text-[#94a3b8] text-sm">Receive updates on pickups and rewards.</span>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input defaultChecked className="sr-only peer" type="checkbox" />
                                            <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] border border-white/10"></div>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* Data & Storage */}
                            <section className="flex flex-col gap-5">
                                <h3 className="text-white text-lg font-bold leading-tight">Data & Storage</h3>
                                <div className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-white font-medium text-base">Cache Management</span>
                                        <span className="text-[#94a3b8] text-sm">Clear temporary application data to free up space (145 MB).</span>
                                    </div>
                                    <button className="flex cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-[#151F26] hover:bg-white/5 border border-white/10 text-white text-sm font-medium transition-colors">
                                        Clear Cache
                                    </button>
                                </div>
                            </section>

                            {/* Legal & Support */}
                            <section className="flex flex-col gap-5">
                                <h3 className="text-white text-lg font-bold leading-tight">Legal & Support</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => window.location.hash = '#/about'}
                                        className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer"
                                    >
                                        <span className="text-white font-medium">About Us</span>
                                        <span className="material-symbols-outlined text-[#94a3b8] group-hover:text-[#10b981] transition-colors">chevron_right</span>
                                    </button>
                                    <button className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer">
                                        <span className="text-white font-medium">Terms & Conditions</span>
                                        <span className="material-symbols-outlined text-[#94a3b8] group-hover:text-[#10b981] transition-colors">chevron_right</span>
                                    </button>
                                    <button className="flex items-center justify-between p-4 bg-[#0B1116]/50 rounded-lg border border-white/5 hover:bg-[#151F26] transition-colors group cursor-pointer">
                                        <span className="text-white font-medium">Privacy Policy</span>
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
                                    onClick={() => window.location.hash = '#/'}
                                    className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-base font-bold transition-colors gap-2"
                                >
                                    <span className="material-symbols-outlined">logout</span>
                                    Log Out of Application
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