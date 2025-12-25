import React from 'react';
import { getCurrentUser, api } from '../services/api';
import Loader from './Loader';
import NotificationBell from './NotificationBell';

interface ProfileSidebarProps {
  activePage: 'profile' | 'notifications' | 'security' | 'settings';
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activePage }) => {
  const user = getCurrentUser();
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ecocycle_uploads');
      
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name not configured');
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const data = await response.json();
      
      if (data.secure_url) {
        // Update avatar in API and localStorage
        const { api } = await import('../services/api');
        try {
          const updatedUser = await api.updateProfile({ avatar: data.secure_url });
          
          // Update localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            localStorage.setItem('user', JSON.stringify({ ...userData, ...updatedUser }));
          }
          
          // Trigger event to update all components
          window.dispatchEvent(new Event('userUpdated'));
          window.dispatchEvent(new Event('storage'));
          
          // Success - reload to show new avatar
          window.location.reload();
        } catch (apiError) {
          // Even if API fails, Cloudinary upload succeeded
          alert('Avatar uploaded but failed to save to profile. Please refresh the page.');
        }
      }
    } catch (error) {
      alert('Failed to upload avatar. Please check your Cloudinary settings and try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    window.location.hash = '#/';
  };

  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff`;

  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
      <div className="flex h-full flex-col justify-between bg-[#151F26] p-4 rounded-xl border border-white/5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-14" 
                style={{ backgroundImage: `url("${avatarUrl}")` }}
              ></div>
              <label className="absolute -bottom-1 -right-1 flex items-center justify-center size-7 bg-[#10b981] rounded-full text-[#0B1116] hover:bg-[#059669] cursor-pointer transition-colors shadow-lg">
                {uploadingAvatar ? (
                  <Loader size="sm" color="#0B1116" className="w-4 h-4" />
                ) : (
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-semibold leading-normal">{user?.name || 'User'}</h1>
              <p className="text-[#94a3b8] text-sm font-normal leading-normal">{user?.email || ''}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 pt-4">
            <button 
              onClick={() => window.location.hash = '#/profile'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left cursor-pointer transition-colors ${
                activePage === 'profile'
                  ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/10'
                  : 'hover:bg-white/5 text-[#94a3b8] hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${activePage === 'profile' ? 'fill' : ''}`}>person</span>
              <p className="text-sm font-medium leading-normal">Profile Information</p>
            </button>
            <div className="w-full">
              <NotificationBell />
            </div>
            <button 
              onClick={() => window.location.hash = '#/security'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left cursor-pointer transition-colors ${
                activePage === 'security'
                  ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/10'
                  : 'hover:bg-white/5 text-[#94a3b8] hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${activePage === 'security' ? 'fill' : ''}`}>lock</span>
              <p className="text-sm font-medium leading-normal">Security & Privacy</p>
            </button>
            <button 
              onClick={() => window.location.hash = '#/settings'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left cursor-pointer transition-colors ${
                activePage === 'settings'
                  ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/10'
                  : 'hover:bg-white/5 text-[#94a3b8] hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${activePage === 'settings' ? 'fill' : ''}`}>settings</span>
              <p className="text-sm font-medium leading-normal">App Settings</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-8 pt-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0B1116] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors border border-white/10"
          >
            <span className="truncate">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
