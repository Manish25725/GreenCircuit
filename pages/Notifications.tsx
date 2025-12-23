import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSidebar from '../components/ProfileSidebar';
import NotificationPanel from '../components/NotificationPanel';
import { getCurrentUser, User } from '../services/api';

const Notifications = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Agency Layout
  if (user?.role === 'agency') {
    return (
      <Layout title="" role="Agency" fullWidth hideSidebar>
        <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#f59e0b] selection:text-white min-h-screen">
          <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <div className="fixed top-0 left-0 w-full h-[500px] bg-[#f59e0b]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
            
            <div className="layout-container flex h-full grow flex-col relative z-10">
              {/* Agency Header */}
              <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md">
                <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/agency'}>
                  <div className="p-2 bg-[#f59e0b]/10 rounded-lg">
                    <svg className="h-6 w-6 text-[#f59e0b]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#f59e0b]">Partner</span></h2>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => window.location.hash = '#/agency/profile'}
                    className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <div className="size-8 rounded-full bg-[#f59e0b] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#f59e0b]/50 transition-all text-white font-bold text-sm">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                    <span className="text-sm font-medium text-gray-200">{user?.name || 'Agency'}</span>
                  </button>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-10">
                <div className="layout-content-container flex flex-col w-full max-w-5xl">
                  {/* Back Button */}
                  <button 
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-[#f59e0b] hover:text-[#d97706] transition-colors mb-6 group"
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    <span className="text-sm font-medium">Back</span>
                  </button>
                  <NotificationPanel />
                </div>
              </main>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Business Layout
  if (user?.role === 'business') {
    return (
      <Layout title="" role="Business" fullWidth hideSidebar>
        <div className="bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#60A5FA] selection:text-white min-h-screen">
          <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <div className="fixed top-0 left-0 w-full h-[500px] bg-[#60A5FA]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
            
            <div className="layout-container flex h-full grow flex-col relative z-10">
              {/* Business Header */}
              <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md">
                <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/business-dashboard'}>
                  <div className="p-2 bg-[#60A5FA]/10 rounded-lg">
                    <svg className="h-6 w-6 text-[#60A5FA]" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle <span className="text-[#60A5FA]">Business</span></h2>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => window.location.hash = '#/profile'}
                    className="hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <div className="size-8 rounded-full bg-[#60A5FA] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#60A5FA]/50 transition-all text-white font-bold text-sm">
                      {user?.name?.charAt(0) || 'B'}
                    </div>
                    <span className="text-sm font-medium text-gray-200">{user?.name || 'Business'}</span>
                  </button>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-10">
                <div className="layout-content-container flex flex-col w-full max-w-5xl">
                  {/* Back Button */}
                  <button 
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-[#3b82f6] hover:text-[#2563eb] transition-colors mb-6 group"
                  >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    <span className="text-sm font-medium">Back</span>
                  </button>
                  <NotificationPanel />
                </div>
              </main>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Default User/Resident Layout
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
            <ProfileSidebar activePage="notifications" />
            <div className="flex-1">
              <NotificationPanel />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Notifications;