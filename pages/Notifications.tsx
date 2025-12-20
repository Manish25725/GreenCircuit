import React from 'react';
import Layout from '../components/Layout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSidebar from '../components/ProfileSidebar';
import NotificationPanel from '../components/NotificationPanel';

const Notifications = () => {
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