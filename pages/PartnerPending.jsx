import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import Loader from '../components/Loader.jsx';
import { useNavigate } from 'react-router-dom';
const PartnerPending = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [agency, setAgency] = useState(null);
    const [status, setStatus] = useState('pending');
    const [rejectionReason, setRejectionReason] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        checkRegistrationStatus();
    }, []);
    const checkRegistrationStatus = async () => {
        try {
            setRefreshing(true);
            const response = await api.get('/agencies/dashboard/me');
            const responseData = response.data?.data || response.data;
            const currentStatus = responseData?.status || 'pending';
            setStatus(currentStatus);
            setAgency(responseData?.agency);
            if (currentStatus === 'rejected') {
                setRejectionReason(responseData?.rejectionReason || '');
            }
            else if (currentStatus === 'approved') {
                // If approved, redirect to agency dashboard
                navigate('/agency');
            }
        }
        catch (error) {
            // If no agency found, redirect to registration
            if (error.response?.status === 404) {
                navigate('/partner/register');
            }
            else if (error.response?.status === 401 || error.response?.status === 403) {
                // Not authenticated, redirect to login
                navigate('/login');
            }
            // For other errors, just show the pending UI
        }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    };
    const handleContactSupport = () => {
        navigate('/contact');
    };
    const getTrackerSteps = () => {
        const steps = [
            {
                id: 1,
                title: 'Application Received',
                description: 'We have received your partner registration request',
                icon: 'inbox',
                status: 'completed'
            },
            {
                id: 2,
                title: 'Documents Under Review',
                description: 'Our team is verifying your GST, Udyam & business credentials',
                icon: 'fact_check',
                status: status === 'pending' ? 'current' : status === 'approved' ? 'completed' : 'failed'
            },
            {
                id: 3,
                title: 'Awaiting Approval',
                description: 'Your application is being reviewed by our verification team',
                icon: 'hourglass_top',
                status: status === 'pending' ? 'pending' : status === 'approved' ? 'completed' : 'failed'
            },
            {
                id: 4,
                title: status === 'rejected' ? 'Application Declined' : 'Partnership Confirmed',
                description: status === 'rejected' ? 'Unfortunately, your application could not be approved' : 'Congratulations! You are now an EcoCycle Partner',
                icon: status === 'rejected' ? 'cancel' : 'verified',
                status: status === 'approved' ? 'completed' : status === 'rejected' ? 'failed' : 'pending'
            }
        ];
        return steps;
    };
    if (loading) {
        return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] flex items-center justify-center", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "text-center relative z-10", children: [_jsx(Loader, { size: "lg", color: "#06b6d4", className: "mb-4" }), _jsx("p", { className: "text-gray-200", children: "Loading application status..." })] })] }));
    }
    if (status === 'rejected') {
        return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] font-sans text-gray-100 py-12 px-4", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-red-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-orange-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "max-w-3xl mx-auto relative z-10", children: [_jsx("div", { className: "text-center mb-8", children: _jsx("div", { className: "inline-flex items-center gap-3 mb-6 cursor-pointer", onClick: () => navigate('/'), children: _jsx("div", { className: "p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg", children: _jsx("svg", { className: "h-8 w-8 text-white", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }) }) }), _jsxs("div", { className: "bg-[#1a2332]/90 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 shadow-2xl", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/50", children: _jsx("span", { className: "material-symbols-outlined text-5xl text-red-400", children: "cancel" }) }), _jsx("h1", { className: "text-3xl font-bold mb-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent", children: "Application Rejected" }), _jsx("p", { className: "text-slate-400 text-lg", children: "Unfortunately, your partner registration has been rejected." })] }), rejectionReason && (_jsx("div", { className: "mb-6 p-5 bg-red-500/10 border border-red-500/30 rounded-xl", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "material-symbols-outlined text-red-400 mt-0.5", children: "error" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-red-400 mb-2", children: "Reason for Rejection" }), _jsx("p", { className: "text-gray-200", children: rejectionReason })] })] }) })), agency && (_jsxs("div", { className: "mb-6 p-5 bg-[#0f1823] border border-cyan-500/20 rounded-xl", children: [_jsxs("h3", { className: "font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-cyan-400", children: "info" }), "Your Submission Details"] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-1", children: "Agency Name" }), _jsx("span", { className: "text-white font-medium", children: agency.name })] }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-1", children: "Email" }), _jsx("span", { className: "text-white font-medium", children: agency.email })] }), agency.gstNumber && (_jsxs("div", { children: [_jsx("span", { className: "text-slate-400 block mb-1", children: "GST Number" }), _jsx("span", { className: "text-white font-medium", children: agency.gstNumber })] }))] })] })), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: handleContactSupport, className: "w-full px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined", children: "support_agent" }), "Contact Support"] }), _jsx("button", { onClick: () => navigate('/'), className: "w-full px-6 py-3.5 border border-cyan-500/30 text-gray-200 rounded-xl hover:bg-cyan-500/10 transition-all", children: "Return to Home" })] }), _jsx("div", { className: "mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl", children: _jsxs("p", { className: "text-sm text-yellow-200 flex items-start gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-lg mt-0.5", children: "lightbulb" }), _jsxs("span", { children: [_jsx("strong", { children: "Need Help?" }), " Please contact our support team to understand the rejection reason. You may resubmit your application after addressing the issues."] })] }) })] })] })] }));
    }
    // Pending status - Show Tracker
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] font-sans text-gray-100 py-12 px-4", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "max-w-4xl mx-auto relative z-10", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center gap-3 mb-6 cursor-pointer", onClick: () => navigate('/'), children: _jsx("div", { className: "p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg", children: _jsx("svg", { className: "h-8 w-8 text-white", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }) }), _jsx("h1", { className: "text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent", children: "Application Status Tracker" }), _jsx("p", { className: "text-slate-400 text-lg", children: "Track the progress of your partner registration application" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-[#1a2332]/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-3 bg-yellow-500/20 rounded-xl animate-pulse", children: _jsx("span", { className: "material-symbols-outlined text-yellow-400 text-2xl", children: "pending" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "Verification In Progress" }), _jsx("p", { className: "text-slate-400 text-sm", children: "We're reviewing your application \u2022 Usually takes 24-48 hours" })] })] }), _jsxs("button", { onClick: checkRegistrationStatus, disabled: refreshing, className: "px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-all flex items-center gap-2 text-sm", children: [_jsx("span", { className: `material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`, children: refreshing ? 'progress_activity' : 'refresh' }), "Check Status"] })] }), _jsx("div", { className: "relative", children: getTrackerSteps().map((step, index) => (_jsxs("div", { className: "flex gap-4 mb-6 last:mb-0", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                        ${step.status === 'completed' ? 'bg-green-500/20 border-green-500 text-green-400' : ''}
                        ${step.status === 'current' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 animate-pulse' : ''}
                        ${step.status === 'pending' ? 'bg-gray-500/10 border-gray-600 text-gray-500' : ''}
                        ${step.status === 'failed' ? 'bg-red-500/20 border-red-500 text-red-400' : ''}
                      `, children: _jsx("span", { className: "material-symbols-outlined text-xl", children: step.icon }) }), index < getTrackerSteps().length - 1 && (_jsx("div", { className: `w-0.5 h-16 mt-2 ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-700'}` }))] }), _jsxs("div", { className: "flex-1 pt-2", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: `font-semibold ${step.status === 'completed' ? 'text-green-400' :
                                                                            step.status === 'current' ? 'text-yellow-400' :
                                                                                step.status === 'failed' ? 'text-red-400' :
                                                                                    'text-gray-500'}`, children: step.title }), step.status === 'current' && (_jsx("span", { className: "px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs text-yellow-400", children: "In Progress" }))] }), _jsx("p", { className: `text-sm ${step.status === 'pending' ? 'text-gray-600' : 'text-slate-400'}`, children: step.description })] })] }, step.id))) })] }) }), _jsxs("div", { className: "space-y-6", children: [agency && (_jsxs("div", { className: "bg-[#1a2332]/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-2xl", children: [_jsxs("h3", { className: "font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-cyan-400", children: "description" }), "Application Details"] }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-white/5", children: [_jsx("span", { className: "text-slate-400", children: "Agency Name" }), _jsx("span", { className: "text-white font-medium", children: agency.name })] }), _jsxs("div", { className: "flex justify-between items-center py-2 border-b border-white/5", children: [_jsx("span", { className: "text-slate-400", children: "Email" }), _jsx("span", { className: "text-white font-medium text-right", children: agency.email })] }), agency.gstNumber && (_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-white/5", children: [_jsx("span", { className: "text-slate-400", children: "GST Number" }), _jsx("span", { className: "text-white font-medium", children: agency.gstNumber })] })), agency.submittedAt && (_jsxs("div", { className: "flex justify-between items-center py-2", children: [_jsx("span", { className: "text-slate-400", children: "Submitted" }), _jsx("span", { className: "text-white font-medium", children: new Date(agency.submittedAt).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                }) })] }))] })] })), _jsxs("div", { className: "bg-[#1a2332]/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-2xl", children: [_jsxs("h3", { className: "font-bold text-white mb-4 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-blue-400", children: "tips_and_updates" }), "What's Next?"] }), _jsxs("ul", { className: "space-y-3 text-sm", children: [_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-cyan-400 text-lg mt-0.5", children: "check_circle" }), _jsx("span", { className: "text-gray-200", children: "You'll receive an email once approved" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-cyan-400 text-lg mt-0.5", children: "check_circle" }), _jsx("span", { className: "text-gray-200", children: "Access your partner dashboard" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-cyan-400 text-lg mt-0.5", children: "check_circle" }), _jsx("span", { className: "text-gray-200", children: "Start managing pickup requests" })] }), _jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-cyan-400 text-lg mt-0.5", children: "check_circle" }), _jsx("span", { className: "text-gray-200", children: "Grow your recycling business" })] })] })] }), _jsxs("div", { className: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6", children: [_jsxs("h3", { className: "font-bold text-white mb-2 flex items-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-cyan-400", children: "help" }), "Need Help?"] }), _jsx("p", { className: "text-slate-400 text-sm mb-4", children: "Have questions about your application? Our support team is here to help." }), _jsxs("button", { onClick: handleContactSupport, className: "w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium text-sm flex items-center justify-center gap-2", children: [_jsx("span", { className: "material-symbols-outlined text-lg", children: "support_agent" }), "Contact Support"] })] })] })] }), _jsx("div", { className: "text-center mt-8", children: _jsxs("button", { onClick: () => navigate('/'), className: "text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto", children: [_jsx("span", { className: "material-symbols-outlined", children: "arrow_back" }), "Return to Home"] }) })] })] }));
};
export default PartnerPending;
