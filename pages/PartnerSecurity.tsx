import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser, User } from '../services/api';

const PartnerSecurity = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.hash = '#/';
  };

  return (
    <Layout title="" role="Partner" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#8b5cf6] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/agency/dashboard'}>
                <div className="p-2 bg-[#8b5cf6]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#8b5cf6]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#8b5cf6] font-semibold">Partner</span></h2>
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
                  className="flex items-center gap-2 text-[#8b5cf6] hover:text-[#7c3aed] transition-colors mb-6 group"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span className="text-sm font-medium">Back to Settings</span>
                </button>

                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#8b5cf6]/10 rounded-lg">
                      <span className="material-symbols-outlined text-[#8b5cf6] text-[28px]">lock</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">Security & Privacy</h1>
                      <p className="text-gray-400 text-sm">Manage your password, login security, and privacy settings</p>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5 mb-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white text-lg font-bold leading-tight">Change Password</h3>
                      <p className="text-[#94a3b8] text-sm">Ensure your account is using a long, random password to stay secure.</p>
                    </div>
                    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">Current Password</span>
                          <input 
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all" 
                            placeholder="Enter current password" 
                            type="password"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">New Password</span>
                          <input 
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all" 
                            placeholder="Enter new password" 
                            type="password"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <span className="text-white text-sm font-medium leading-normal pb-2">Confirm New Password</span>
                          <input 
                            className="w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all" 
                            placeholder="Confirm new password" 
                            type="password"
                          />
                        </label>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button 
                          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#8b5cf6] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#7c3aed] transition-all" 
                          type="submit"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* 2FA */}
                <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5 mb-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex flex-col gap-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#8b5cf6]">security</span>
                        <h3 className="text-white text-lg font-bold leading-tight">Two-Factor Authentication</h3>
                      </div>
                      <p className="text-[#94a3b8] text-sm">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
                    </div>
                    <button className="flex whitespace-nowrap min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0B1116] text-[#8b5cf6] border border-white/10 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#8b5cf6]/10 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                {/* Privacy Controls */}
                <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#8b5cf6]">shield</span>
                        <h3 className="text-white text-lg font-bold leading-tight">Privacy Settings</h3>
                      </div>
                      <p className="text-[#94a3b8] text-sm">Control how your data is used and shared.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">Profile Visibility</span>
                          <span className="text-[#94a3b8] text-xs">Control who can see your Partner profile</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8b5cf6]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">Activity Tracking</span>
                          <span className="text-[#94a3b8] text-xs">Allow analytics to improve your experience</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8b5cf6]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-medium">Data Sharing</span>
                          <span className="text-[#94a3b8] text-xs">Share anonymized data with partners</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-[#0B1116] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#8b5cf6]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Sessions Section */}
                <div className="bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5 mt-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex flex-col gap-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#8b5cf6]">devices</span>
                        <h3 className="text-white text-lg font-bold leading-tight">Active Sessions</h3>
                      </div>
                      <p className="text-[#94a3b8] text-sm">View and manage all devices currently logged into your account. Log out sessions you don't recognize.</p>
                    </div>
                    <button 
                      onClick={() => window.location.hash = '#/partner/sessions'}
                      className="flex whitespace-nowrap min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-[#8b5cf6] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#7c3aed] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">devices</span>
                      <span>View Sessions</span>
                    </button>
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

export default PartnerSecurity;
