import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import RolePageShell from '../components/RolePageShell.jsx';
import BackButton from '../components/BackButton.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Loader from '../components/Loader.jsx';
import { api, getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const EditBusinessProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        industry: 'Technology',
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        contactPersonName: '',
        contactPersonRole: '',
        contactPersonEmail: '',
        contactPersonPhone: '',
        sustainabilityGoals: ''
    });
    const [logoPreview, setLogoPreview] = useState('');
    const [uploadingLogo, setUploadingLogo] = useState(false);
    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        loadBusinessProfile();
    }, []);
    const loadBusinessProfile = async () => {
        try {
            setLoading(true);
            const response = await api.getBusinessProfile();
            const businessData = response.data || response;
            setBusiness(businessData);
            setFormData({
                companyName: businessData.companyName || '',
                description: businessData.description || '',
                industry: businessData.industry || 'Technology',
                email: businessData.email || '',
                phone: businessData.phone || '',
                website: businessData.website || '',
                address: businessData.address || '',
                city: businessData.city || '',
                state: businessData.state || '',
                zipCode: businessData.zipCode || '',
                country: businessData.country || 'India',
                contactPersonName: businessData.contactPersonName || '',
                contactPersonRole: businessData.contactPersonRole || '',
                contactPersonEmail: businessData.contactPersonEmail || '',
                contactPersonPhone: businessData.contactPersonPhone || '',
                sustainabilityGoals: businessData.sustainabilityGoals || ''
            });
            setLogoPreview(businessData.logo || '');
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
            // Store the old logo URL before uploading new one
            const oldLogo = business?.logo || logoPreview;
            // Preview the image locally first
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
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
                // Update the logo preview with Cloudinary URL
                setLogoPreview(data.secure_url);
                // Immediately save the logo to profile
                // The backend will automatically delete the old logo if it exists
                try {
                    const updatedBusiness = await api.updateBusinessProfile({ logo: data.secure_url });
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                    // Reload profile data
                    await loadBusinessProfile();
                }
                catch (apiError) {
                    setErrorMessage('Logo uploaded but failed to save to profile. Please try saving your profile.');
                    setTimeout(() => setErrorMessage(''), 5000);
                }
            }
        }
        catch (error) {
            setErrorMessage('Failed to upload logo. Please try again.');
            setTimeout(() => setErrorMessage(''), 5000);
        }
        finally {
            setUploadingLogo(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            setSaving(true);
            const updateData = { ...formData };
            if (logoPreview && logoPreview !== business?.logo) {
                updateData.logo = logoPreview;
            }
            const response = await api.updateBusinessProfile(updateData);
            // Show success notification
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            // Reload profile data
            await loadBusinessProfile();
        }
        catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Failed to update business profile. Please try again.';
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
        return (_jsx(RolePageShell, { role: "business", children: _jsx("div", { className: "flex items-center justify-center py-32", children: _jsx(Loader, { size: "md", color: "#06b6d4" }) }) }));
    }
    return (_jsxs(RolePageShell, { role: "business", children: [showSuccess && (_jsx("div", { className: "fixed top-4 right-4 z-50 animate-slide-in-right", children: _jsxs("div", { className: "bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm", children: [_jsx("span", { className: "material-symbols-outlined text-green-400", children: "check_circle" }), _jsx("span", { className: "text-green-400 font-medium", children: "Profile updated successfully!" })] }) })), errorMessage && (_jsx("div", { className: "fixed top-4 right-4 z-50 animate-slide-in-right", children: _jsxs("div", { className: "bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm max-w-md", children: [_jsx("span", { className: "material-symbols-outlined text-red-400", children: "error" }), _jsx("span", { className: "text-red-400 font-medium", children: errorMessage })] }) })), _jsx(BackButton, { label: "Back to Settings", color: "#06b6d4", hoverColor: "#0891b2" }), _jsx(PageHeader, { icon: "business", iconColor: "#06b6d4", title: "Edit Business Profile", subtitle: "Update your company information, address, and contact details" }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [_jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-[#06b6d4]", children: "image" }), _jsx("h3", { className: "text-white text-lg font-bold", children: "Company Logo" })] }), _jsxs("div", { className: "flex flex-col items-center gap-6 p-6 bg-[#0B1116] rounded-xl border border-white/5", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "size-40 rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] flex items-center justify-center ring-4 ring-[#06b6d4]/20 text-white font-bold text-5xl overflow-hidden shadow-lg shadow-[#06b6d4]/20 transition-all group-hover:ring-[#06b6d4]/40", style: logoPreview ? { backgroundImage: `url(${logoPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}, children: !logoPreview && (formData.companyName?.charAt(0) || 'B') }), _jsxs("label", { htmlFor: "logo", className: "absolute bottom-2 right-2 size-12 rounded-xl bg-[#06b6d4] border-4 border-[#0B1116] flex items-center justify-center cursor-pointer hover:bg-[#0891b2] transition-all shadow-lg hover:scale-110 group", children: [_jsx("span", { className: "material-symbols-outlined text-white text-[24px]", children: "photo_camera" }), _jsx("input", { type: "file", id: "logo", accept: "image/*", onChange: handleLogoChange, className: "hidden" })] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-white text-sm font-medium mb-1", children: "Upload Company Logo" }), _jsx("p", { className: "text-slate-400 text-xs", children: "Click the camera icon \u2022 Square image \u2022 Min 256x256px" }), _jsxs("div", { className: "flex items-center justify-center gap-2 mt-3", children: [_jsx("span", { className: "px-3 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-full text-[#06b6d4] text-xs font-medium", children: "JPG" }), _jsx("span", { className: "px-3 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-full text-[#06b6d4] text-xs font-medium", children: "PNG" }), _jsx("span", { className: "px-3 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-full text-[#06b6d4] text-xs font-medium", children: "SVG" })] })] })] })] }) }), _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "text-white text-lg font-bold", children: "Company Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Company Name *" }), _jsx("input", { type: "text", name: "companyName", value: formData.companyName, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "Enter company name" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Industry *" }), _jsxs("select", { name: "industry", value: formData.industry, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", children: [_jsx("option", { value: "Technology", children: "Technology" }), _jsx("option", { value: "Manufacturing", children: "Manufacturing" }), _jsx("option", { value: "Healthcare", children: "Healthcare" }), _jsx("option", { value: "Retail", children: "Retail" }), _jsx("option", { value: "Education", children: "Education" }), _jsx("option", { value: "Finance", children: "Finance" }), _jsx("option", { value: "Other", children: "Other" })] })] })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleInputChange, rows: 3, className: "w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all resize-none", placeholder: "Brief description of your company" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Email *" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "company@example.com" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Phone *" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "+1 (555) 000-0000" })] })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Website" }), _jsx("input", { type: "url", name: "website", value: formData.website, onChange: handleInputChange, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "https://www.yourcompany.com" })] })] }) }), _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "text-white text-lg font-bold", children: "Business Address" }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Street Address *" }), _jsx("textarea", { name: "address", value: formData.address, onChange: handleInputChange, rows: 2, required: true, className: "w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all resize-none", placeholder: "Enter street address" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "City *" }), _jsx("input", { type: "text", name: "city", value: formData.city, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "City" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "State/Province *" }), _jsx("input", { type: "text", name: "state", value: formData.state, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "State/Province" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "ZIP/Postal Code *" }), _jsx("input", { type: "text", name: "zipCode", value: formData.zipCode, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "ZIP/Postal Code" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Country *" }), _jsx("input", { type: "text", name: "country", value: formData.country, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "Country" })] })] })] }) }), _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "text-white text-lg font-bold", children: "Contact Person" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Full Name *" }), _jsx("input", { type: "text", name: "contactPersonName", value: formData.contactPersonName, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "Contact person name" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Role/Position *" }), _jsx("input", { type: "text", name: "contactPersonRole", value: formData.contactPersonRole, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "e.g., Facility Manager" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Email *" }), _jsx("input", { type: "email", name: "contactPersonEmail", value: formData.contactPersonEmail, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "contact@example.com" })] }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Phone *" }), _jsx("input", { type: "tel", name: "contactPersonPhone", value: formData.contactPersonPhone, onChange: handleInputChange, required: true, className: "w-full h-12 px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all", placeholder: "+1 (555) 000-0000" })] })] })] }) }), _jsx("div", { className: "bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5", children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h3", { className: "text-white text-lg font-bold", children: "Sustainability Goals" }), _jsxs("label", { className: "flex flex-col w-full", children: [_jsx("span", { className: "text-white text-sm font-medium pb-2", children: "Your Sustainability Objectives" }), _jsx("textarea", { name: "sustainabilityGoals", value: formData.sustainabilityGoals, onChange: handleInputChange, rows: 4, className: "w-full px-3 py-2 bg-[#0B1116] border rounded-xl border-white/5 text-white focus:outline-none focus:ring-1 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all resize-none", placeholder: "Describe your company's sustainability goals and e-waste management objectives..." })] })] }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-end pt-4", children: [_jsx("button", { type: "button", onClick: () => window.history.back(), className: "flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#0B1116] border border-white/5 text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/5 transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", disabled: saving, className: "flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#06b6d4] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0891b2] transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: saving ? 'Saving...' : 'Save Changes' })] })] })] }));
};
export default EditBusinessProfile;
