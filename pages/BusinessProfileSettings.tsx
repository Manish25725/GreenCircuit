import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import NotificationBell from '../components/NotificationBell';
import { api, getCurrentUser } from '../services/api';

interface BusinessProfile {
  _id: string;
  userId: string;
  companyName: string;
  email: string;
  logo?: string;
  industry: string;
  isVerified: boolean;
}

const BusinessProfileSettings = () => {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const user = getCurrentUser();

  useEffect(() => {
    loadBusinessProfile();
    
    // Listen for user updates (avatar/logo changes)
    const handleUserUpdate = () => {
      setAvatarKey(Date.now());
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  const loadBusinessProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/business/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        setBusiness(data);
      }
    } catch (error) {
      console.error('Failed to load business profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '#/';
  };

  const settingsCards = [
    {
      id: 1,
      title: 'Edit Profile',
      description: 'Update company information and logo',
      icon: 'business',
      color: '#06b6d4',
      link: '#/business/profile'
    },
    {
      id: 3,
      title: 'Security & Privacy',
      description: 'Password, 2FA, and privacy settings',
      icon: 'lock',
      color: '#8b5cf6',
      link: '#/security'
    },
    {
      id: 4,
      title: 'App Settings',
      description: 'Language, theme, and app preferences',
      icon: 'settings',
      color: '#10b981',
      link: '#/settings'
    }
  ];

  if (loading) {
    return (
      <Layout title="" role="Business" fullWidth hideSidebar>
        <div className="bg-[#0B1116] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader size="md" color="#3b82f6" className="mb-4" />
            <p className="text-slate-400">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="" role="Business" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          {/* Background gradients matching business dashboard */}
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#06b6d4]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header matching BusinessDashboard */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/business'}>
                <div className="p-2 bg-[#06b6d4]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#06b6d4]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#06b6d4]">Business</span></h2>
              </div>
              <nav className="hidden md:flex flex-1 justify-center gap-1">
              </nav>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <button 
                    onClick={() => window.location.hash = '#/business'}
                    className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="size-8 rounded-full ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all overflow-hidden bg-[#06b6d4] flex items-center justify-center">
                      {(business?.logo || user?.avatar) ? (
                        <img 
                          src={`${business?.logo || user?.avatar}?t=${avatarKey}`} 
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `<span class="text-white text-xs font-bold">${(business?.companyName || user?.name || 'B').charAt(0).toUpperCase()}</span>`;
                          }}
                        />
                      ) : (
                        <span className="text-white text-xs font-bold">{(business?.companyName || user?.name || 'B').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-200">{business?.companyName || user?.name}</span>
                  </button>
                  {/* Hover Preview */}
                  <div className="absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                    <div className="bg-[#151F26] border border-white/5 rounded-2xl p-4 shadow-2xl">
                      <div className="size-32 rounded-xl ring-4 ring-[#06b6d4]/30 overflow-hidden bg-[#06b6d4] flex items-center justify-center">
                        {(business?.logo || user?.avatar) ? (
                          <img 
                            src={`${business?.logo || user?.avatar}?t=${avatarKey}`} 
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-4xl font-bold">{(business?.companyName || user?.name || 'B').charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            </header>

            {/* Main Content */}
            <main className="px-4 sm:px-6 lg:px-10 pt-24 pb-10">
              <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#06b6d4]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#06b6d4] text-[28px]">settings</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile Settings</h1>
                      <p className="text-slate-400 text-sm">Manage your account preferences and settings</p>
                    </div>
                  </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {settingsCards.map((card) => (
                    <div 
                      key={card.id}
                      onClick={() => window.location.hash = card.link}
                      className="group bg-[#151F26] border border-white/5 hover:border-white/5 rounded-xl p-6 cursor-pointer transition-all hover:bg-[#1a2730]"
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="p-3 rounded-lg transition-colors"
                          style={{ backgroundColor: `${card.color}15` }}
                        >
                          <span 
                            className="material-symbols-outlined text-[32px]"
                            style={{ color: card.color }}
                          >
                            {card.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 
                            className="text-lg font-bold text-white mb-1 transition-colors"
                            style={{ color: 'white' }}
                          >
                            {card.title}
                          </h3>
                          <p className="text-slate-400 text-sm leading-relaxed mb-3">
                            {card.description}
                          </p>
                          <div 
                            className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: card.color }}
                          >
                            <span>Open</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dashboard Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => window.location.hash = '#/business'}
                    className="flex items-center gap-3 px-8 py-4 rounded-xl bg-[#06b6d4] hover:bg-[#0891b2] text-white font-semibold transition-all shadow-lg shadow-[#06b6d4]/20 hover:shadow-[#06b6d4]/40"
                  >
                    <span className="material-symbols-outlined text-[24px]">dashboard</span>
                    <span>Go to Dashboard</span>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessProfileSettings;
