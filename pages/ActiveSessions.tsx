import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser, User } from '../services/api';

interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

const ActiveSessions = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      device: 'Windows PC - Chrome',
      location: 'New York, USA',
      ip: '192.168.1.1',
      lastActive: 'Active now',
      current: true
    },
    {
      id: '2',
      device: 'iPhone 14 Pro - Safari',
      location: 'New York, USA',
      ip: '192.168.1.45',
      lastActive: '2 hours ago',
      current: false
    },
    {
      id: '3',
      device: 'MacBook Pro - Chrome',
      location: 'San Francisco, USA',
      ip: '10.0.0.123',
      lastActive: '1 day ago',
      current: false
    }
  ]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.hash = '#/login';
  };

  const handleLogoutSession = (sessionId: string) => {
    if (confirm('Are you sure you want to log out this session?')) {
      console.log('Logging out session:', sessionId);
      // Implement logout logic here
    }
  };

  const handleLogoutAll = () => {
    if (confirm('Are you sure you want to log out all other sessions? You will remain logged in on this device.')) {
      console.log('Logging out all other sessions');
      // Implement logout all logic here
    }
  };

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
              <div className="layout-content-container flex flex-col w-full max-w-5xl">
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#06b6d4]/10 rounded-lg">
                        <span className="material-symbols-outlined text-[#06b6d4] text-[28px]">devices</span>
                      </div>
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Active Sessions</h1>
                        <p className="text-slate-400 text-sm">View and manage your active login sessions</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogoutAll}
                      className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-colors font-medium"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span className="text-sm">Logout All Others</span>
                    </button>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#06b6d4] text-[20px] mt-0.5">info</span>
                    <div className="flex-1">
                      <p className="text-[#06b6d4] text-sm font-medium mb-1">Session Security</p>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        These are the devices currently logged into your account. If you see any suspicious activity, log out the session and change your password immediately.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sessions List */}
                <div className="flex flex-col gap-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-[#151F26] border border-white/5 rounded-xl p-6 hover:border-[#06b6d4]/30 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-[#06b6d4]/10 rounded-lg">
                            <span className="material-symbols-outlined text-[#06b6d4] text-[24px]">
                              {session.device.includes('iPhone') || session.device.includes('Android') ? 'smartphone' : 'computer'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-bold">{session.device}</h3>
                              {session.current && (
                                <span className="px-2 py-0.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded text-[#10b981] text-xs font-medium">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-slate-400">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                <span>{session.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">router</span>
                                <span>{session.ip}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                <span>{session.lastActive}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <button
                            onClick={() => handleLogoutSession(session.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-colors font-medium whitespace-nowrap"
                          >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            <span className="text-sm">Log Out</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Logout All Button */}
                <button
                  onClick={handleLogoutAll}
                  className="flex sm:hidden items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 transition-colors font-medium mt-6 w-full"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  <span>Logout All Other Sessions</span>
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActiveSessions;
