import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from 'react';
const PickupCertificate = ({ userName, agencyName, pickupId, wasteWeight, wasteTypes, issueDate, ecoPoints, bookingId }) => {
    const certificateRef = useRef(null);
    // Calculate expiry date (6 months from issue date)
    const getExpiryDate = (issueDate) => {
        const date = new Date(issueDate);
        date.setMonth(date.getMonth() + 6);
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    };
    const handleDownload = async () => {
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to download certificates');
                return;
            }
            if (!bookingId) {
                alert('Booking ID not available');
                return;
            }
            const response = await fetch(`${API_BASE}/certificates/${bookingId}/download`, {
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
            link.download = `certificate-${pickupId}.pdf`;
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
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] py-12 px-4", children: [_jsx("div", { className: "max-w-5xl mx-auto mb-6 flex justify-end no-print", children: _jsxs("button", { onClick: handleDownload, className: "flex items-center gap-2 px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-all shadow-lg hover:shadow-xl", children: [_jsx("span", { className: "material-symbols-outlined", children: "download" }), _jsx("span", { className: "font-semibold", children: "Download Certificate" })] }) }), _jsxs("div", { ref: certificateRef, className: "max-w-5xl mx-auto bg-white p-12 shadow-2xl relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 border-[20px] border-double border-[#10b981] pointer-events-none" }), _jsx("div", { className: "absolute inset-4 border-2 border-[#10b981]/30 pointer-events-none" }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none", children: _jsx("div", { className: "text-[200px] font-bold text-[#10b981] rotate-[-45deg]", children: "VERIFIED" }) }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "text-center mb-8 border-b-4 border-[#10b981] pb-6", children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx("div", { className: "w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center", children: _jsx("span", { className: "material-symbols-outlined text-white text-[48px]", children: "recycling" }) }) }), _jsx("h1", { className: "text-5xl font-bold text-[#0B1116] mb-2", style: { fontFamily: 'Georgia, serif' }, children: "CERTIFICATE OF E-WASTE COLLECTION" }), _jsx("p", { className: "text-xl text-gray-600 italic", children: "Environmental Contribution Recognition" })] }), _jsxs("div", { className: "mb-8 text-center px-8", children: [_jsx("p", { className: "text-lg text-gray-700 mb-6 leading-relaxed", children: "This is to certify that" }), _jsx("h2", { className: "text-4xl font-bold text-[#10b981] mb-6 border-b-2 border-[#10b981]/30 pb-3 inline-block px-8", children: userName }), _jsx("p", { className: "text-lg text-gray-700 mb-6 leading-relaxed", children: "has successfully contributed to environmental sustainability by responsibly disposing of electronic waste through our certified collection service." }), _jsxs("div", { className: "grid grid-cols-2 gap-6 my-8 bg-[#10b981]/5 p-8 rounded-lg border-2 border-[#10b981]/20", children: [_jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Collection ID" }), _jsx("p", { className: "text-lg font-bold text-[#0B1116]", children: pickupId })] }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Total Weight Collected" }), _jsxs("p", { className: "text-lg font-bold text-[#10b981]", children: [wasteWeight, " kg"] })] }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: "Waste Categories" }), _jsx("p", { className: "text-lg font-bold text-[#0B1116]", children: wasteTypes.join(', ') })] }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: "EcoPoints Earned" }), _jsxs("p", { className: "text-lg font-bold text-[#10b981]", children: [ecoPoints, " Points"] })] })] }), _jsx("p", { className: "text-base text-gray-600 leading-relaxed mb-4", children: "This collection was processed through our authorized e-waste management facility, ensuring proper recycling and disposal in compliance with environmental regulations. Your contribution helps prevent toxic materials from entering landfills and conserves natural resources." })] }), _jsxs("div", { className: "mt-12 pt-8 border-t-2 border-[#10b981]/30", children: [_jsxs("div", { className: "grid grid-cols-3 gap-8 items-end", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-gray-500 mb-2", children: "Issue Date" }), _jsx("p", { className: "text-base font-bold text-[#0B1116] border-t-2 border-[#10b981] pt-2", children: formatDate(issueDate) })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-32 h-32 mx-auto border-4 border-[#10b981] rounded-full flex items-center justify-center bg-[#10b981]/5 transform rotate-[-5deg]", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-xs font-bold text-[#10b981] uppercase leading-tight", children: "Certified by" }), _jsx("div", { className: "text-sm font-bold text-[#0B1116] mt-1 leading-tight px-2", children: agencyName }), _jsx("div", { className: "text-[10px] text-gray-600 mt-1", children: "Authorized Agency" })] }) }), _jsx("div", { className: "absolute top-0 right-0 w-20 h-20 border-4 border-red-600 rounded-full flex items-center justify-center bg-red-50 transform rotate-12", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-[10px] font-bold text-red-600", children: "VERIFIED" }), _jsx("div", { className: "text-[8px] text-red-600", children: "OFFICIAL" })] }) })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-gray-500 mb-2", children: "Valid Until" }), _jsx("p", { className: "text-base font-bold text-red-600 border-t-2 border-red-500 pt-2", children: getExpiryDate(issueDate) })] })] }), _jsxs("div", { className: "flex justify-around items-center mt-8 flex-wrap gap-4", children: [_jsx("div", { className: "w-24 h-24 border-3 border-green-600 rounded-lg flex items-center justify-center bg-green-50 transform rotate-[-3deg]", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "material-symbols-outlined text-green-600 text-[32px]", children: "eco" }), _jsx("div", { className: "text-[10px] font-bold text-green-600", children: "ECO FRIENDLY" })] }) }), _jsx("div", { className: "w-24 h-24 border-3 border-blue-600 rounded-full flex items-center justify-center bg-blue-50 transform rotate-[5deg]", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "material-symbols-outlined text-blue-600 text-[32px]", children: "verified_user" }), _jsx("div", { className: "text-[9px] font-bold text-blue-600 leading-tight", children: "GOVT APPROVED" })] }) }), _jsx("div", { className: "w-24 h-24 border-3 border-[#10b981] rounded-lg flex items-center justify-center bg-[#10b981]/10 transform rotate-[-5deg]", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "material-symbols-outlined text-[#10b981] text-[32px]", children: "recycling" }), _jsx("div", { className: "text-[10px] font-bold text-[#10b981]", children: "100% RECYCLED" })] }) }), _jsx("div", { className: "w-24 h-24 border-3 border-purple-600 rounded-full flex items-center justify-center bg-purple-50 transform rotate-[3deg]", children: _jsxs("div", { className: "text-center", children: [_jsx("span", { className: "material-symbols-outlined text-purple-600 text-[32px]", children: "workspace_premium" }), _jsx("div", { className: "text-[9px] font-bold text-purple-600 leading-tight", children: "ISO CERTIFIED" })] }) })] })] }), _jsxs("div", { className: "mt-8 text-center", children: [_jsxs("p", { className: "text-xs text-slate-400", children: ["Certificate ID: CERT-", pickupId, "-", new Date(issueDate).getFullYear()] }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Verify authenticity at www.ecocycle.com/verify" })] })] })] })] }));
};
export default PickupCertificate;
