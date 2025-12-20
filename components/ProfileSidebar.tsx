import React from 'react';
import { getCurrentUser } from '../services/api';

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

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'dideet7oz');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dideet7oz/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        // Update avatar in API and localStorage
        const { api } = await import('../services/api');
        const updateResponse = await api.auth.updateProfile({ avatar: data.secure_url });
        if (updateResponse.data) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            localStorage.setItem('user', JSON.stringify({ ...userData, ...updateResponse.data }));
          }
          window.location.reload(); // Refresh to show new avatar
        }
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
                  <div className="w-4 h-4 border-2 border-[#0B1116] border-t-transparent rounded-full animate-spin"></div>
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
            <button 
              onClick={() => window.location.hash = '#/notifications'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left cursor-pointer transition-colors ${
                activePage === 'notifications'
                  ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/10'
                  : 'hover:bg-white/5 text-[#94a3b8] hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${activePage === 'notifications' ? 'fill' : ''}`}>notifications</span>
              <p className="text-sm font-medium leading-normal">Notifications</p>
            </button>
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
