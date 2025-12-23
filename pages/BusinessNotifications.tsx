import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import NotificationPanel from '../components/NotificationPanel';
import { getCurrentUser, User } from '../services/api';

const BusinessNotifications = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.hash = '#/login';
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
                      <span className="material-symbols-outlined text-[#06b6d4] text-[28px]">notifications</span>
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">Notifications</h1>
                      <p className="text-gray-400 text-sm">Manage your notification preferences and alerts</p>
                    </div>
                  </div>
                </div>

                <NotificationPanel />
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessNotifications;
