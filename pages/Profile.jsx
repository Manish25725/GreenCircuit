import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import NotificationBell from '../components/NotificationBell.jsx';
import { api, getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        avatar: ''
    });
    // Helper to get address as string
    const getAddressString = (address) => {
        if (!address)
            return '';
        if (typeof address === 'string')
            return address;
        if (typeof address === 'object') {
            const { street, city, state, zipCode } = address;
            return [street, city, state, zipCode].filter(Boolean).join(', ');
        }
        return '';
    };
    useEffect(() => {
        loadUserProfile();
    }, []);
    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const currentUser = getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                setFormData({
                    name: currentUser.name || '',
                    phone: currentUser.phone || '',
                    address: getAddressString(currentUser.address),
                    avatar: currentUser.avatar || ''
                });
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }
        try {
            setUploadingAvatar(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ecocycle_uploads');
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
                // Update avatar in the form
                setFormData(prev => ({ ...prev, avatar: data.secure_url }));
                // Immediately save the avatar
                try {
                    const updatedUser = await api.updateProfile({ avatar: data.secure_url });
                    setUser(updatedUser);
                    // Update localStorage
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        localStorage.setItem('user', JSON.stringify({ ...userData, ...updatedUser }));
                    }
                    // Trigger event to update all components
                    window.dispatchEvent(new Event('userUpdated'));
                    window.dispatchEvent(new Event('storage'));
                    // Show success message
                    alert('Avatar updated successfully!');
                }
                catch (apiError) {
                    // Even if API fails, Cloudinary upload succeeded
                    alert('Avatar uploaded but failed to save to profile. Please try saving your profile.');
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
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await api.auth.updateProfile(formData);
            if (response.data) {
                setUser(response.data);
                // Update localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    localStorage.setItem('user', JSON.stringify({ ...userData, ...response.data }));
                }
                alert('Profile updated successfully!');
            }
        }
        catch (error) {
            alert('Failed to update profile');
        }
        finally {
            setSaving(false);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };
    if (loading) {
        return (_jsx(Layout, { title: "", role: "User", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "bg-[#0B1116] min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader, { size: "md", color: "#10b981", className: "mb-4" }), _jsx("p", { className: "text-slate-400", children: "Loading profile..." })] }) }) }));
    }
    return (_jsx(Layout, { title: "", role: "User", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen flex flex-col relative overflow-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#10b981]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#10b981]", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#10b981] font-semibold", children: "Resident" })] })] }), _jsxs("nav", { className: "hidden md:flex flex-1 justify-center gap-1", children: [_jsx("a", { className: "text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer", onClick: () => navigate('/dashboard'), children: "Dashboard" }), _jsx("a", { className: "text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer", onClick: () => navigate('/search'), children: "New Request" }), _jsx("a", { className: "text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer", onClick: () => navigate('/rewards'), children: "Rewards" }), _jsx("a", { className: "text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer", onClick: () => navigate('/certificate'), children: "Certificate" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#10b981]/50 transition-all", style: { backgroundImage: `url("${formData.avatar || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")` } }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.name || 'User' })] }), _jsxs("button", { className: "relative p-2.5 rounded-full bg-[#151F26] border border-white/5 text-[#3b82f6] hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 transition-colors", children: [_jsx("span", { className: "absolute top-2.5 right-3 size-2 bg-red-500 rounded-full border-2 border-[#151F26]" }), _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "notifications" })] })] })] }), _jsx("main", { className: "flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 mt-20 relative z-10", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsx("aside", { className: "w-full md:w-64 lg:w-72 flex-shrink-0", children: _jsxs("div", { className: "flex h-full flex-col justify-between bg-[#151F26] p-4 rounded-xl border border-white/5", children: [_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-center bg-no-repeat aspect-square bg-cover rounded-full size-14", style: { backgroundImage: `url("${formData.avatar || user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")` } }), _jsxs("label", { className: "absolute -bottom-1 -right-1 flex items-center justify-center size-7 bg-[#10b981] rounded-full text-[#0B1116] hover:bg-[#059669] cursor-pointer transition-colors shadow-lg", children: [uploadingAvatar ? (_jsx(Loader, { size: "sm", color: "#0B1116" })) : (_jsx("span", { className: "material-symbols-outlined text-base", children: "photo_camera" })), _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleAvatarUpload, disabled: uploadingAvatar })] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h1", { className: "text-white text-base font-semibold leading-normal", children: user?.name || 'User' }), _jsx("p", { className: "text-[#94a3b8] text-sm font-normal leading-normal", children: user?.email || '' })] })] }), _jsxs("div", { className: "flex flex-col gap-1 pt-4", children: [_jsxs("button", { className: "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/10 w-full text-left cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined fill text-[20px]", children: "person" }), _jsx("p", { className: "text-sm font-medium leading-normal", children: "Profile Information" })] }), _jsx("div", { className: "w-full", children: _jsx(NotificationBell, {}) }), _jsxs("button", { onClick: () => navigate('/resident/security'), className: "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-[#94a3b8] hover:text-white transition-colors w-full text-left cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "lock" }), _jsx("p", { className: "text-sm font-medium leading-normal", children: "Security & Privacy" })] }), _jsxs("button", { onClick: () => navigate('/settings'), className: "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-[#94a3b8] hover:text-white transition-colors w-full text-left cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "settings" }), _jsx("p", { className: "text-sm font-medium leading-normal", children: "App Settings" })] })] })] }), _jsx("div", { className: "flex flex-col gap-4 mt-8 pt-4 border-t border-white/5", children: _jsx("button", { onClick: handleLogout, className: "flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0B1116] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors border border-white/5", children: _jsx("span", { className: "truncate", children: "Log Out" }) }) })] }) }), _jsx("div", { className: "flex-1", children: _jsx("div", { className: "flex flex-col gap-8", children: _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-8", children: [_jsx("div", { className: "flex flex-wrap justify-between gap-3", children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("p", { className: "text-white text-2xl font-bold leading-tight tracking-[-0.033em]", children: "Profile Information" }), _jsx("p", { className: "text-[#94a3b8] text-base font-normal leading-normal", children: "Manage your personal details and contact information." })] }) }), _jsxs("form", { className: "flex flex-col gap-6", onSubmit: handleSave, children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Full Name" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Email Address" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#94a3b8] focus:outline-none border border-white/5 bg-[#0B1116]/50 h-12 p-3 text-base font-normal leading-normal cursor-not-allowed", readOnly: true, value: user?.email || '' })] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Phone Number" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), placeholder: "+1 (555) 123-4567" })] }) }), _jsx("div", { children: _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Primary Address" }), _jsx("textarea", { className: "w-full resize-y rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] border border-white/5 bg-[#0B1116] placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", rows: 3, value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }), placeholder: "Enter your address" })] }) }), _jsxs("div", { className: "flex justify-end gap-4 pt-4 border-t border-white/5", children: [_jsx("button", { className: "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0B1116] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors border border-white/5", type: "button", onClick: () => navigate('/dashboard'), children: _jsx("span", { className: "truncate", children: "Cancel" }) }), _jsx("button", { className: "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#10b981] text-[#0B1116] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#059669] transition-colors disabled:opacity-50", type: "submit", disabled: saving, children: _jsx("span", { className: "truncate", children: saving ? 'Saving...' : 'Save Changes' }) })] })] })] }) }) }) })] }) })] }) }));
};
export default Profile;
