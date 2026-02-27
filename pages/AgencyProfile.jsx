import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout.jsx';
import { api, getCurrentUser } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import { useNavigate } from 'react-router-dom';
const AgencyProfile = () => {
    const navigate = useNavigate();
    // Agency profile management component
    const [user, setUser] = useState(getCurrentUser());
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('company');
    const [formData, setFormData] = useState({
        companyName: '',
        registrationNumber: '',
        description: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: ''
    });
    const [regions, setRegions] = useState([]);
    const [wasteTypes, setWasteTypes] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [agencyData, setAgencyData] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [agencyLogo, setAgencyLogo] = useState('');
    const logoInputRef = useRef(null);
    const certInputRef = useRef(null);
    const [showCertModal, setShowCertModal] = useState(false);
    const [newCert, setNewCert] = useState({ name: '', type: '', file: null });
    const [showRegionInput, setShowRegionInput] = useState(false);
    const [newRegion, setNewRegion] = useState('');
    const [operatingHours, setOperatingHours] = useState([
        { day: 'Monday - Friday', open: '08:00', close: '18:00', isOpen: true },
        { day: 'Saturday', open: '09:00', close: '14:00', isOpen: true },
        { day: 'Sunday', open: '00:00', close: '00:00', isOpen: false }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.getAgencyProfile();
                const agency = response.data || response;
                setAgencyData(agency);
                setAgencyLogo(agency.logo || '');
                setFormData({
                    companyName: agency.name || '',
                    registrationNumber: agency.registrationNumber || '',
                    description: agency.description || '',
                    email: agency.email || '',
                    phone: agency.phone || '',
                    address: agency.address?.street || '',
                    city: agency.address?.city || '',
                    zipCode: agency.address?.zipCode || ''
                });
                setRegions(agency.operatingRegions || (agency.address?.city ? [agency.address.city] : []));
                setWasteTypes(agency.services || []);
                if (agency.operatingHours && agency.operatingHours.length > 0) {
                    setOperatingHours(agency.operatingHours);
                }
                // Parse certifications if stored as JSON strings
                const parsedCerts = agency.certifications?.map((cert) => {
                    try {
                        return JSON.parse(cert);
                    }
                    catch {
                        return { name: cert, type: 'Certification', icon: 'verified', color: 'text-green-400' };
                    }
                }) || [];
                setCertifications(parsedCerts);
            }
            catch (error) {
            }
            finally {
                setLoading(false);
            }
        };
        const fetchNotifications = async () => {
            try {
                const response = await api.getNotifications();
                const notifData = response.data || response || [];
                setNotifications(Array.isArray(notifData) ? notifData : []);
            }
            catch (error) {
                setNotifications([]);
            }
        };
        fetchProfile();
        fetchNotifications();
    }, []);
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');
        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            if (!cloudName) {
                throw new Error('Cloudinary cloud name not configured');
            }
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            return data.secure_url;
        }
        catch (error) {
            throw error;
        }
    };
    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        try {
            const imageUrl = await uploadToCloudinary(file);
            setAgencyLogo(imageUrl);
            // Update in backend
            await api.updateAgencyProfile({ logo: imageUrl });
            alert('Logo updated successfully!');
        }
        catch (error) {
            alert('Failed to upload logo');
        }
        finally {
            setUploading(false);
        }
    };
    const handleAddCertification = async () => {
        if (!newCert.name || !newCert.type || !newCert.file) {
            alert('Please fill all fields and select a file');
            return;
        }
        setUploading(true);
        try {
            const certUrl = await uploadToCloudinary(newCert.file);
            const newCertification = {
                name: newCert.name,
                type: newCert.type,
                icon: 'verified',
                color: 'text-green-400',
                url: certUrl
            };
            const updatedCerts = [...certifications, newCertification];
            setCertifications(updatedCerts);
            // Update in backend
            await api.updateAgencyProfile({
                certifications: updatedCerts.map(cert => JSON.stringify(cert))
            });
            setShowCertModal(false);
            setNewCert({ name: '', type: '', file: null });
            alert('Certification added successfully!');
        }
        catch (error) {
            alert('Failed to add certification');
        }
        finally {
            setUploading(false);
        }
    };
    const handleRemoveCertification = async (index) => {
        if (!confirm('Are you sure you want to remove this certification?'))
            return;
        try {
            const updatedCerts = certifications.filter((_, i) => i !== index);
            setCertifications(updatedCerts);
            await api.updateAgencyProfile({
                certifications: updatedCerts.map(cert => JSON.stringify(cert))
            });
            alert('Certification removed successfully!');
        }
        catch (error) {
            alert('Failed to remove certification');
        }
    };
    const handleAddRegion = () => {
        if (newRegion.trim() && !regions.includes(newRegion.trim())) {
            setRegions([...regions, newRegion.trim()]);
            setNewRegion('');
            setShowRegionInput(false);
        }
    };
    const handleRemoveRegion = (index) => {
        setRegions(regions.filter((_, i) => i !== index));
    };
    const handleUpdateOperatingHours = (index, field, value) => {
        const updated = [...operatingHours];
        updated[index] = { ...updated[index], [field]: value };
        setOperatingHours(updated);
    };
    const handleSave = async () => {
        setSaving(true);
        try {
            const addressData = {
                street: formData.address,
                city: formData.city,
                state: 'NY',
                zipCode: formData.zipCode
            };
            // Only include coordinates if they exist and are valid
            if (agencyData?.address?.coordinates?.lat && agencyData?.address?.coordinates?.lng) {
                addressData.coordinates = {
                    lat: agencyData.address.coordinates.lat,
                    lng: agencyData.address.coordinates.lng
                };
            }
            const response = await api.updateAgencyProfile({
                name: formData.companyName,
                registrationNumber: formData.registrationNumber,
                description: formData.description,
                email: formData.email,
                phone: formData.phone,
                logo: agencyLogo,
                address: addressData,
                services: wasteTypes,
                certifications: certifications.map(cert => JSON.stringify(cert)),
                operatingRegions: regions,
                operatingHours: operatingHours
            });
            alert('Profile updated successfully!');
        }
        catch (error) {
            alert(`Failed to update profile: ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }
        finally {
            setSaving(false);
        }
    };
    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };
    const allWasteTypes = ['IT Equipment', 'Mobile Devices', 'Large Appliances', 'Batteries', 'Industrial Machinery', 'Solar Panels'];
    return (_jsx(Layout, { title: "", role: "Agency", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#f59e0b] selection:text-white min-h-screen", children: [_jsxs("div", { className: "relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#f59e0b]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "layout-container flex h-full grow flex-col relative z-10", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#f59e0b]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#f59e0b]", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#f59e0b]", children: "Partner" })] })] }), _jsx("nav", { className: "hidden md:flex flex-1 justify-center gap-1" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowNotifications(!showNotifications), className: "p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors relative", title: "Notifications", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "notifications" }), Array.isArray(notifications) && notifications.filter(n => !n.isRead).length > 0 && (_jsx("span", { className: "absolute top-1 right-1 w-2 h-2 bg-[#f59e0b] rounded-full" }))] }), showNotifications && (_jsxs("div", { className: "absolute right-0 top-14 w-96 bg-[#151F26] rounded-2xl border border-white/5 shadow-2xl z-50 max-h-[500px] overflow-hidden flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-white/5 flex justify-between items-center", children: [_jsx("h3", { className: "text-white font-bold text-lg", children: "Notifications" }), _jsx("button", { onClick: () => setShowNotifications(false), className: "text-slate-400 hover:text-white", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "close" }) })] }), _jsx("div", { className: "overflow-y-auto flex-1", children: !Array.isArray(notifications) || notifications.length === 0 ? (_jsxs("div", { className: "p-8 text-center", children: [_jsx("span", { className: "material-symbols-outlined text-6xl text-slate-600 mb-4 block", children: "notifications_off" }), _jsx("p", { className: "text-slate-400", children: "No notifications" })] })) : (_jsx("div", { className: "divide-y divide-white/5", children: notifications.map((notif, idx) => (_jsx("div", { className: `p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notif.isRead ? 'bg-[#f59e0b]/5' : ''}`, children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: `p-2 rounded-lg ${notif.type === 'booking' ? 'bg-blue-500/10 text-blue-400' : notif.type === 'payment' ? 'bg-green-500/10 text-green-400' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`, children: _jsx("span", { className: "material-symbols-outlined text-xl", children: notif.icon || (notif.type === 'booking' ? 'event' : notif.type === 'payment' ? 'payments' : 'notifications') }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-white font-medium text-sm mb-1", children: notif.title }), _jsx("p", { className: "text-slate-400 text-xs line-clamp-2", children: notif.message }), _jsx("p", { className: "text-slate-500 text-xs mt-2", children: new Date(notif.createdAt).toLocaleString() })] }), !notif.isRead && (_jsx("div", { className: "w-2 h-2 bg-[#f59e0b] rounded-full mt-2" }))] }) }, idx))) })) }), Array.isArray(notifications) && notifications.length > 0 && (_jsx("div", { className: "p-3 border-t border-white/5", children: _jsx("button", { className: "w-full text-center text-[#f59e0b] text-sm font-medium hover:text-[#d97706] transition-colors", children: "Mark all as read" }) }))] }))] }), _jsxs("button", { onClick: () => navigate('/agency/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-[#f59e0b] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#f59e0b]/50 transition-all text-white font-bold text-sm", children: user?.name?.charAt(0) || 'A' }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.name || 'Agency' })] }), _jsx("button", { onClick: handleLogout, className: "p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors", title: "Logout", children: _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "logout" }) })] })] }), _jsx("main", { className: "flex flex-1 justify-center py-5 mt-24", children: _jsxs("div", { className: "layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/agency'), className: "p-2 rounded-lg border transition-colors bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/20", title: "Back to Dashboard", children: _jsx("span", { className: "material-symbols-outlined text-xl", children: "arrow_back" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[#f59e0b] text-sm font-bold uppercase tracking-widest mb-2", children: "Profile Settings" }), _jsx("h1", { className: "text-white text-4xl sm:text-5xl font-black leading-tight tracking-tighter mb-2", children: "Agency Profile" }), _jsx("p", { className: "text-[#94a3b8] text-lg", children: "Manage your company information and settings." })] })] }), _jsxs("button", { onClick: handleSave, disabled: saving, className: "flex items-center justify-center h-12 px-6 text-base font-bold leading-normal transition-all bg-[#f59e0b] text-white rounded-xl hover:bg-[#d97706] hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50", children: [_jsx("span", { className: "material-symbols-outlined mr-2", children: "save" }), _jsx("span", { className: "truncate", children: saving ? 'Saving...' : 'Save Changes' })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsxs("div", { className: "lg:col-span-4 flex flex-col gap-6", children: [_jsx("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: _jsxs("div", { className: "flex flex-col items-center text-center gap-4", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#f59e0b]/20 shadow-xl bg-gradient-to-br from-[#f59e0b]/20 to-orange-600/20 flex items-center justify-center", children: uploading && !agencyLogo ? (_jsx(Loader, { size: "md" })) : agencyLogo ? (_jsx("img", { src: agencyLogo, alt: "Agency Logo", className: "w-full h-full object-cover" })) : (_jsx("span", { className: "material-symbols-outlined text-6xl text-[#f59e0b]", children: "corporate_fare" })) }), _jsx("input", { type: "file", ref: logoInputRef, onChange: handleLogoUpload, accept: "image/*", className: "hidden" }), _jsx("button", { onClick: () => logoInputRef.current?.click(), disabled: uploading, className: "absolute -bottom-2 -right-2 bg-[#f59e0b] text-white rounded-xl p-2.5 hover:bg-[#d97706] transition shadow-[0_0_15px_rgba(245,158,11,0.5)] cursor-pointer disabled:opacity-50", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "edit" }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-white", children: formData.companyName || 'Agency Name' }), _jsxs("div", { className: "flex items-center justify-center gap-2 mt-1", children: [_jsx("span", { className: "material-symbols-outlined text-[#f59e0b] text-sm", children: "verified" }), _jsx("p", { className: "text-sm text-[#f59e0b]", children: agencyData?.isVerified ? 'Verified Partner' : 'Pending Verification' })] })] }), _jsx("div", { className: "w-full h-px bg-white/5 my-2" }), _jsxs("div", { className: "flex flex-col w-full gap-3", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-slate-500", children: "Member Since" }), _jsx("span", { className: "text-white font-medium", children: agencyData?.createdAt ? new Date(agencyData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A' })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-slate-500", children: "Rating" }), _jsxs("span", { className: "text-[#f59e0b] flex items-center gap-1 font-medium", children: [agencyData?.rating?.toFixed(1) || '0.0', " ", _jsx("span", { className: "material-symbols-outlined text-sm fill", children: "star" })] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-slate-500", children: "Total Pickups" }), _jsx("span", { className: "text-white font-medium", children: agencyData?.totalBookings || 0 })] })] })] }) }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsxs("h3", { className: "text-lg font-bold text-white flex items-center gap-2 mb-4", children: [_jsx("span", { className: "material-symbols-outlined text-[#f59e0b]", children: "verified_user" }), "Certifications"] }), _jsxs("div", { className: "flex flex-col gap-3", children: [certifications.map((cert, i) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-[#0B1116] rounded-xl border border-white/5 hover:border-white/5 transition-colors group", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `material-symbols-outlined ${cert.color}`, children: cert.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-white", children: cert.name }), _jsx("p", { className: "text-xs text-slate-500", children: cert.type })] })] }), _jsx("button", { onClick: () => handleRemoveCertification(i), className: "material-symbols-outlined text-slate-600 group-hover:text-red-400 cursor-pointer transition-colors", children: "delete" })] }, i))), _jsxs("button", { onClick: () => setShowCertModal(true), className: "w-full py-3 text-sm font-medium text-[#f59e0b] border border-[#f59e0b]/30 rounded-xl hover:bg-[#f59e0b]/10 transition-all flex items-center justify-center gap-2 cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "add" }), "Add Certification"] })] })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Performance" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-2", children: [_jsx("span", { className: "text-slate-400", children: "Response Rate" }), _jsx("span", { className: "text-white font-bold", children: "98%" })] }), _jsx("div", { className: "w-full h-2 bg-[#0B1116] rounded-full overflow-hidden", children: _jsx("div", { className: "w-[98%] h-full bg-gradient-to-r from-[#f59e0b] to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-2", children: [_jsx("span", { className: "text-slate-400", children: "Completion Rate" }), _jsx("span", { className: "text-white font-bold", children: "95%" })] }), _jsx("div", { className: "w-full h-2 bg-[#0B1116] rounded-full overflow-hidden", children: _jsx("div", { className: "w-[95%] h-full bg-gradient-to-r from-[#f59e0b] to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-2", children: [_jsx("span", { className: "text-slate-400", children: "Satisfaction" }), _jsx("span", { className: "text-white font-bold", children: "97%" })] }), _jsx("div", { className: "w-full h-2 bg-[#0B1116] rounded-full overflow-hidden", children: _jsx("div", { className: "w-[97%] h-full bg-gradient-to-r from-[#f59e0b] to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" }) })] })] })] })] }), _jsxs("div", { className: "lg:col-span-8 flex flex-col gap-6", children: [_jsx("div", { className: "flex h-10 items-center justify-center rounded-xl bg-[#151F26] border border-white/5 p-1 w-fit", children: [
                                                                    { key: 'company', label: 'Company Details', icon: 'business' },
                                                                    { key: 'contact', label: 'Contact Info', icon: 'contact_mail' },
                                                                    { key: 'services', label: 'Services', icon: 'settings' }
                                                                ].map(tab => (_jsxs("label", { className: `flex cursor-pointer h-full items-center justify-center overflow-hidden rounded-lg px-4 text-sm font-medium leading-normal transition-all gap-2 ${activeTab === tab.key
                                                                        ? 'bg-[#f59e0b] text-white shadow-sm'
                                                                        : 'text-slate-400 hover:text-white'}`, children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: tab.icon }), _jsx("span", { className: "truncate", children: tab.label }), _jsx("input", { type: "radio", name: "tab-toggle", value: tab.key, checked: activeTab === tab.key, onChange: () => setActiveTab(tab.key), className: "invisible w-0 absolute" })] }, tab.key))) }), activeTab === 'company' && (_jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-6", children: "Company Details" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Company Name" }), _jsx("input", { className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600", type: "text", value: formData.companyName, onChange: (e) => setFormData({ ...formData, companyName: e.target.value }) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Registration Number" }), _jsx("input", { className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600", type: "text", value: formData.registrationNumber, onChange: (e) => setFormData({ ...formData, registrationNumber: e.target.value }) })] }), _jsxs("div", { className: "flex flex-col gap-2 md:col-span-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Description of Services" }), _jsx("textarea", { className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600 resize-none", rows: 4, value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }) }), _jsxs("p", { className: "text-xs text-slate-600 text-right", children: [formData.description.length, "/500 characters"] })] })] })] })), activeTab === 'contact' && (_jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-6", children: "Contact & Location" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Primary Email" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg", children: "mail" }), _jsx("input", { className: "w-full bg-[#0B1116] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600", type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }) })] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Phone Number" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg", children: "call" }), _jsx("input", { className: "w-full bg-[#0B1116] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600", type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }) })] })] }), _jsxs("div", { className: "flex flex-col gap-2 md:col-span-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Address" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg", children: "location_on" }), _jsx("input", { className: "w-full bg-[#0B1116] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600", type: "text", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }) })] })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "City" }), _jsx("input", { className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600", type: "text", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-medium text-slate-400", children: "Zip Code" }), _jsx("input", { className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600", type: "text", value: formData.zipCode, onChange: (e) => setFormData({ ...formData, zipCode: e.target.value }) })] })] })] })), activeTab === 'services' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-lg font-bold text-white", children: "Operating Regions" }), _jsx("button", { className: "text-[#f59e0b] text-sm font-medium hover:text-[#d97706] transition-colors cursor-pointer bg-transparent border-none", children: "Manage Areas" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [regions.map((region, i) => (_jsxs("div", { className: "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#f59e0b]/20 transition-colors", children: [region, _jsx("button", { onClick: () => handleRemoveRegion(i), className: "hover:text-white cursor-pointer bg-transparent border-none flex items-center", children: _jsx("span", { className: "material-symbols-outlined text-base", children: "close" }) })] }, i))), showRegionInput ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", value: newRegion, onChange: (e) => setNewRegion(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleAddRegion(), placeholder: "Enter city name", className: "bg-[#0B1116] border border-[#f59e0b]/50 text-white px-3 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#f59e0b]/50", autoFocus: true }), _jsx("button", { onClick: handleAddRegion, className: "bg-[#f59e0b] text-white px-3 py-2 rounded-xl text-sm hover:bg-[#d97706] transition-colors", children: "Add" }), _jsx("button", { onClick: () => { setShowRegionInput(false); setNewRegion(''); }, className: "text-slate-400 hover:text-white", children: _jsx("span", { className: "material-symbols-outlined text-base", children: "close" }) })] })) : (_jsxs("button", { onClick: () => setShowRegionInput(true), className: "bg-[#0B1116] border-2 border-dashed border-white/5 hover:border-[#f59e0b]/50 hover:text-[#f59e0b] text-slate-500 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer", children: [_jsx("span", { className: "material-symbols-outlined text-base", children: "add" }), "Add Region"] }))] })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-6", children: "Accepted E-Waste Types" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: allWasteTypes.map((type, i) => (_jsxs("label", { className: "flex items-center gap-3 cursor-pointer group", children: [_jsxs("div", { className: "relative flex items-center", children: [_jsx("input", { checked: wasteTypes.includes(type), onChange: (e) => {
                                                                                                        if (e.target.checked) {
                                                                                                            setWasteTypes([...wasteTypes, type]);
                                                                                                        }
                                                                                                        else {
                                                                                                            setWasteTypes(wasteTypes.filter(t => t !== type));
                                                                                                        }
                                                                                                    }, className: "peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/5 bg-[#0B1116] transition-all checked:border-[#f59e0b] checked:bg-[#f59e0b] hover:border-[#f59e0b]/50", type: "checkbox" }), _jsx("span", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 material-symbols-outlined text-sm font-bold", children: "check" })] }), _jsx("span", { className: "text-sm text-white group-hover:text-[#f59e0b] transition-colors", children: type })] }, i))) })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] border border-white/5", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Operating Hours" }), _jsx("div", { className: "grid grid-cols-1 gap-3", children: operatingHours.map((schedule, i) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-[#0B1116] rounded-xl border border-white/5 hover:border-white/5 transition-colors group", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "checkbox", checked: schedule.isOpen, onChange: (e) => handleUpdateOperatingHours(i, 'isOpen', e.target.checked), className: "h-4 w-4 cursor-pointer appearance-none rounded border border-white/5 bg-[#0B1116] transition-all checked:border-[#f59e0b] checked:bg-[#f59e0b]" }), _jsx("span", { className: "text-sm text-white font-medium", children: schedule.day })] }), _jsx("div", { className: "flex items-center gap-2", children: schedule.isOpen ? (_jsxs(_Fragment, { children: [_jsx("input", { type: "time", value: schedule.open, onChange: (e) => handleUpdateOperatingHours(i, 'open', e.target.value), className: "bg-[#0B1116] border border-white/5 rounded-lg px-2 py-1 text-sm text-white outline-none focus:border-[#f59e0b]" }), _jsx("span", { className: "text-slate-500", children: "-" }), _jsx("input", { type: "time", value: schedule.close, onChange: (e) => handleUpdateOperatingHours(i, 'close', e.target.value), className: "bg-[#0B1116] border border-white/5 rounded-lg px-2 py-1 text-sm text-white outline-none focus:border-[#f59e0b]" })] })) : (_jsx("span", { className: "text-slate-500 text-sm", children: "Closed" })) })] }, i))) })] })] }))] })] })] }) })] })] }), showCertModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 max-w-md w-full border border-white/5 shadow-2xl", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-xl font-bold text-white", children: "Add Certification" }), _jsx("button", { onClick: () => setShowCertModal(false), className: "p-2 rounded-lg hover:bg-white/5 transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-slate-400", children: "close" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-slate-400 mb-2 block", children: "Certification Name" }), _jsx("input", { type: "text", value: newCert.name, onChange: (e) => setNewCert({ ...newCert, name: e.target.value }), placeholder: "e.g., ISO 14001", className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all placeholder-slate-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-slate-400 mb-2 block", children: "Certification Type" }), _jsxs("select", { value: newCert.type, onChange: (e) => setNewCert({ ...newCert, type: e.target.value }), className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#f59e0b]/50 focus:border-[#f59e0b] outline-none transition-all", children: [_jsx("option", { value: "", children: "Select type" }), _jsx("option", { value: "Environmental", children: "Environmental" }), _jsx("option", { value: "Quality", children: "Quality" }), _jsx("option", { value: "Safety", children: "Safety" }), _jsx("option", { value: "Industry", children: "Industry Standard" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium text-slate-400 mb-2 block", children: "Certificate Document" }), _jsx("input", { type: "file", ref: certInputRef, onChange: (e) => setNewCert({ ...newCert, file: e.target.files?.[0] || null }), accept: "image/*,.pdf", className: "hidden" }), _jsxs("button", { onClick: () => certInputRef.current?.click(), className: "w-full bg-[#0B1116] border border-white/5 rounded-xl px-4 py-3 text-slate-400 hover:border-[#f59e0b]/50 transition-all flex items-center justify-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "upload_file" }), newCert.file ? newCert.file.name : 'Choose file'] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { onClick: () => setShowCertModal(false), className: "flex-1 px-4 py-3 rounded-xl border border-white/5 text-slate-400 hover:bg-white/5 transition-all", children: "Cancel" }), _jsx("button", { onClick: handleAddCertification, disabled: uploading, className: "flex-1 px-4 py-3 rounded-xl bg-[#f59e0b] text-white hover:bg-[#d97706] transition-all disabled:opacity-50 flex items-center justify-center gap-2", children: uploading ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm" }), "Uploading..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined", children: "add" }), "Add"] })) })] })] })] }) }))] }) }));
};
export default AgencyProfile;
