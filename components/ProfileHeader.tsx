import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';
import NotificationBell from './NotificationBell';

const ProfileHeader: React.FC = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [avatarKey, setAvatarKey] = useState(Date.now());
  
  // Add cache busting to avatar URL
  const avatarUrl = user?.avatar 
    ? `${user.avatar}?t=${avatarKey}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff`;
  
  useEffect(() => {
    // Listen for user updates
    const handleUserUpdate = () => {
      setUser(getCurrentUser());
      setAvatarKey(Date.now()); // Force refresh avatar
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => window.location.hash = '#/'}>
        <div className="p-2 bg-[#10b981]/10 rounded-lg">
          <svg className="h-6 w-6 text-[#10b981]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">EcoCycle</h2>
      </div>
      <nav className="hidden md:flex flex-1 justify-center gap-1">
        <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>Dashboard</a>
        <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/search'}>New Request</a>
        <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/rewards'}>Rewards</a>
        <a className="text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer" onClick={() => window.location.hash = '#/certificate'}>Certificate</a>
      </nav>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => window.location.hash = '#/profile'}
          className="hidden sm:flex h-10 px-5 items-center justify-center gap-2 rounded-full bg-white/5 text-white hover:bg-white/10 border border-white/10 text-sm font-bold transition-all duration-300 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
          Profile
        </button>
        <NotificationBell />
      </div>
    </header>
  );
};

export default ProfileHeader;
