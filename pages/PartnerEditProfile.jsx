import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import RolePageShell from '../components/RolePageShell.jsx';
import BackButton from '../components/BackButton.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Loader from '../components/Loader.jsx';
import { api, getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const PartnerEditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [avatarKey, setAvatarKey] = useState(Date.now());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        companyName: '',
        registrationNumber: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        description: '',
        services: ''
    });
    const [logoPreview, setLogoPreview] = useState('');
    const [uploadingLogo, setUploadingLogo] = useState(false);
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        loadPartnerProfile();
        // Listen for user updates (logo/avatar changes)
        const handleUserUpdate = () => {
            const updatedUser = getCurrentUser();
            setUser(updatedUser);
            setAvatarKey(Date.now());
            loadPartnerProfile();
        };
        window.addEventListener('userUpdated', handleUserUpdate);
        window.addEventListener('storage', handleUserUpdate);
        return () => {
            window.removeEventListener('userUpdated', handleUserUpdate);
            window.removeEventListener('storage', handleUserUpdate);
        };
    }, []);
    const loadPartnerProfile = async () => {
        try {
            setLoading(true);
            const response = await api.getAgencyProfile();
            const profileData = response.data || response;
            setProfile(profileData);
            // Handle address - can be string or object
            let addressStr = '';
            let city = '';
            let state = '';
            let zipCode = '';
            let country = 'India';
            if (profileData.address) {
                if (typeof profileData.address === 'string') {
                    addressStr = profileData.address;
                }
                else if (typeof profileData.address === 'object') {
                    addressStr = profileData.address.street || '';
                    city = profileData.address.city || '';
                    state = profileData.address.state || '';
                    zipCode = profileData.address.zipCode || '';
                    country = profileData.address.country || 'India';
                }
            }
            setFormData({
                name: profileData.name || '',
                email: profileData.email || '',
                companyName: profileData.companyName || '',
                registrationNumber: profileData.registrationNumber || '',
                phone: profileData.phone || '',
                address: addressStr,
                city: city,
                state: state,
                zipCode: zipCode,
                country: country,
                description: profileData.description || '',
                services: profileData.services || ''
            });
            // Set logo preview with cache busting if URL exists
            const logoUrl = profileData.logo ? `${profileData.logo}?t=${Date.now()}` : '';
            setLogoPreview(logoUrl);
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
    const handleLogoChange = async (e) => {
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
            setUploadingLogo(true);
            // Preview the image locally first
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
            // Upload to Cloudinary
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
                // Update logo in backend immediately
                await api.updateAgencyProfile({ logo: data.secure_url });
                // Update local storage with both avatar and logo
                const currentUser = getCurrentUser();
                if (currentUser) {
                    currentUser.avatar = data.secure_url;
                    currentUser.logo = data.secure_url;
                    localStorage.setItem('user', JSON.stringify(currentUser));
                }
                // Trigger reload by dispatching custom event
                window.dispatchEvent(new Event('userUpdated'));
                window.dispatchEvent(new Event('storage'));
                // Refresh avatar key
                setAvatarKey(Date.now());
                setLogoPreview(data.secure_url);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        }
        catch (error) {
            setErrorMessage('Failed to upload logo. Please try again.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
        finally {
            setUploadingLogo(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.companyName || !formData.email || !formData.phone) {
            setErrorMessage('Please fill in all required fields');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }
        try {
            setSaving(true);
            const updateData = {
                name: formData.name,
                companyName: formData.companyName,
                registrationNumber: formData.registrationNumber,
                phone: formData.phone,
                address: {
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country
                },
                description: formData.description,
                services: formData.services
            };
            const response = await api.updateAgencyProfile(updateData);
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
            await loadPartnerProfile();
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
        return (_jsx(RolePageShell, { role: "partner", children: _jsx("div", { className: "flex items-center justify-center py-32", children: _jsx(Loader, { size: "md", color: "#8b5cf6" }) }) }));
    }
    return (_jsxs(RolePageShell, { role: "partner", children: [showSuccess && (_jsx("div", { className: "fixed top-4 right-4 z-50 animate-slide-in-right", children: _jsxs("div", { className: "bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm", children: [_jsx("span", { className: "material-symbols-outlined text-green-400", children: "check_circle" }), _jsx("span", { className: "text-green-400 font-medium", children: "Profile updated successfully!" })] }) })), errorMessage && (_jsx("div", { className: "fixed top-4 right-4 z-50 animate-slide-in-right", children: _jsxs("div", { className: "bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm max-w-md", children: [_jsx("span", { className: "material-symbols-outlined text-red-400", children: "error" }), _jsx("span", { className: "text-red-400 font-medium", children: errorMessage })] }) })), _jsx(BackButton, { label: "Back to Settings", color: "#8b5cf6", hoverColor: "#7c3aed" }), _jsx(PageHeader, { icon: "business", iconColor: "#8b5cf6", title: "Edit Company Profile", subtitle: "Update your company information and details" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[#8b5cf6]", children: "business_center" }), _jsx("h3", { className: "text-white text-lg font-bold", children: "Company Logo" })] }), _jsxs("div", { className: "flex flex-col items-center gap-6 p-6 bg-[#0B1116] rounded-xl border border-white/5", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "size-40 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center ring-4 ring-[#8b5cf6]/20 text-white font-bold text-5xl overflow-hidden shadow-lg shadow-[#8b5cf6]/20 transition-all group-hover:ring-[#8b5cf6]/40", style: logoPreview ? { backgroundImage: `url(${logoPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}, children: !logoPreview && (formData.companyName?.charAt(0)?.toUpperCase() || 'P') }), _jsxs("label", { htmlFor: "logo", className: "absolute bottom-2 right-2 size-12 rounded-xl bg-[#8b5cf6] border-4 border-[#0B1116] flex items-center justify-center cursor-pointer hover:bg-[#7c3aed] transition-all shadow-lg hover:scale-110 group", children: [uploadingLogo ? (_jsx(Loader, { size: "sm", color: "white" })) : (_jsx("span", { className: "material-symbols-outlined text-white text-[24px]", children: "photo_camera" })), _jsx("input", { type: "file", id: "logo", accept: "image/*", onChange: handleLogoChange, className: "hidden", disabled: uploadingLogo })] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-white text-sm font-medium mb-1", children: "Upload Company Logo" }), _jsx("p", { className: "text-slate-400 text-xs", children: uploadingLogo ? 'Uploading to cloud...' : 'Click the camera icon • Square image • Min 256x256px' }), _jsxs("div", { className: "flex items-center justify-center gap-2 mt-3", children: [_jsx("span", { className: "px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-full text-[#8b5cf6] text-xs font-medium", children: "JPG" }), _jsx("span", { className: "px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-full text-[#8b5cf6] text-xs font-medium", children: "PNG" }), _jsx("span", { className: "px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-full text-[#8b5cf6] text-xs font-medium", children: "SVG" })] })] })] })] }) }), _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "text-white text-lg font-bold", children: "Company Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Company Name *" }), _jsx("input", { type: "text", name: "companyName", value: formData.companyName, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all", placeholder: "Enter company name" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Registration Number" }), _jsx("input", { type: "text", name: "registrationNumber", value: formData.registrationNumber, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all", placeholder: "Business registration number" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Contact Person" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all", placeholder: "Contact person name" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Email *" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, required: true, disabled: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116]/50 border rounded-xl border-white/5 text-slate-400 cursor-not-allowed", placeholder: "Email address" })] }), _jsxs("label", { className: "flex flex-col w-full md:col-span-2", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Phone Number *" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all", placeholder: "Contact phone number" })] })] })] }) }), _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "text-white text-lg font-bold", children: "Address" }), _jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Street Address" }), _jsx("input", { type: "text", name: "address", value: formData.address, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all", placeholder: "Street address" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "City" }), _jsx("input", { type: "text", name: "city", value: formData.city, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all", placeholder: "City" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "State" }), _jsx("input", { type: "text", name: "state", value: formData.state, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all", placeholder: "State" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "ZIP Code" }), _jsx("input", { type: "text", name: "zipCode", value: formData.zipCode, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all", placeholder: "ZIP code" })] })] })] })] }) }), _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "text-white text-lg font-bold", children: "About Company" }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Company Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleInputChange, rows: 4, className: "w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all resize-none", placeholder: "Tell us about your recycling company..." })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Services Offered" }), _jsx("textarea", { name: "services", value: formData.services, onChange: handleInputChange, rows: 3, className: "w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all resize-none", placeholder: "List the services you provide (e.g., E-waste collection, Electronics recycling...)" })] })] }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-end pt-4", children: [_jsx("button", { type: "button", onClick: () => window.history.back(), className: "h-12 px-6 rounded-xl bg-[#151F26] border border-white/5 text-white font-semibold hover:bg-white/5 transition-all", children: "Cancel" }), _jsx("button", { type: "submit", disabled: saving, className: "h-12 px-8 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold transition-all shadow-lg shadow-[#8b5cf6]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: saving ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), _jsx("span", { children: "Saving..." })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "save" }), _jsx("span", { children: "Save Changes" })] })) })] })] })] }));
};
export default PartnerEditProfile;
