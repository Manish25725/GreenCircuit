import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import NotificationBell from '../components/NotificationBell.jsx';
import { api, getCurrentUser } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
const Rewards = () => {
    const navigate = useNavigate();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All Rewards');
    const [user, setUser] = useState(getCurrentUser());
    const categories = ['All Rewards', 'Gift Cards', 'Donations', 'Lifestyle', 'Electronics'];
    useEffect(() => {
        loadRewards();
        loadUserData();
    }, [selectedCategory]);
    const loadRewards = async () => {
        setLoading(true);
        try {
            const result = await api.getRewards(selectedCategory === 'All Rewards' ? undefined : selectedCategory);
            setRewards(result.rewards || []);
        }
        catch (error) {
        }
        finally {
            setLoading(false);
        }
    };
    const loadUserData = async () => {
        try {
            const userData = await api.getMe();
            setUser(userData);
        }
        catch (error) {
        }
    };
    const handleRedeem = async (rewardId, pointsCost) => {
        if ((user?.ecoPoints || 0) < pointsCost) {
            alert('Not enough points!');
            return;
        }
        try {
            await api.redeemReward(rewardId);
            alert('Reward redeemed successfully!');
            loadUserData();
            loadRewards();
        }
        catch (error) {
            alert(error.message || 'Failed to redeem reward');
        }
    };
    const iconMap = {
        'Gift Cards': 'card_giftcard',
        'Donations': 'volunteer_activism',
        'Lifestyle': 'spa',
        'Electronics': 'devices',
        'Other': 'redeem'
    };
    const colorMap = {
        'Gift Cards': 'bg-orange-500',
        'Donations': 'bg-green-600',
        'Lifestyle': 'bg-purple-500',
        'Electronics': 'bg-blue-500',
        'Other': 'bg-gray-500'
    };
    return (_jsx(Layout, { title: "", role: "User", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-[#0B1116] font-sans text-gray-200 antialiased selection:bg-[#10b981] selection:text-white min-h-screen flex flex-col relative overflow-hidden", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-[#10b981]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("header", { className: "flex items-center justify-between whitespace-nowrap border-b border-white/5 px-4 sm:px-6 lg:px-10 py-4 bg-[#0B1116]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300", children: [_jsxs("div", { className: "flex items-center gap-3 text-white cursor-pointer", onClick: () => navigate('/dashboard'), children: [_jsx("div", { className: "p-2 bg-[#10b981]/10 rounded-lg", children: _jsx("svg", { className: "h-6 w-6 text-[#10b981]", fill: "currentColor", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" }) }) }), _jsxs("h2", { className: "text-xl font-bold tracking-tight text-white", children: ["EcoCycle ", _jsx("span", { className: "text-[#10b981] font-semibold", children: "Resident" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative group", children: [_jsxs("button", { onClick: () => navigate('/profile'), className: "hidden sm:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-[#151F26] border border-white/5 hover:bg-white/5 transition-colors cursor-pointer", children: [_jsx("div", { className: "size-8 rounded-full bg-cover bg-center ring-2 ring-white/10 group-hover:ring-[#10b981]/50 transition-all", style: { backgroundImage: `url("${user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")` } }), _jsx("span", { className: "text-sm font-medium text-gray-200", children: user?.name || 'User' })] }), _jsx("div", { className: "absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]", children: _jsx("div", { className: "bg-[#151F26] border border-white/5 rounded-2xl p-4 shadow-2xl", children: _jsx("div", { className: "size-32 rounded-xl bg-cover bg-center ring-4 ring-[#10b981]/30", style: { backgroundImage: `url("${user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=10b981&color=fff'}")` } }) }) })] }), _jsx(NotificationBell, {})] })] }), _jsxs("main", { className: "flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 mt-20 relative z-10", children: [_jsxs("button", { onClick: () => window.history.back(), className: "flex items-center gap-2 text-[#10b981] hover:text-[#059669] transition-colors mb-6 group w-fit", children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "arrow_back" }), _jsx("span", { className: "text-sm font-medium", children: "Back to Dashboard" })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Rewards Marketplace" }), _jsx("p", { className: "text-[#94a3b8]", children: "Redeem your Eco Points for exciting rewards." })] }), _jsxs("div", { className: "bg-gradient-to-r from-green-500 to-emerald-700 rounded-2xl p-8 mb-8 text-white flex flex-col md:flex-row justify-between items-center shadow-lg shadow-green-900/20", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-sm font-medium opacity-90 mb-1", children: "Available Balance" }), _jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "text-5xl font-black tracking-tight", children: (user?.ecoPoints || 0).toLocaleString() }), _jsx("span", { className: "text-xl font-medium", children: "Points" })] })] }), _jsxs("div", { className: "mt-6 md:mt-0 flex gap-4", children: [_jsx("button", { className: "bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-bold transition-all border border-white/5 cursor-pointer", children: "History" }), _jsx("button", { onClick: () => navigate('/search'), className: "bg-white text-green-800 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all cursor-pointer", children: "Earn More" })] })] }), _jsx("div", { className: "flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide", children: categories.map((cat) => (_jsx("button", { onClick: () => setSelectedCategory(cat), className: `px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === cat
                                    ? 'bg-[#10b981] text-white'
                                    : 'bg-[#151F26] border border-white/5 text-[#94a3b8] hover:text-white hover:border-white/20'}`, children: cat }, cat))) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: loading ? (_jsx("div", { className: "col-span-4 flex items-center justify-center py-12", children: _jsx(Loader, { size: "md", color: "#10b981" }) })) : rewards.length === 0 ? (_jsxs("div", { className: "col-span-4 text-center py-12 text-gray-500", children: [_jsx("span", { className: "material-symbols-outlined text-4xl mb-2", children: "redeem" }), _jsx("p", { children: "No rewards available" })] })) : (rewards.map((reward) => (_jsxs("div", { className: "bg-[#151F26] border border-white/5 rounded-xl overflow-hidden hover:border-[#10b981]/50 transition-colors group flex flex-col", children: [_jsx("div", { className: `h-32 ${reward.color || colorMap[reward.category] || 'bg-gray-500'} flex items-center justify-center text-white/90`, children: _jsx("span", { className: "material-symbols-outlined text-6xl group-hover:scale-110 transition-transform", children: reward.icon || iconMap[reward.category] || 'redeem' }) }), _jsxs("div", { className: "p-5 flex-1 flex flex-col", children: [_jsx("h3", { className: "font-bold text-white text-lg mb-1", children: reward.title }), _jsx("p", { className: "text-slate-400 text-sm mb-2 line-clamp-2", children: reward.description }), _jsxs("p", { className: "text-[#10b981] font-bold text-sm mb-4", children: [reward.pointsCost.toLocaleString(), " Points"] }), _jsx("button", { onClick: () => handleRedeem(reward._id, reward.pointsCost), disabled: (user?.ecoPoints || 0) < reward.pointsCost, className: `w-full mt-auto py-2 rounded-lg font-medium transition-colors border cursor-pointer ${(user?.ecoPoints || 0) >= reward.pointsCost
                                                    ? 'bg-white/5 text-white hover:bg-[#10b981] hover:text-white border-white/5 hover:border-transparent'
                                                    : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'}`, children: (user?.ecoPoints || 0) >= reward.pointsCost ? 'Redeem' : 'Not enough points' })] })] }, reward._id)))) })] })] }) }));
};
export default Rewards;
