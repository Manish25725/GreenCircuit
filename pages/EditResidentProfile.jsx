import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import RolePageShell from '../components/RolePageShell.jsx';
import BackButton from '../components/BackButton.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Loader from '../components/Loader.jsx';
import { api, getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const EditResidentProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        sustainabilityGoals: ''
    });
    const [avatarPreview, setAvatarPreview] = useState('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        loadUserProfile();
    }, []);
    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const currentUser = getCurrentUser();
            if (currentUser) {
                setProfile(currentUser);
                // Handle address - can be string or object
                let addressStr = '';
                let city = '';
                let state = '';
                let zipCode = '';
                let country = 'India';
                if (currentUser.address) {
                    if (typeof currentUser.address === 'string') {
                        addressStr = currentUser.address;
                    }
                    else if (typeof currentUser.address === 'object') {
                        addressStr = currentUser.address.street || '';
                        city = currentUser.address.city || '';
                        state = currentUser.address.state || '';
                        zipCode = currentUser.address.zipCode || '';
                        country = currentUser.address.country || 'India';
                    }
                }
                setFormData({
                    name: currentUser.name || '',
                    email: currentUser.email || '',
                    phone: currentUser.phone || '',
                    address: addressStr,
                    city: city,
                    state: state,
                    zipCode: zipCode,
                    country: country,
                    sustainabilityGoals: currentUser.sustainabilityGoals || ''
                });
                setAvatarPreview(currentUser.avatar || '');
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrorMessage('Please select an image file');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('Image size should be less than 5MB');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }
        try {
            setUploadingAvatar(true);
            // Store the old avatar URL before uploading new one
            const oldAvatar = profile?.avatar || avatarPreview;
            // Preview the image locally first
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
            // Upload to Cloudinary
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
                // Update the avatar preview with Cloudinary URL
                setAvatarPreview(data.secure_url);
                // Immediately save the avatar to profile
                // The backend will automatically delete the old avatar if it exists
                try {
                    const updatedUser = await api.updateProfile({ avatar: data.secure_url });
                    setProfile({ ...profile, avatar: data.secure_url });
                    // Update localStorage
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        const newUserData = { ...userData, ...updatedUser };
                        localStorage.setItem('user', JSON.stringify(newUserData));
                    }
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                }
                catch (apiError) {
                    setErrorMessage('Avatar uploaded but failed to save to profile. Please try saving your profile.');
                    setTimeout(() => setErrorMessage(''), 5000);
                }
            }
        }
        catch (error) {
            setErrorMessage('Failed to upload avatar. Please try again.');
            setTimeout(() => setErrorMessage(''), 5000);
        }
        finally {
            setUploadingAvatar(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            setSaving(true);
            const updateData = { ...formData };
            // Avatar is already uploaded via Cloudinary in handleAvatarChange
            // No need to include it here as it's saved immediately on upload
            const response = await api.updateProfile(updateData);
            // Update localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                const updatedUser = { ...userData, ...response };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            // Show success notification
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            // Reload profile data
            await loadUserProfile();
        }
        catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Failed to update profile. Please try again.';
            setErrorMessage(message);
            setTimeout(() => setErrorMessage(''), 5000);
        }
        finally {
            setSaving(false);
        }
    };
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };
    if (loading) {
        return (_jsx(RolePageShell, { role: "resident", children: _jsx("div", { className: "flex items-center justify-center py-32", children: _jsx(Loader, { size: "md", color: "#10b981" }) }) }));
    }
    return (_jsxs(RolePageShell, { role: "resident", children: [showSuccess && (_jsx("div", { className: "fixed top-4 right-4 z-50 animate-slide-in-right", children: _jsxs("div", { className: "bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm", children: [_jsx("span", { className: "material-symbols-outlined text-green-400", children: "check_circle" }), _jsx("span", { className: "text-green-400 font-medium", children: "Profile updated successfully!" })] }) })), errorMessage && (_jsx("div", { className: "fixed top-4 right-4 z-50 animate-slide-in-right", children: _jsxs("div", { className: "bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm max-w-md", children: [_jsx("span", { className: "material-symbols-outlined text-red-400", children: "error" }), _jsx("span", { className: "text-red-400 font-medium", children: errorMessage })] }) })), _jsx(BackButton, { label: "Back to Settings", color: "#10b981", hoverColor: "#059669" }), _jsx(PageHeader, { icon: "person", iconColor: "#10b981", title: "Edit Profile", subtitle: "Update your personal information and preferences" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[#10b981]", children: "account_circle" }), _jsx("h3", { className: "text-white text-lg font-bold", children: "Profile Picture" })] }), _jsxs("div", { className: "flex flex-col items-center gap-6 p-6 bg-[#0B1116] rounded-xl border border-white/5", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "size-40 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center ring-4 ring-[#10b981]/20 text-white font-bold text-5xl overflow-hidden shadow-lg shadow-[#10b981]/20 transition-all group-hover:ring-[#10b981]/40", style: avatarPreview ? { backgroundImage: `url(${avatarPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}, children: !avatarPreview && (formData.name?.charAt(0)?.toUpperCase() || 'U') }), _jsxs("label", { htmlFor: "avatar", className: "absolute bottom-2 right-2 size-12 rounded-xl bg-[#10b981] border-4 border-[#0B1116] flex items-center justify-center cursor-pointer hover:bg-[#059669] transition-all shadow-lg hover:scale-110 group", children: [uploadingAvatar ? (_jsx(Loader, { size: "sm", color: "white" })) : (_jsx("span", { className: "material-symbols-outlined text-white text-[24px]", children: "photo_camera" })), _jsx("input", { type: "file", id: "avatar", accept: "image/*", onChange: handleAvatarChange, className: "hidden", disabled: uploadingAvatar })] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-white text-sm font-medium mb-1", children: "Upload Profile Picture" }), _jsx("p", { className: "text-slate-400 text-xs", children: uploadingAvatar ? 'Uploading to cloud...' : 'Click the camera icon • Square image • Min 256x256px' }), _jsxs("div", { className: "flex items-center justify-center gap-2 mt-3", children: [_jsx("span", { className: "px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full text-[#10b981] text-xs font-medium", children: "JPG" }), _jsx("span", { className: "px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full text-[#10b981] text-xs font-medium", children: "PNG" }), _jsx("span", { className: "px-3 py-1 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full text-[#10b981] text-xs font-medium", children: "SVG" })] })] })] })] }) }), _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "text-white text-lg font-bold", children: "Personal Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Full Name *" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", placeholder: "Enter your full name" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Email *" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", placeholder: "your@email.com" })] })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Phone Number" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", placeholder: "+1 (555) 123-4567" })] })] }) }), _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[#10b981]", children: "location_on" }), _jsx("h3", { className: "text-white text-lg font-bold", children: "Address Information" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Street Address" }), _jsx("input", { type: "text", name: "address", value: formData.address, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", placeholder: "123 Main Street, Apt 4B" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "City" }), _jsx("input", { type: "text", name: "city", value: formData.city, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", placeholder: "San Francisco" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "State/Province" }), _jsx("input", { type: "text", name: "state", value: formData.state, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", placeholder: "California" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "ZIP/Postal Code" }), _jsx("input", { type: "text", name: "zipCode", value: formData.zipCode, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", placeholder: "94102" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Country" }), _jsxs("select", { name: "country", value: formData.country, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", children: [_jsx("option", { value: "India", children: "India" }), _jsx("option", { value: "USA", children: "United States" }), _jsx("option", { value: "UK", children: "United Kingdom" }), _jsx("option", { value: "Canada", children: "Canada" }), _jsx("option", { value: "Australia", children: "Australia" }), _jsx("option", { value: "Germany", children: "Germany" }), _jsx("option", { value: "France", children: "France" }), _jsx("option", { value: "Japan", children: "Japan" }), _jsx("option", { value: "Other", children: "Other" })] })] })] })] }) }), _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[#10b981]", children: "eco" }), _jsx("h3", { className: "text-white text-lg font-bold", children: "Sustainability Goals" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Your Environmental Goals" }), _jsx("textarea", { name: "sustainabilityGoals", value: formData.sustainabilityGoals, onChange: handleInputChange, rows: 4, className: "w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all resize-none", placeholder: "Share your personal sustainability goals and how you're working towards reducing e-waste..." })] })] }) }), profile && (_jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[#10b981]", children: "bar_chart" }), _jsx("h3", { className: "text-white text-lg font-bold", children: "Your Impact" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx("div", { className: "bg-[#0B1116] p-4 rounded-xl border border-[#10b981]/20", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-[#10b981]/10 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-[#10b981]", children: "stars" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-xs", children: "Eco Points" }), _jsx("p", { className: "text-white text-xl font-bold", children: profile.ecoPoints || 0 })] })] }) }), _jsx("div", { className: "bg-[#0B1116] p-4 rounded-xl border border-[#10b981]/20", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-[#10b981]/10 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-[#10b981]", children: "recycling" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-xs", children: "Waste Recycled" }), _jsxs("p", { className: "text-white text-xl font-bold", children: [profile.totalWasteRecycled || 0, " kg"] })] })] }) }), _jsx("div", { className: "bg-[#0B1116] p-4 rounded-xl border border-[#10b981]/20", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-[#10b981]/10 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-[#10b981]", children: "local_shipping" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-xs", children: "Total Pickups" }), _jsx("p", { className: "text-white text-xl font-bold", children: profile.totalPickups || 0 })] })] }) })] })] }) })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 pt-4", children: [_jsx("button", { type: "submit", disabled: saving, className: "flex-1 h-12 px-6 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#10b981]/20", children: saving ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), _jsx("span", { children: "Saving..." })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined", children: "save" }), _jsx("span", { children: "Save Changes" })] })) }), _jsx("button", { type: "button", onClick: () => window.history.back(), className: "h-12 px-6 rounded-xl bg-white/5 hover:bg-white/5 text-white font-semibold transition-all border border-white/5", children: "Cancel" })] })] })] }));
};
export default EditResidentProfile;
