import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import Loader from '../components/Loader.jsx';
import { api, getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const PartnerRegistration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const currentUser = getCurrentUser();
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        headName: '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        gstNumber: '',
        udyamCertificate: '',
        businessType: '',
        establishedYear: new Date().getFullYear(),
        description: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India',
            coordinates: {
                lat: 0,
                lng: 0
            }
        },
        services: [],
        verificationDocuments: []
    });
    const [locationStatus, setLocationStatus] = useState('idle');
    const [locationError, setLocationError] = useState('');
    const serviceOptions = [
        'E-Waste Collection',
        'Recycling',
        'Data Destruction',
        'Pickup Service',
        'Bulk Collection',
        'Corporate Services'
    ];
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };
    const handleServiceToggle = (service) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };
    const handleGetLocation = () => {
        setLocationStatus('loading');
        setLocationError('');
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setLocationStatus('error');
            return;
        }
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    coordinates: {
                        lat: latitude,
                        lng: longitude
                    }
                }
            }));
            setLocationStatus('success');
        }, (error) => {
            setLocationError('Could not get location. This is optional - you can proceed without it.');
            setLocationStatus('error');
        }, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 600000
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Validate required fields
            if (!formData.name || !formData.headName || !formData.email || !formData.phone || !formData.gstNumber) {
                throw new Error('Please fill all required fields');
            }
            if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.zipCode) {
                throw new Error('Please complete the address details');
            }
            // Require location coordinates
            if (!formData.address.coordinates?.lat || formData.address.coordinates?.lat === 0) {
                throw new Error('Please share your location to help users find your agency on the map');
            }
            await api.post('/agencies', formData);
            // Redirect to pending status page
            navigate('/partner/pending');
        }
        catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to submit registration');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] font-sans text-gray-100 antialiased selection:bg-cyan-500 selection:text-white py-12 px-4", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "max-w-4xl mx-auto relative z-10", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("div", { className: "inline-flex items-center gap-3 mb-6 cursor-pointer", onClick: () => navigate('/'), children: _jsx("div", { className: "p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg", children: _jsx("svg", { className: "h-8 w-8 text-white", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }) }), _jsx("h1", { className: "text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent", children: "Partner Registration" }), _jsx("p", { className: "text-gray-200 text-lg", children: "Join our network of verified e-waste recycling partners. Please provide accurate information for verification." })] }), _jsxs("div", { className: "bg-[#1a2332]/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 shadow-2xl", children: [error && (_jsx("div", { className: "mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg", children: _jsx("p", { className: "text-red-300 font-medium", children: error }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "border-b border-cyan-500/20 pb-6", children: [_jsxs("h2", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-cyan-400", children: "business" }), "Business Information"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: ["Agency Name ", _jsx("span", { className: "text-cyan-400", children: "*" })] }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all", placeholder: currentUser?.name ? '' : 'Enter agency name', required: true }), currentUser?.name && (_jsxs("p", { className: "text-xs text-slate-400 mt-1", children: ["From your account: ", currentUser.name] }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: ["Head/Owner Name ", _jsx("span", { className: "text-cyan-400", children: "*" })] }), _jsx("input", { type: "text", name: "headName", value: formData.headName, onChange: handleInputChange, className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all", required: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: ["GST Number ", _jsx("span", { className: "text-cyan-400", children: "*" })] }), _jsx("input", { type: "text", name: "gstNumber", value: formData.gstNumber, onChange: handleInputChange, placeholder: "e.g., 22AAAAA0000A1Z5", className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: "Udyam Certificate Number" }), _jsx("input", { type: "text", name: "udyamCertificate", value: formData.udyamCertificate, onChange: handleInputChange, placeholder: "e.g., UDYAM-XX-00-0000000", className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: "Business Type" }), _jsxs("select", { name: "businessType", value: formData.businessType, onChange: handleInputChange, className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-all", children: [_jsx("option", { value: "", className: "bg-[#0f1823]", children: "Select Type" }), _jsx("option", { value: "Private Limited", className: "bg-[#0f1823]", children: "Private Limited" }), _jsx("option", { value: "Partnership", className: "bg-[#0f1823]", children: "Partnership" }), _jsx("option", { value: "Proprietorship", className: "bg-[#0f1823]", children: "Proprietorship" }), _jsx("option", { value: "LLP", className: "bg-[#0f1823]", children: "LLP" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: "Established Year" }), _jsx("input", { type: "number", name: "establishedYear", value: formData.establishedYear, onChange: handleInputChange, min: "1900", max: new Date().getFullYear(), className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-all" })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleInputChange, rows: 3, className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all", placeholder: "Brief description of your services and capabilities" })] })] }), _jsxs("div", { className: "border-b border-cyan-500/20 pb-6", children: [_jsxs("h2", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-blue-400", children: "contact_mail" }), "Contact Information"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: ["Email ", _jsx("span", { className: "text-cyan-400", children: "*" })] }), _jsx("input", { type: "email", name: "email", value: formData.email, readOnly: true, className: "w-full px-4 py-2.5 bg-[#151F26] border border-cyan-500/20 rounded-lg text-gray-200 cursor-not-allowed", required: true }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "\uD83D\uDCE7 From your account (cannot be changed)" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: ["Phone ", _jsx("span", { className: "text-cyan-400", children: "*" })] }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleInputChange, className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all", required: true })] })] })] }), _jsxs("div", { className: "border-b border-cyan-500/20 pb-6", children: [_jsxs("h2", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-cyan-400", children: "location_on" }), "Address Details"] }), _jsx("div", { className: "mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "material-symbols-outlined text-cyan-400 text-[28px]", children: "my_location" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h3", { className: "text-white font-medium mb-1", children: ["Share Your Location ", _jsx("span", { className: "text-cyan-400", children: "*" })] }), _jsx("p", { className: "text-sm text-gray-200 mb-3", children: "Required so users can find your agency on the map" }), _jsx("button", { type: "button", onClick: handleGetLocation, disabled: locationStatus === 'loading', className: "flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white rounded-lg transition-all", children: locationStatus === 'loading' ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "white" }), _jsx("span", { children: "Detecting..." })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "gps_fixed" }), _jsx("span", { children: "Share My Location" })] })) }), locationStatus === 'success' && formData.address.coordinates.lat !== 0 && (_jsxs("div", { className: "mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-green-400 mb-1", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "check_circle" }), _jsx("span", { className: "font-medium", children: "Location captured successfully!" })] }), _jsxs("div", { className: "text-xs text-gray-200 ml-7", children: ["Coordinates: ", formData.address.coordinates.lat.toFixed(6), ", ", formData.address.coordinates.lng.toFixed(6)] })] })), locationError && (_jsxs("div", { className: "mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg", children: [_jsxs("div", { className: "flex items-start gap-2 text-sm text-red-400 mb-2", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "error" }), _jsx("span", { children: locationError })] }), _jsx("p", { className: "text-xs text-slate-400", children: "Please allow location access in your browser settings and try again. This is required for users to find you on the map." })] })), !locationError && locationStatus === 'idle' && (_jsx("p", { className: "mt-2 text-xs text-slate-400", children: "\uD83D\uDCA1 Click the button and allow location access when your browser asks" }))] })] }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: ["Street Address ", _jsx("span", { className: "text-cyan-400", children: "*" })] }), _jsx("input", { type: "text", name: "street", value: formData.address.street, onChange: handleAddressChange, className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all", required: true })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: ["City ", _jsx("span", { className: "text-cyan-400", children: "*" })] }), _jsx("input", { type: "text", name: "city", value: formData.address.city, onChange: handleAddressChange, className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all", required: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: ["State ", _jsx("span", { className: "text-cyan-400", children: "*" })] }), _jsx("input", { type: "text", name: "state", value: formData.address.state, onChange: handleAddressChange, className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all", required: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-200 mb-2", children: ["ZIP Code ", _jsx("span", { className: "text-cyan-400", children: "*" })] }), _jsx("input", { type: "text", name: "zipCode", value: formData.address.zipCode, onChange: handleAddressChange, className: "w-full px-4 py-2.5 bg-[#0f1823] border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all", required: true })] })] })] })] }), _jsxs("div", { className: "pb-6", children: [_jsxs("h2", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-blue-400", children: "build" }), "Services Offered"] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: serviceOptions.map(service => (_jsxs("label", { className: `flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.services.includes(service)
                                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                                                        : 'bg-[#0f1823] border-cyan-500/20 text-gray-200 hover:bg-cyan-500/10 hover:border-cyan-500/40'}`, children: [_jsx("input", { type: "checkbox", checked: formData.services.includes(service), onChange: () => handleServiceToggle(service), className: "mr-2 w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500 bg-[#0f1823] border-cyan-500/30" }), _jsx("span", { className: "text-sm font-medium", children: service })] }, service))) })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-6", children: [_jsx("button", { type: "button", onClick: () => window.history.back(), className: "px-6 py-2.5 border border-cyan-500/30 rounded-lg text-gray-200 hover:bg-cyan-500/10 transition-all", children: "Cancel" }), _jsx("button", { type: "submit", disabled: loading, className: "px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-cyan-500/20", children: loading ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(Loader, { size: "sm", color: "white" }), "Submitting..."] })) : ('Submit Registration') })] })] }), _jsxs("div", { className: "mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg", children: [_jsxs("h3", { className: "font-semibold text-cyan-400 mb-2 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "info" }), "Important Information"] }), _jsxs("ul", { className: "text-sm text-gray-200 space-y-1 list-disc list-inside ml-1", children: [_jsx("li", { children: "Your registration will be reviewed by our admin team" }), _jsx("li", { children: "Verification typically takes 2-3 business days" }), _jsx("li", { children: "You'll receive an email notification once approved" }), _jsx("li", { children: "Ensure all documents and information are accurate" })] })] })] })] })] }));
};
export default PartnerRegistration;
