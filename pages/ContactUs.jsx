import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import Loader from '../components/Loader.jsx';
import { api } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const ContactUs = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus(null);
        try {
            const response = await api.post('/contact', formData);
            setSubmitStatus({
                type: 'success',
                message: 'Your message has been sent successfully! We will get back to you soon.'
            });
            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }
        catch (error) {
            setSubmitStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to send message. Please try again.'
            });
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx("div", { className: "relative flex h-auto min-h-screen w-full flex-col bg-[#0B1116] text-gray-200 font-sans group/design-root overflow-x-hidden selection:bg-[#34D399] selection:text-[#0B1120]", children: _jsxs("div", { className: "layout-container flex h-full grow flex-col", children: [_jsx("header", { className: "sticky top-0 z-50 flex items-center justify-center border-b border-white/5 bg-[#0B1116]/80 backdrop-blur-md px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-3 cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "size-8 text-[#34D399] flex items-center justify-center", children: _jsx("svg", { className: "w-full h-full drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]", fill: "none", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3" }) }) }), _jsx("h2", { className: "text-white text-xl font-black tracking-tight", children: "EcoCycle" })] }) }), _jsx("div", { className: "w-full max-w-[960px] mx-auto px-4 sm:px-10 lg:px-0 pt-6", children: _jsxs("button", { onClick: () => window.history.back(), className: "group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-[#34D399] hover:border-[#34D399]/30 hover:bg-[#34D399]/10 transition-all duration-300 cursor-pointer backdrop-blur-sm", children: [_jsx("svg", { className: "w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }), _jsx("span", { className: "text-sm font-medium", children: "Back" })] }) }), _jsx("main", { className: "flex-1 px-4 py-6 sm:px-10 lg:px-40 lg:py-14", children: _jsxs("div", { className: "mx-auto flex max-w-[960px] flex-col gap-10", children: [_jsxs("div", { className: "flex min-w-72 flex-col gap-3", children: [_jsx("p", { className: "text-white text-4xl font-black leading-tight tracking-tight md:text-5xl", children: "Get in Touch" }), _jsx("p", { className: "text-slate-400 text-base font-normal leading-normal md:text-lg", children: "Have a question or need assistance? We're here to help." })] }), _jsxs("div", { className: "grid grid-cols-1 gap-12 lg:grid-cols-5", children: [_jsxs("div", { className: "flex flex-col gap-8 lg:col-span-3", children: [_jsx("h2", { className: "text-white text-[22px] font-bold leading-tight tracking-tight", children: "Send us a Message" }), submitStatus && (_jsx("div", { className: `p-4 rounded-xl border ${submitStatus.type === 'success'
                                                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                                    : 'bg-red-500/10 border-red-500/30 text-red-400'}`, children: submitStatus.message })), _jsxs("form", { className: "flex flex-col gap-6", onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2", children: [_jsxs("label", { className: "flex flex-col flex-1", children: [_jsx("p", { className: "text-gray-200 text-base font-medium leading-normal pb-2", children: "Full Name" }), _jsx("input", { name: "name", value: formData.name, onChange: handleChange, required: true, className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#34D399] border border-white/5 bg-[#1E293B]/50 h-14 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal transition-all", placeholder: "Enter your full name", type: "text" })] }), _jsxs("label", { className: "flex flex-col flex-1", children: [_jsx("p", { className: "text-gray-200 text-base font-medium leading-normal pb-2", children: "Email Address" }), _jsx("input", { name: "email", value: formData.email, onChange: handleChange, required: true, className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#34D399] border border-white/5 bg-[#1E293B]/50 h-14 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal transition-all", placeholder: "Enter your email address", type: "email" })] })] }), _jsxs("label", { className: "flex flex-col", children: [_jsx("p", { className: "text-gray-200 text-base font-medium leading-normal pb-2", children: "Subject" }), _jsx("input", { name: "subject", value: formData.subject, onChange: handleChange, required: true, className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#34D399] border border-white/5 bg-[#1E293B]/50 h-14 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal transition-all", placeholder: "Enter the subject of your message", type: "text" })] }), _jsxs("label", { className: "flex flex-col", children: [_jsx("p", { className: "text-gray-200 text-base font-medium leading-normal pb-2", children: "Your Message" }), _jsx("textarea", { name: "message", value: formData.message, onChange: handleChange, required: true, className: "flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#34D399] border border-white/5 bg-[#1E293B]/50 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal transition-all", placeholder: "Type your message here...", rows: 6 })] }), _jsx("button", { type: "submit", disabled: submitting, className: "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[#34D399] text-[#0B1120] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#6EE7B7] shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all transform hover:scale-105 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100", children: submitting ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: "sm", color: "#0B1120" }), _jsx("span", { className: "truncate ml-2", children: "Sending..." })] })) : (_jsx("span", { className: "truncate", children: "Send Message" })) })] })] }), _jsxs("div", { className: "flex flex-col gap-8 lg:col-span-2", children: [_jsx("h2", { className: "text-white text-[22px] font-bold leading-tight tracking-tight", children: "Other Ways to Reach Us" }), _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("a", { className: "group flex items-center gap-4", href: "mailto:support@ecocycle.com", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-[#1E293B]/50 border border-white/5 group-hover:border-[#34D399]/50 transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-[#34D399] text-2xl", children: "mail" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("p", { className: "text-slate-500 text-sm uppercase tracking-wider font-bold", children: "Email Us" }), _jsx("p", { className: "text-white font-medium group-hover:text-[#34D399] transition-colors", children: "support@ecocycle.com" })] })] }), _jsxs("a", { className: "group flex items-center gap-4", href: "tel:+1800555ECYC", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-[#1E293B]/50 border border-white/5 group-hover:border-[#34D399]/50 transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-[#34D399] text-2xl", children: "call" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("p", { className: "text-slate-500 text-sm uppercase tracking-wider font-bold", children: "Call Us" }), _jsx("p", { className: "text-white font-medium group-hover:text-[#34D399] transition-colors", children: "+1 (800) 555-ECYC" })] })] })] }), _jsxs("div", { className: "mt-4 rounded-3xl border border-white/5 bg-[#1E293B]/50 p-8", children: [_jsx("h3", { className: "text-white font-bold text-lg", children: "Frequently Asked Questions" }), _jsx("p", { className: "text-slate-400 mt-2 text-sm leading-relaxed", children: "Looking for quick answers? Our FAQ section covers a wide range of topics to help you get the information you need, fast." }), _jsxs("a", { className: "group mt-6 inline-flex items-center gap-2 text-[#34D399] font-bold text-sm hover:underline", href: "#", children: [_jsx("span", { children: "Check out our FAQs" }), _jsx("span", { className: "material-symbols-outlined transition-transform group-hover:translate-x-1", children: "arrow_forward" })] })] })] })] })] }) })] }) }));
};
export default ContactUs;
