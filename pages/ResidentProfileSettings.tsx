import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getCurrentUser } from '../services/api';

const ResidentProfileSettings = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.hash = '#/login';
  };

  const settingsCards = [
    {
      id: 1,
      title: 'Edit Profile',
      description: 'Update your personal information and profile picture',
      icon: 'person',
      color: '#10b981',
      link: '#/resident/profile'
    },
    {
      id: 2,
      title: 'Notifications',
      description: 'Manage notification preferences and alerts',
      icon: 'notifications',
      color: '#10b981',
      link: '#/notifications'
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

  return (
    <Layout title="" role="User" fullWidth hideSidebar>
      <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen">
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
          <div className="fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
          <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
          
          <div className="layout-container flex h-full grow flex-col relative z-10">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>
                <div className="p-2 bg-[#10b981]/10 rounded-lg">
                  <svg className="h-6 w-6 text-[#10b981]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#10b981]">Resident</span></h2>
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
                  onClick={() => window.location.hash = '#/dashboard'}
                  className="flex items-center gap-2 text-[#10b981] hover:text-[#059669] transition-colors mb-6 group"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span className="text-sm font-medium">Back to Dashboard</span>
                </button>

                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="size-16 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center text-white font-bold text-2xl overflow-hidden shadow-lg">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">{user?.name || 'User'}</h1>
                      <p className="text-gray-400 text-sm mt-1">{user?.email || ''}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">Manage your profile, security, and preferences</p>
                </div>

                {/* Settings Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {settingsCards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => window.location.hash = card.link}
                      className="bg-[#151F26] hover:bg-[#1a2730] p-6 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          className="p-3 rounded-xl transition-all group-hover:scale-110"
                          style={{ backgroundColor: `${card.color}15` }}
                        >
                          <span 
                            className="material-symbols-outlined text-[28px]"
                            style={{ color: card.color }}
                          >
                            {card.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#10b981] transition-colors">
                            {card.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {card.description}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-gray-500 group-hover:text-[#10b981] transition-colors">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="bg-[#151F26] p-6 rounded-xl border border-white/5 mb-6">
                  <h3 className="text-white font-semibold text-lg mb-4">Your Impact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#0B1116] p-4 rounded-xl border border-[#10b981]/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#10b981]/10 rounded-lg">
                          <span className="material-symbols-outlined text-[#10b981]">stars</span>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Eco Points</p>
                          <p className="text-white text-2xl font-bold">{user?.ecoPoints || 0}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#0B1116] p-4 rounded-xl border border-[#10b981]/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#10b981]/10 rounded-lg">
                          <span className="material-symbols-outlined text-[#10b981]">recycling</span>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Waste Recycled</p>
                          <p className="text-white text-2xl font-bold">{user?.totalWasteRecycled || 0} kg</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#0B1116] p-4 rounded-xl border border-[#10b981]/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#10b981]/10 rounded-lg">
                          <span className="material-symbols-outlined text-[#10b981]">local_shipping</span>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Total Pickups</p>
                          <p className="text-white text-2xl font-bold">{user?.totalPickups || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Button */}
                <button
                  onClick={() => window.location.hash = '#/dashboard'}
                  className="w-full h-12 px-6 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-semibold transition-all shadow-lg shadow-[#10b981]/20 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">dashboard</span>
                  <span>Go to Dashboard</span>
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResidentProfileSettings;
