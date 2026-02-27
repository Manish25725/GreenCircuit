import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import ComplianceCertificate from '../components/ComplianceCertificate.jsx';
import { getCurrentUser, api } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const BusinessCertificates = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [stats, setStats] = useState({ totalCertificates: 0, totalWeight: 0, totalCo2Saved: 0 });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchCertificates();
    }, []);
    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const response = await api.getBusinessCertificates({ page: 1, limit: 100 });
            if (response) {
                // Handle multiple response formats
                // The API returns: { success: true, data: { certificates: [], stats: {}, pagination: {} } }
                // After apiRequest processes it, we get: { certificates: [], stats: {}, pagination: {} }
                let certs = [];
                let statsData = { totalCertificates: 0, totalWeight: 0, totalCo2Saved: 0 };
                // Direct format (after apiRequest extraction)
                if (response.certificates) {
                    certs = response.certificates;
                    statsData = response.stats || statsData;
                }
                // Nested data format
                else if (response.data?.certificates) {
                    certs = response.data.certificates;
                    statsData = response.data.stats || statsData;
                }
                // Array format
                else if (Array.isArray(response)) {
                    certs = response;
                }
                setCertificates(certs);
                setStats(statsData);
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    const handleDownloadCertificate = async (certId, certNumber) => {
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to download certificates');
                return;
            }
            const response = await fetch(`${API_BASE}/business/certificates/${certId}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to download certificate' }));
                throw new Error(errorData.error || errorData.message || 'Failed to download certificate');
            }
            // Get the PDF blob
            const blob = await response.blob();
            if (blob.size === 0) {
                throw new Error('Downloaded file is empty');
            }
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificate-${certNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        }
        catch (error) {
            alert(error.message || 'Failed to download certificate. Please try again.');
        }
    };
    const filteredCertificates = certificates.filter(cert => {
        const matchesSearch = cert.certificateId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.agencyId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    const getDisplayStatus = (cert) => {
        // Check if certificate is expired
        if (cert.validUntil && new Date(cert.validUntil) < new Date()) {
            return 'expired';
        }
        if (cert.status === 'issued')
            return 'verified';
        if (cert.status === 'revoked')
            return 'revoked';
        return 'expired';
    };
    const displayStats = {
        total: stats.totalCertificates,
        verified: certificates.filter(c => c.status === 'issued' && (!c.validUntil || new Date(c.validUntil) >= new Date())).length,
        pending: 0, // No pending status in BusinessCertificate model
        totalWeight: Math.round(stats.totalWeight || 0)
    };
    const getStatusStyle = (status) => {
        switch (status) {
            case 'verified':
            case 'issued': return 'bg-[#10b981]/10 text-[#10b981]';
            case 'pending': return 'bg-amber-500/10 text-amber-400';
            case 'expired':
            case 'revoked': return 'bg-red-500/10 text-red-400';
            default: return 'bg-gray-500/10 text-slate-400';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'verified':
            case 'issued': return 'verified';
            case 'pending': return 'hourglass_empty';
            case 'expired':
            case 'revoked': return 'error';
            default: return 'help';
        }
    };
    const getTypeDisplay = (type) => {
        const types = {
            'recycling': 'Recycling',
            'destruction': 'Data Destruction',
            'donation': 'Donation',
            'refurbishment': 'Refurbishment',
            'compliance': 'Compliance Certificate'
        };
        return types[type] || type;
    };
    const getTypeIcon = (type) => {
        const icons = {
            'recycling': 'recycling',
            'destruction': 'delete_forever',
            'donation': 'volunteer_activism',
            'refurbishment': 'build',
            'compliance': 'verified_user'
        };
        return icons[type] || 'description';
    };
    const getTypeColor = (type) => {
        const colors = {
            'recycling': 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30',
            'destruction': 'bg-red-500/10 text-red-400 border-red-500/30',
            'donation': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
            'refurbishment': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            'compliance': 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        };
        return colors[type] || 'bg-gray-500/10 text-slate-400 border-gray-500/30';
    };
    return (_jsx(Layout, { title: "", role: "Business", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#06b6d4] selection:text-white min-h-screen", children: [_jsxs("div", { className: "relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#06b6d4]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "layout-container flex h-full grow flex-col relative z-10", children: [_jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "p-2 bg-[#06b6d4]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#06b6d4]", fill: "currentColor", viewBox: "0 0 48 48", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#06b6d4]", children: "Business" })] })] }), _jsx("nav", { className: "hidden md:flex flex-1 justify-center gap-1" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-[#06b6d4] flex items-center justify-center ring-2 ring-white/10 group-hover:ring-[#06b6d4]/50 transition-all text-white font-bold text-sm", children: user?.name?.charAt(0) || 'B' }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.name || 'Business' })] }), _jsx("button", { onClick: handleLogout, className: "p-2.5 rounded-full bg-[#151F26] border border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors", title: "Logout", children: _jsx("span", { className: "material-symbols-outlined text-[20px]", children: "logout" }) })] })] }), _jsx("main", { className: "flex flex-1 justify-center py-5 mt-24", children: _jsxs("div", { className: "layout-content-container flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8", children: [_jsx("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-8", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("button", { onClick: () => navigate('/business'), className: "text-[#94a3b8] hover:text-white transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "arrow_back" }) }), _jsx("p", { className: "text-[#10b981] text-sm font-bold uppercase tracking-widest", children: "Compliance & Documentation" })] }), _jsx("h1", { className: "text-white text-3xl sm:text-4xl font-black leading-tight tracking-tighter mb-2", children: "Disposal Certificates" }), _jsx("p", { className: "text-[#94a3b8] text-base", children: "View and download your verified disposal certificates." })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#06b6d4]/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "flex items-center justify-between mb-4 relative z-10", children: _jsx("div", { className: "p-3 bg-[#06b6d4]/10 rounded-xl text-[#06b6d4]", children: _jsx("span", { className: "material-symbols-outlined", children: "description" }) }) }), _jsx("h3", { className: "text-3xl font-black text-white relative z-10", children: displayStats.total }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "Total Certificates" })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#10b981]/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "flex items-center justify-between mb-4 relative z-10", children: _jsx("div", { className: "p-3 bg-[#10b981]/10 rounded-xl text-[#10b981]", children: _jsx("span", { className: "material-symbols-outlined", children: "verified" }) }) }), _jsx("h3", { className: "text-3xl font-black text-white relative z-10", children: displayStats.verified }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "Verified" })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#8b5cf6]/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "flex items-center justify-between mb-4 relative z-10", children: _jsx("div", { className: "p-3 bg-[#8b5cf6]/10 rounded-xl text-[#8b5cf6]", children: _jsx("span", { className: "material-symbols-outlined", children: "eco" }) }) }), _jsxs("h3", { className: "text-3xl font-black text-white relative z-10", children: [Math.round(stats.totalCo2Saved || 0), " ", _jsx("span", { className: "text-lg font-medium text-gray-500", children: "kg" })] }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "CO\u2082 Saved" })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-[#06b6d4]/20 transition-all", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" }), _jsx("div", { className: "flex items-center justify-between mb-4 relative z-10", children: _jsx("div", { className: "p-3 bg-[#06b6d4]/10 rounded-xl text-[#06b6d4]", children: _jsx("span", { className: "material-symbols-outlined", children: "scale" }) }) }), _jsxs("h3", { className: "text-3xl font-black text-white relative z-10", children: [displayStats.totalWeight, " ", _jsx("span", { className: "text-lg font-medium text-gray-500", children: "kg" })] }), _jsx("p", { className: "text-sm text-[#94a3b8] relative z-10", children: "Certified Weight" })] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-8", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx("span", { className: "material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500", children: "search" }), _jsx("input", { type: "text", placeholder: "Search by certificate number, type, or agency...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full bg-[#151F26] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none transition-all" })] }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "bg-[#151F26] border border-white/5 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] outline-none cursor-pointer", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "issued", children: "Verified" }), _jsx("option", { value: "expired", children: "Expired" }), _jsx("option", { value: "revoked", children: "Revoked" })] })] }), _jsxs("div", { className: "bg-[#151F26] rounded-2xl border border-white/5 overflow-hidden", children: [_jsxs("div", { className: "hidden md:grid grid-cols-6 gap-4 p-4 border-b border-white/5 text-sm font-medium text-gray-500", children: [_jsx("div", { children: "Certificate #" }), _jsx("div", { children: "Date" }), _jsx("div", { children: "Type" }), _jsx("div", { children: "Weight" }), _jsx("div", { children: "Agency" }), _jsx("div", { className: "text-center", children: "Actions" })] }), loading ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx(Loader, { size: "md", color: "#06b6d4", className: "mb-4" }), _jsx("p", { className: "text-slate-400", children: "Loading certificates..." })] })) : filteredCertificates.length === 0 ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx("span", { className: "material-symbols-outlined text-5xl text-gray-600 mb-4", children: "description" }), _jsx("p", { className: "text-slate-400 text-lg", children: "No certificates found" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: certificates.length === 0
                                                                    ? "Certificates are issued when your pickups are completed"
                                                                    : "Try adjusting your search or filters" })] })) : (filteredCertificates.map((cert) => {
                                                        const displayStatus = getDisplayStatus(cert);
                                                        return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors items-center", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-2 rounded-lg ${getStatusStyle(displayStatus)}`, children: _jsx("span", { className: "material-symbols-outlined text-lg", children: getStatusIcon(displayStatus) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white font-semibold", children: cert.certificateId }), _jsx("span", { className: `inline-block md:hidden text-xs px-2 py-0.5 rounded-full ${getStatusStyle(displayStatus)} mt-1`, children: displayStatus === 'verified' ? 'Verified' : displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1) })] })] }), _jsxs("div", { className: "text-slate-400", children: [_jsx("span", { className: "md:hidden text-gray-600 text-sm mr-2", children: "Date:" }), new Date(cert.issuedAt || cert.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })] }), _jsxs("div", { children: [_jsx("span", { className: "md:hidden text-gray-600 text-sm mr-2", children: "Type:" }), _jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(cert.type)}`, children: [_jsx("span", { className: "material-symbols-outlined text-sm", children: getTypeIcon(cert.type) }), getTypeDisplay(cert.type)] })] }), _jsxs("div", { className: "text-white font-medium", children: [_jsx("span", { className: "md:hidden text-gray-600 text-sm mr-2", children: "Weight:" }), cert.totalWeight, " kg"] }), _jsxs("div", { className: "text-slate-400", children: [_jsx("span", { className: "md:hidden text-gray-600 text-sm mr-2", children: "Agency:" }), cert.agencyId?.name || cert.issuedBy?.name || 'N/A'] }), _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { onClick: () => setSelectedCertificate(cert), className: "p-2 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4] hover:bg-[#06b6d4]/20 transition-colors", title: "View Certificate", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "visibility" }) }), displayStatus === 'verified' && (_jsx("button", { onClick: () => handleDownloadCertificate(cert._id, cert.certificateId), className: "p-2 rounded-lg bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 transition-colors", title: "Download PDF", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "download" }) }))] })] }, cert._id));
                                                    }))] }), _jsx("div", { className: "mt-8 p-6 bg-gradient-to-r from-amber-500/10 to-[#10b981]/10 rounded-2xl border border-amber-500/20", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-3 bg-amber-500/20 rounded-xl", children: _jsx("span", { className: "material-symbols-outlined text-amber-400 text-2xl", children: "verified_user" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-white font-bold text-lg mb-1", children: "Compliance Certificates" }), _jsx("p", { className: "text-slate-400 text-sm", children: "All your compliance certificates are automatically generated when pickups are completed. These certificates verify proper e-waste disposal according to EPA guidelines, ISO 14001, R2, and e-Stewards standards. Use them for environmental audits, sustainability reporting, and regulatory compliance." })] })] }) })] }) })] })] }), selectedCertificate && (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4", onClick: () => setSelectedCertificate(null), children: _jsxs("div", { className: "bg-[#151F26] rounded-3xl w-full max-w-2xl border border-white/5 overflow-hidden max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#151F26]", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-2 rounded-lg ${getStatusStyle(getDisplayStatus(selectedCertificate))}`, children: _jsx("span", { className: "material-symbols-outlined", children: getStatusIcon(getDisplayStatus(selectedCertificate)) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-white font-bold text-lg", children: selectedCertificate.certificateId }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full ${getStatusStyle(getDisplayStatus(selectedCertificate))}`, children: getDisplayStatus(selectedCertificate) === 'verified' ? 'Verified' : getDisplayStatus(selectedCertificate).charAt(0).toUpperCase() + getDisplayStatus(selectedCertificate).slice(1) })] })] }), _jsx("button", { onClick: () => setSelectedCertificate(null), className: "p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white", children: _jsx("span", { className: "material-symbols-outlined", children: "close" }) })] }), _jsx("div", { className: "p-8", children: selectedCertificate.type === 'compliance' ? (
                                /* Show the official compliance certificate with stamps */
                                _jsx(ComplianceCertificate, { certificate: selectedCertificate })) : (
                                /* Show regular certificate preview for other types */
                                _jsxs(_Fragment, { children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-block p-4 bg-[#10b981]/10 rounded-full mb-4", children: _jsx("span", { className: "material-symbols-outlined text-[#10b981] text-5xl", children: getTypeIcon(selectedCertificate.type) }) }), _jsx("h2", { className: "text-2xl font-black text-white mb-2", children: selectedCertificate.title }), _jsxs("span", { className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getTypeColor(selectedCertificate.type)}`, children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: getTypeIcon(selectedCertificate.type) }), getTypeDisplay(selectedCertificate.type)] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { className: "bg-white/5 rounded-xl p-4", children: [_jsx("p", { className: "text-gray-500 text-sm mb-1", children: "Date Issued" }), _jsx("p", { className: "text-white font-semibold", children: new Date(selectedCertificate.issuedAt || selectedCertificate.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) })] }), _jsxs("div", { className: "bg-white/5 rounded-xl p-4", children: [_jsx("p", { className: "text-gray-500 text-sm mb-1", children: "Valid Until" }), _jsx("p", { className: "text-white font-semibold", children: selectedCertificate.validUntil
                                                                ? new Date(selectedCertificate.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                                                : 'N/A' })] }), _jsxs("div", { className: "bg-white/5 rounded-xl p-4", children: [_jsx("p", { className: "text-gray-500 text-sm mb-1", children: "Total Weight" }), _jsxs("p", { className: "text-white font-semibold", children: [selectedCertificate.totalWeight, " kg"] })] }), _jsxs("div", { className: "bg-white/5 rounded-xl p-4", children: [_jsx("p", { className: "text-gray-500 text-sm mb-1", children: "CO\u2082 Saved" }), _jsxs("p", { className: "text-[#10b981] font-semibold", children: [Math.round(selectedCertificate.co2Saved || 0), " kg"] })] }), _jsxs("div", { className: "bg-white/5 rounded-xl p-4", children: [_jsx("p", { className: "text-gray-500 text-sm mb-1", children: "Disposal Method" }), _jsx("p", { className: "text-white font-semibold", children: selectedCertificate.disposalMethod || 'Certified Recycling' })] }), _jsxs("div", { className: "bg-white/5 rounded-xl p-4", children: [_jsx("p", { className: "text-gray-500 text-sm mb-1", children: "Issued By" }), _jsx("p", { className: "text-white font-semibold", children: selectedCertificate.agencyId?.name || selectedCertificate.issuedBy?.name }), selectedCertificate.issuedBy?.designation && (_jsx("p", { className: "text-gray-500 text-xs", children: selectedCertificate.issuedBy.designation }))] })] }), selectedCertificate.items && selectedCertificate.items.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-white font-bold mb-3", children: "Items Recycled" }), _jsx("div", { className: "bg-white/5 rounded-xl overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-white/5", children: _jsxs("tr", { className: "text-gray-500 text-sm", children: [_jsx("th", { className: "text-left p-3", children: "Item" }), _jsx("th", { className: "text-left p-3", children: "Category" }), _jsx("th", { className: "text-right p-3", children: "Qty" }), _jsx("th", { className: "text-right p-3", children: "Weight" })] }) }), _jsx("tbody", { children: selectedCertificate.items.map((item, idx) => (_jsxs("tr", { className: "border-t border-white/5", children: [_jsx("td", { className: "p-3 text-white", children: item.name }), _jsx("td", { className: "p-3 text-slate-400", children: item.category }), _jsx("td", { className: "p-3 text-white text-right", children: item.quantity }), _jsxs("td", { className: "p-3 text-white text-right", children: [item.weight, " kg"] })] }, idx))) })] }) })] })), selectedCertificate.complianceStandards && selectedCertificate.complianceStandards.length > 0 && (_jsxs("div", { className: "mb-6", children: [_jsx("h4", { className: "text-white font-bold mb-3", children: "Compliance Standards" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedCertificate.complianceStandards.map((standard, idx) => (_jsx("span", { className: "px-3 py-1 bg-[#06b6d4]/10 text-[#06b6d4] rounded-full text-sm", children: standard }, idx))) })] })), _jsxs("div", { className: "flex gap-4 mt-6", children: [getDisplayStatus(selectedCertificate) === 'verified' && (_jsxs("button", { onClick: () => handleDownloadCertificate(selectedCertificate._id, selectedCertificate.certificateId), className: "flex-1 bg-[#10b981] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#059669] transition-colors flex items-center justify-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "download" }), "Download PDF"] })), _jsx("button", { onClick: () => setSelectedCertificate(null), className: "flex-1 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors", children: "Close" })] })] })) })] }) }))] }) }));
};
export default BusinessCertificates;
