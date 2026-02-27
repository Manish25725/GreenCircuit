import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import NotificationBell from '../components/NotificationBell.jsx';
import { getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const BusinessProfile = () => {
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        logo: '',
        industry: 'Technology',
        email: '',
        phone: '',
        website: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: 'India',
            zipCode: ''
        },
        contactPerson: {
            name: '',
            role: '',
            email: '',
            phone: ''
        },
        monthlyTarget: 200
    });
    useEffect(() => {
        loadBusinessProfile();
    }, []);
    const loadBusinessProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/business/profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const result = await response.json();
                const data = result.data || result; // Handle both wrapped and unwrapped responses
                setBusiness(data);
                setFormData({
                    companyName: data.companyName || '',
                    description: data.description || '',
                    logo: data.logo || '',
                    industry: data.industry || 'Technology',
                    email: data.email || '',
                    phone: data.phone || '',
                    website: data.website || '',
                    address: {
                        street: data.address?.street || '',
                        city: data.address?.city || '',
                        state: data.address?.state || '',
                        country: data.address?.country || 'India',
                        zipCode: data.address?.zipCode || ''
                    },
                    contactPerson: {
                        name: data.contactPerson?.name || '',
                        role: data.contactPerson?.role || '',
                        email: data.contactPerson?.email || '',
                        phone: data.contactPerson?.phone || ''
                    },
                    monthlyTarget: data.monthlyTarget || 200
                });
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }
        try {
            setUploadingLogo(true);
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('upload_preset', 'ecocycle_uploads');
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            if (!cloudName) {
                throw new Error('Cloudinary cloud name not configured');
            }
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: uploadFormData
            });
            if (!response.ok) {
                throw new Error('Cloudinary upload failed');
            }
            const data = await response.json();
            if (data.secure_url) {
                setFormData(prev => ({ ...prev, logo: data.secure_url }));
                try {
                    const updateResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/business/profile`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ logo: data.secure_url })
                    });
                    if (updateResponse.ok) {
                        const result = await updateResponse.json();
                        const updated = result.data || result;
                        setBusiness(updated);
                        // Trigger userUpdated event to refresh other components
                        window.dispatchEvent(new Event('userUpdated'));
                        alert('Logo updated successfully!');
                    }
                }
                catch (apiError) {
                    alert('Logo uploaded but failed to save to profile. Please try saving your profile.');
                }
            }
        }
        catch (error) {
            alert('Failed to upload logo. Please check your Cloudinary settings and try again.');
        }
        finally {
            setUploadingLogo(false);
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/business/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const result = await response.json();
                const updated = result.data || result;
                setBusiness(updated);
                alert('Profile updated successfully!');
            }
            else {
                throw new Error('Failed to update profile');
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
    const industryOptions = ['Technology', 'Healthcare', 'Manufacturing', 'Finance', 'Retail', 'Education', 'Government', 'Other'];
    if (loading) {
        return (_jsx(Layout, { title: "", role: "Business", fullWidth: true, hideSidebar: true, children: _jsx("div", { className: "bg-[#0B1116] min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader, { size: "md", color: "#3b82f6", className: "mb-4" }), _jsx("p", { className: "text-slate-400", children: "Loading profile..." })] }) }) }));
    }
    const user = getCurrentUser();
    return (_jsx(Layout, { title: "", role: "Business", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#3b82f6] selection:text-white min-h-screen flex flex-col relative overflow-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#3b82f6]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#3b82f6]", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsx("h2", { className: "text-xl font-bold tracking-tight text-white", children: "EcoCycle" })] }), _jsx("nav", { className: "hidden md:flex flex-1 justify-center gap-1", children: _jsx("a", { className: "text-sm font-medium px-5 py-2.5 rounded-full text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer", onClick: () => navigate('/business'), children: "Dashboard" }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#3b82f6]/50 transition-all", style: { backgroundImage: `url("${formData.logo || business?.logo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(business?.companyName || 'Business') + '&background=10b981&color=fff'}")` } }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: business?.companyName || user?.name || 'Business' })] }), _jsx(NotificationBell, {})] })] }), _jsx("main", { className: "flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 mt-20 relative z-10", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsx("aside", { className: "w-full md:w-64 lg:w-72 flex-shrink-0", children: _jsxs("div", { className: "flex h-full flex-col justify-between bg-[#151F26] p-4 rounded-xl border border-white/5", children: [_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "bg-center bg-no-repeat aspect-square bg-cover rounded-full size-14", style: { backgroundImage: `url("${formData.logo || business?.logo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(business?.companyName || 'Business') + '&background=10b981&color=fff'}")` } }), _jsxs("label", { className: "absolute -bottom-1 -right-1 flex items-center justify-center size-7 bg-[#3b82f6] rounded-full text-[#0B1116] hover:bg-[#2563eb] cursor-pointer transition-colors shadow-lg", children: [uploadingLogo ? (_jsx(Loader, { size: "sm", color: "#0B1116" })) : (_jsx("span", { className: "material-symbols-outlined text-base", children: "photo_camera" })), _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleLogoUpload, disabled: uploadingLogo })] })] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h1", { className: "text-white text-base font-semibold leading-normal", children: business?.companyName || 'Business' }), _jsx("p", { className: "text-[#94a3b8] text-sm font-normal leading-normal", children: business?.industry || 'Technology' }), _jsx("div", { className: "flex items-center gap-2 mt-1.5", children: business?.isVerified ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined text-[#3b82f6] text-sm", children: "verified" }), _jsx("span", { className: "text-[#3b82f6] text-xs font-semibold", children: "Verified" })] })) : (_jsx("span", { className: "text-amber-400 text-xs", children: "Pending Verification" })) })] })] }), _jsxs("div", { className: "flex flex-col gap-1 pt-4", children: [_jsxs("button", { className: "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/10 w-full text-left cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined fill text-[20px]", children: "business" }), _jsx("p", { className: "text-sm font-medium leading-normal", children: "Business Profile" })] }), _jsxs("button", { onClick: () => navigate('/business/notifications'), className: "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-[#94a3b8] hover:text-white transition-colors w-full text-left cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "notifications" }), _jsx("p", { className: "text-sm font-medium leading-normal", children: "Notifications" })] }), _jsxs("button", { onClick: () => navigate('/security'), className: "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-[#94a3b8] hover:text-white transition-colors w-full text-left cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "lock" }), _jsx("p", { className: "text-sm font-medium leading-normal", children: "Security & Privacy" })] }), _jsxs("button", { onClick: () => navigate('/settings'), className: "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-[#94a3b8] hover:text-white transition-colors w-full text-left cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "settings" }), _jsx("p", { className: "text-sm font-medium leading-normal", children: "App Settings" })] })] })] }), _jsx("div", { className: "flex flex-col gap-4 mt-8 pt-4 border-t border-white/5", children: _jsx("button", { onClick: handleLogout, className: "flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0B1116] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors border border-white/5", children: _jsx("span", { className: "truncate", children: "Log Out" }) }) })] }) }), _jsx("div", { className: "flex-1", children: _jsx("div", { className: "flex flex-col gap-8", children: _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-8", children: [_jsxs("div", { className: "flex flex-wrap justify-between gap-3 items-center", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "material-symbols-outlined text-[#3b82f6] text-[32px]", children: "business" }), _jsx("p", { className: "text-white text-2xl font-bold leading-tight tracking-[-0.033em]", children: "Business Profile" })] }), _jsx("p", { className: "text-[#94a3b8] text-base font-normal leading-normal", children: "Manage your company information, contacts, and sustainability goals." })] }), business?.isVerified && (_jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-lg", children: [_jsx("span", { className: "material-symbols-outlined text-[#3b82f6] text-[20px]", children: "verified" }), _jsx("span", { className: "text-[#3b82f6] font-semibold", children: "Verified Business" })] }))] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/5 p-4 rounded-lg border border-[#3b82f6]/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "material-symbols-outlined text-[#3b82f6] text-[20px]", children: "inventory_2" }), _jsx("p", { className: "text-[#3b82f6] text-xs font-semibold uppercase tracking-wider", children: "Total Waste" })] }), _jsx("p", { className: "text-white text-3xl font-bold", children: business?.totalWasteProcessed || 0 }), _jsx("p", { className: "text-[#94a3b8] text-xs mt-1", children: "kilograms processed" })] }), _jsxs("div", { className: "bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-4 rounded-lg border border-blue-500/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "material-symbols-outlined text-blue-400 text-[20px]", children: "eco" }), _jsx("p", { className: "text-blue-400 text-xs font-semibold uppercase tracking-wider", children: "CO\u2082 Impact" })] }), _jsx("p", { className: "text-white text-3xl font-bold", children: business?.co2Saved || 0 }), _jsx("p", { className: "text-[#94a3b8] text-xs mt-1", children: "kg carbon offset" })] }), _jsxs("div", { className: "bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-4 rounded-lg border border-purple-500/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "material-symbols-outlined text-purple-400 text-[20px]", children: "verified" }), _jsx("p", { className: "text-purple-400 text-xs font-semibold uppercase tracking-wider", children: "Compliance" })] }), _jsxs("p", { className: "text-white text-3xl font-bold", children: [business?.complianceScore || 100, "%"] }), _jsx("p", { className: "text-[#94a3b8] text-xs mt-1", children: "environmental score" })] }), _jsxs("div", { className: "bg-gradient-to-br from-amber-500/20 to-amber-500/5 p-4 rounded-lg border border-amber-500/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "material-symbols-outlined text-amber-400 text-[20px]", children: "workspace_premium" }), _jsx("p", { className: "text-amber-400 text-xs font-semibold uppercase tracking-wider", children: "Subscription" })] }), _jsx("p", { className: "text-white text-2xl font-bold capitalize", children: business?.plan || 'Starter' }), _jsx("p", { className: "text-[#94a3b8] text-xs mt-1", children: "current plan" })] })] }), _jsxs("form", { className: "flex flex-col gap-8", onSubmit: handleSave, children: [_jsxs("div", { className: "flex flex-col gap-4 pb-6 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[#3b82f6] text-[24px]", children: "domain" }), _jsx("h3", { className: "text-white text-lg font-semibold", children: "Company Information" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Company Name *" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.companyName, onChange: (e) => setFormData({ ...formData, companyName: e.target.value }), required: true })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Industry *" }), _jsx("select", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 px-3 text-base font-normal leading-normal transition-all", value: formData.industry, onChange: (e) => setFormData({ ...formData, industry: e.target.value }), required: true, children: industryOptions.map(ind => (_jsx("option", { value: ind, children: ind }, ind))) })] })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Company Description" }), _jsx("textarea", { className: "w-full resize-y rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", rows: 3, value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Tell us about your company" })] })] }), _jsxs("div", { className: "flex flex-col gap-4 pb-6 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-blue-400 text-[24px]", children: "contact_phone" }), _jsx("h3", { className: "text-white text-lg font-semibold", children: "Contact Details" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Business Email *" }), _jsx("input", { type: "email", className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), required: true })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Phone Number" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), placeholder: "+1 (555) 123-4567" })] })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Website" }), _jsx("input", { type: "url", className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.website, onChange: (e) => setFormData({ ...formData, website: e.target.value }), placeholder: "https://www.example.com" })] })] }), _jsxs("div", { className: "flex flex-col gap-4 pb-6 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-purple-400 text-[24px]", children: "location_on" }), _jsx("h3", { className: "text-white text-lg font-semibold", children: "Business Address" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Street Address" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.address.street, onChange: (e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } }), placeholder: "123 Business Street" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "City" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.address.city, onChange: (e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } }) })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "State" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.address.state, onChange: (e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Zip Code" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.address.zipCode, onChange: (e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } }) })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Country" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.address.country, onChange: (e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } }) })] })] })] }), _jsxs("div", { className: "flex flex-col gap-4 pb-6 border-b border-white/5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-amber-400 text-[24px]", children: "badge" }), _jsx("h3", { className: "text-white text-lg font-semibold", children: "Primary Contact Person" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Name" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.contactPerson.name, onChange: (e) => setFormData({ ...formData, contactPerson: { ...formData.contactPerson, name: e.target.value } }) })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Role" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.contactPerson.role, onChange: (e) => setFormData({ ...formData, contactPerson: { ...formData.contactPerson, role: e.target.value } }), placeholder: "e.g., Facility Manager" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Email" }), _jsx("input", { type: "email", className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.contactPerson.email, onChange: (e) => setFormData({ ...formData, contactPerson: { ...formData.contactPerson, email: e.target.value } }) })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Phone" }), _jsx("input", { className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.contactPerson.phone, onChange: (e) => setFormData({ ...formData, contactPerson: { ...formData.contactPerson, phone: e.target.value } }) })] })] })] }), _jsxs("div", { className: "flex flex-col gap-4 pb-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[#3b82f6] text-[24px]", children: "eco" }), _jsx("h3", { className: "text-white text-lg font-semibold", children: "Sustainability Goals" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("p", { className: "text-white text-sm font-medium leading-normal pb-2", children: "Monthly E-Waste Target (kg)" }), _jsx("input", { type: "number", className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#3b82f6] border border-white/5 bg-[#0B1116] h-12 placeholder:text-[#94a3b8] p-3 text-base font-normal leading-normal transition-all", value: formData.monthlyTarget, onChange: (e) => setFormData({ ...formData, monthlyTarget: parseInt(e.target.value) || 0 }), min: "0" })] })] }), _jsxs("div", { className: "flex justify-end gap-4 pt-4 border-t border-white/5", children: [_jsx("button", { className: "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0B1116] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors border border-white/5", type: "button", onClick: () => navigate('/business'), children: _jsx("span", { className: "truncate", children: "Cancel" }) }), _jsx("button", { className: "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#3b82f6] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#2563eb] transition-colors disabled:opacity-50", type: "submit", disabled: saving, children: _jsx("span", { className: "truncate", children: saving ? 'Saving...' : 'Save Changes' }) })] })] })] }) }) }) })] }) })] }) }));
};
export default BusinessProfile;
