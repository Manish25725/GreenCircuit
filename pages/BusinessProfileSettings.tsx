import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
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

  useEffect(() => {
    loadBusinessProfile();
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

  const user = getCurrentUser();

  if (loading) {
    return (
      <Layout title="" role="Business" fullWidth hideSidebar>
        <div className="bg-[#0B1116] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader size="md" color="#3b82f6" className="mb-4" />
            <p className="text-gray-400">Loading profile...</p>
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
                <button 
                  onClick={() => window.location.hash = '#/business'}
                  className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="size-8 rounded-full bg-[#06b6d4] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all text-white font-bold text-sm"
                       style={business?.logo ? { backgroundImage: `url(${business.logo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                    {!business?.logo && (business?.companyName?.charAt(0) || user?.name?.charAt(0) || 'B')}
                  </div>
                  <span className="text-sm font-medium text-gray-200">{business?.companyName || user?.name || 'Business'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center size-10 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-red-400">logout</span>
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
                      <p className="text-gray-400 text-sm">Manage your account preferences and settings</p>
                    </div>
                  </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Edit Business Profile Card */}
                  <div 
                    onClick={() => window.location.hash = '#/business/profile'}
                    className="group bg-[#151F26] border border-white/5 hover:border-[#10b981]/30 rounded-xl p-6 cursor-pointer transition-all hover:bg-[#151F26]/80"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#10b981]/10 rounded-lg group-hover:bg-[#10b981]/20 transition-colors">
                        <span className="material-symbols-outlined text-[#10b981] text-[32px]">business</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#10b981] transition-colors">Edit Business Profile</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-3">
                          Update company info, address, and details
                        </p>
                        <div className="flex items-center gap-1 text-[#10b981] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Edit</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Card */}
                  <div 
                    onClick={() => window.location.hash = '#/business/contact'}
                    className="group bg-[#151F26] border border-white/5 hover:border-[#06b6d4]/30 rounded-xl p-6 cursor-pointer transition-all hover:bg-[#151F26]/80"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#06b6d4]/10 rounded-lg group-hover:bg-[#06b6d4]/20 transition-colors">
                        <span className="material-symbols-outlined text-[#06b6d4] text-[32px]">contact_page</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#06b6d4] transition-colors">Contact Information</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-3">
                          Update contact person and details
                        </p>
                        <div className="flex items-center gap-1 text-[#06b6d4] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Manage</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notifications Card */}
                  <div 
                    onClick={() => window.location.hash = '#/notifications'}
                    className="group bg-[#151F26] border border-white/5 hover:border-[#06b6d4]/30 rounded-xl p-6 cursor-pointer transition-all hover:bg-[#151F26]/80"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#06b6d4]/10 rounded-lg group-hover:bg-[#06b6d4]/20 transition-colors">
                        <span className="material-symbols-outlined text-[#06b6d4] text-[32px]">notifications</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#06b6d4] transition-colors">Notifications</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-3">
                          Manage notification preferences and alerts
                        </p>
                        <div className="flex items-center gap-1 text-[#06b6d4] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Configure</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security & Privacy Card */}
                  <div 
                    onClick={() => window.location.hash = '#/security'}
                    className="group bg-[#151F26] border border-white/5 hover:border-[#8b5cf6]/30 rounded-xl p-6 cursor-pointer transition-all hover:bg-[#151F26]/80"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#8b5cf6]/10 rounded-lg group-hover:bg-[#8b5cf6]/20 transition-colors">
                        <span className="material-symbols-outlined text-[#8b5cf6] text-[32px]">lock</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#8b5cf6] transition-colors">Security & Privacy</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-3">
                          Password, 2FA, and privacy settings
                        </p>
                        <div className="flex items-center gap-1 text-[#8b5cf6] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Manage</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* App Settings Card */}
                  <div 
                    onClick={() => window.location.hash = '#/settings'}
                    className="group bg-[#151F26] border border-white/5 hover:border-[#06b6d4]/30 rounded-xl p-6 cursor-pointer transition-all hover:bg-[#151F26]/80"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#06b6d4]/10 rounded-lg group-hover:bg-[#06b6d4]/20 transition-colors">
                        <span className="material-symbols-outlined text-[#06b6d4] text-[32px]">settings</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#06b6d4] transition-colors">App Settings</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-3">
                          Theme, language, and display preferences
                        </p>
                        <div className="flex items-center gap-1 text-[#06b6d4] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Customize</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
