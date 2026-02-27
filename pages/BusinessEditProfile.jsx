import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { api, getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const BusinessEditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profilePicture: ''
    });
    const [previewImage, setPreviewImage] = useState('');
    useEffect(() => {
        loadUserProfile();
    }, []);
    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const currentUser = getCurrentUser();
            setUser(currentUser);
            setFormData({
                name: currentUser?.name || '',
                email: currentUser?.email || '',
                phone: currentUser?.phone || '',
                profilePicture: currentUser?.profilePicture || ''
            });
            setPreviewImage(currentUser?.profilePicture || '');
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
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setPreviewImage(result);
                setFormData({
                    ...formData,
                    profilePicture: result
                });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await api.updateProfile(formData);
            // Update local storage
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert('User profile updated successfully!');
        }
        catch (error) {
            alert('Failed to update user profile. Please try again.');
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
        return (_jsx(Layout, { title: "", role: "Business", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "flex items-center justify-center min-h-screen bg-[#0B1116]", children: _jsx(Loader, { size: "md", color: "#10b981" }) }) }));
    }
    return (_jsx(Layout, { title: "", role: "Business", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen", children: _jsxs("div", { className: "relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "layout-container flex h-full grow flex-col relative z-10", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/business'), children: [_jsx("div", { className: "p-2 bg-[#10b981]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#10b981]", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#10b981]", children: "Business" })] })] }), _jsx("div", { className: "flex items-center gap-4", children: _jsx("button", { onClick: handleLogout, className: "flex items-center justify-center size-10 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-red-400", children: "logout" }) }) })] }), _jsx("main", { className: "flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-10", children: _jsxs("div", { className: "layout-content-container flex flex-col w-full max-w-4xl", children: [_jsxs("button", { onClick: () => window.history.back(), className: "flex items-center gap-2 text-[#10b981] hover:text-[#059669] transition-colors mb-6 group", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "arrow_back" }), _jsx("span", { className: "text-sm font-medium", children: "Back to Settings" })] }), _jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "p-2 bg-[#10b981]/10 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-[#10b981] text-[28px]", children: "account_circle" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-white", children: "Edit User Profile" }), _jsx("p", { className: "text-slate-400 text-sm", children: "Update your personal account information" })] })] }) }), _jsx("form", { onSubmit: handleSubmit, className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex flex-col gap-1 mb-2", children: [_jsx("h3", { className: "text-white text-lg font-bold leading-tight", children: "Personal Information" }), _jsx("p", { className: "text-[#94a3b8] text-sm", children: "Update your account details and profile picture" })] }), _jsxs("div", { className: "flex flex-col items-center gap-4 p-6 bg-[#0B1116] rounded-xl border border-white/5", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "size-32 rounded-full bg-[#10b981] flex items-center justify-center ring-4 ring-white/10 text-white font-bold text-4xl overflow-hidden", style: previewImage ? { backgroundImage: `url(${previewImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}, children: !previewImage && (user?.name?.charAt(0) || 'U') }), _jsxs("label", { htmlFor: "profilePicture", className: "absolute bottom-0 right-0 size-10 rounded-full bg-[#10b981] border-4 border-[#0B1116] flex items-center justify-center cursor-pointer hover:bg-[#059669] transition-colors", children: [_jsx("span", { className: "material-symbols-outlined text-white text-[20px]", children: "photo_camera" }), _jsx("input", { type: "file", id: "profilePicture", accept: "image/*", onChange: handleImageChange, className: "hidden" })] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-white text-sm font-medium mb-1", children: "Profile Picture" }), _jsx("p", { className: "text-slate-400 text-xs", children: "Click the camera icon to upload a new photo" })] })] }), _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Full Name *" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", placeholder: "Enter your full name" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Email Address *" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", placeholder: "your@email.com" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Phone Number" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-all", placeholder: "+1 (555) 000-0000" })] })] })] }), _jsx("div", { className: "bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "material-symbols-outlined text-[#10b981] text-[20px] mt-0.5", children: "info" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-[#10b981] text-sm font-medium mb-1", children: "Account Information" }), _jsx("p", { className: "text-slate-400 text-xs leading-relaxed", children: "This is your personal user account information. To update business details like company name or address, please use the business profile section." })] })] }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-end pt-4", children: [_jsx("button", { type: "button", onClick: () => window.history.back(), className: "flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#0B1116] border border-white/5 text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: saving, className: "flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#10b981] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#059669] transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: saving ? 'Saving...' : 'Save Changes' })] })] }) })] }) })] })] }) }) }));
};
export default BusinessEditProfile;
