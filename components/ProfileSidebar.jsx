import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { getCurrentUser, api } from '../services/api.js';
import Loader from './Loader.jsx';
import NotificationBell from './NotificationBell.jsx';
import { useNavigate } from 'react-router-dom';
const ProfileSidebar = ({ activePage }) => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
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
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Cloudinary upload failed');
            }
            const data = await response.json();
            if (data.secure_url) {
                // Update avatar in API and localStorage
                const { api } = await import('../services/api.js');
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
                }
                catch (apiError) {
                    // Even if API fails, Cloudinary upload succeeded
                    alert('Avatar uploaded but failed to save to profile. Please refresh the page.');
                }
            }
        }
        catch (error) {
            alert('Failed to upload avatar. Please check your Cloudinary settings and try again.');
        }
        finally {
            setUploadingAvatar(false);
        }
    };
    const handleLogout = () => {
        api.logout();
        navigate('/');
    };
    const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=10b981&color=fff`;
    return (_jsx("aside", { className: "w-full md:w-64 lg:w-72 flex-shrink-0", children: _jsxs("div", { className: "flex h-full flex-col justify-between bg-[#151F26] p-4 rounded-xl border border-white/5", children: [_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-center bg-no-repeat aspect-square bg-cover rounded-full size-14", style: { backgroundImage: `url("${avatarUrl}")` } }), _jsxs("label", { className: "absolute -bottom-1 -right-1 flex items-center justify-center size-7 bg-[#10b981] rounded-full text-[#0B1116] hover:bg-[#059669] cursor-pointer transition-colors shadow-lg", children: [uploadingAvatar ? (_jsx(Loader, { size: "sm", color: "#0B1116", className: "w-4 h-4" })) : (_jsx("span", { className: "material-symbols-outlined text-base", children: "photo_camera" })), _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleAvatarUpload, disabled: uploadingAvatar })] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h1", { className: "text-white text-base font-semibold leading-normal", children: user?.name || 'User' }), _jsx("p", { className: "text-[#94a3b8] text-sm font-normal leading-normal", children: user?.email || '' })] })] }), _jsxs("div", { className: "flex flex-col gap-1 pt-4", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: `flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left cursor-pointer transition-colors ${activePage === 'profile'
                                        ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/10'
                                        : 'hover:bg-white/5 text-[#94a3b8] hover:text-white'}`, children: [_jsx("span", { className: `material-symbols-outlined text-[20px] ${activePage === 'profile' ? 'fill' : ''}`, children: "person" }), _jsx("p", { className: "text-sm font-medium leading-normal", children: "Profile Information" })] }), _jsx("div", { className: "w-full", children: _jsx(NotificationBell, {}) }), _jsxs("button", { onClick: () => navigate('/security'), className: `flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left cursor-pointer transition-colors ${activePage === 'security'
                                        ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/10'
                                        : 'hover:bg-white/5 text-[#94a3b8] hover:text-white'}`, children: [_jsx("span", { className: `material-symbols-outlined text-[20px] ${activePage === 'security' ? 'fill' : ''}`, children: "lock" }), _jsx("p", { className: "text-sm font-medium leading-normal", children: "Security & Privacy" })] }), _jsxs("button", { onClick: () => navigate('/settings'), className: `flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left cursor-pointer transition-colors ${activePage === 'settings'
                                        ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/10'
                                        : 'hover:bg-white/5 text-[#94a3b8] hover:text-white'}`, children: [_jsx("span", { className: `material-symbols-outlined text-[20px] ${activePage === 'settings' ? 'fill' : ''}`, children: "settings" }), _jsx("p", { className: "text-sm font-medium leading-normal", children: "App Settings" })] })] })] }), _jsx("div", { className: "flex flex-col gap-4 mt-8 pt-4 border-t border-white/5", children: _jsx("button", { onClick: handleLogout, className: "flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0B1116] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors border border-white/5", children: _jsx("span", { className: "truncate", children: "Log Out" }) }) })] }) }));
};
export default ProfileSidebar;
