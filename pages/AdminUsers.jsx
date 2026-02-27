import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { useNavigate } from 'react-router-dom';
const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (roleFilter !== 'all')
                params.role = roleFilter;
            const response = await api.get('/admin/users', { params });
            const userList = response.data?.data?.users || response.data?.users || [];
            setUsers(userList);
        }
        catch (error) {
            setUsers([]);
        }
        finally {
            setLoading(false);
        }
    };
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const getRoleBadge = (role) => {
        const roleStyles = {
            user: 'bg-green-500/10 text-green-400 border-green-500/20',
            business: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            agency: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            admin: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
        };
        return roleStyles[role] || roleStyles.user;
    };
    return (_jsx(Layout, { title: "", role: "Admin", fullWidth: true, hideSidebar: true, children: _jsxs("div", { className: "bg-gradient-to-br from-[#1a0b1e] via-[#0B1116] to-[#1a0b1e] min-h-screen", children: [_jsx("div", { className: "fixed top-0 left-0 w-full h-[500px] bg-pink-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" }), _jsx("div", { className: "fixed bottom-0 right-0 w-full h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("header", { className: "border-b border-white/5 bg-[#0B1116]/80 backdrop-blur-md px-6 py-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/admin'), className: "p-2 hover:bg-white/5 rounded-lg transition-colors", children: _jsx("span", { className: "material-symbols-outlined text-pink-400", children: "arrow_back" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "User Management" }), _jsx("p", { className: "text-sm text-slate-400", children: "Manage all platform users" })] })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "relative", children: [_jsx("span", { className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]", children: "search" }), _jsx("input", { type: "text", placeholder: "Search users...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 w-64" })] }) })] }), _jsx("div", { className: "flex gap-2 mt-4", children: ['all', 'user', 'business', 'agency', 'admin'].map((role) => (_jsx("button", { onClick: () => setRoleFilter(role), className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${roleFilter === role
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/5'}`, children: role.charAt(0).toUpperCase() + role.slice(1) }, role))) })] }), _jsx("div", { className: "p-6", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx(Loader, { size: "md", color: "#ec4899" }) })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsx("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-pink-500/20 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-pink-500/20 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-pink-400", children: "group" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-white", children: users.length }), _jsx("p", { className: "text-sm text-slate-400", children: "Total Users" })] })] }) }), _jsx("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-green-500/20 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-green-500/20 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-green-400", children: "person" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-white", children: users.filter(u => u.role === 'user').length }), _jsx("p", { className: "text-sm text-slate-400", children: "Residents" })] })] }) }), _jsx("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-blue-500/20 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-blue-400", children: "business" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-white", children: users.filter(u => u.role === 'business').length }), _jsx("p", { className: "text-sm text-slate-400", children: "Businesses" })] })] }) }), _jsx("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-purple-500/20 rounded-lg", children: _jsx("span", { className: "material-symbols-outlined text-purple-400", children: "recycling" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-white", children: users.filter(u => u.role === 'agency').length }), _jsx("p", { className: "text-sm text-slate-400", children: "Partners" })] })] }) })] }), _jsx("div", { className: "bg-[#1E293B]/60 backdrop-blur-sm border border-pink-500/20 rounded-2xl overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-white/5 border-b border-white/5", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider", children: "User" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider", children: "Email" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider", children: "Role" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider", children: "Eco Points" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider", children: "Joined" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-white/5", children: filteredUsers.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-12 text-center text-slate-400", children: "No users found" }) })) : (filteredUsers.map((user) => (_jsxs("tr", { className: "hover:bg-white/5 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold", children: user.name.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-white", children: user.name }), _jsx("p", { className: "text-xs text-slate-400", children: user._id.slice(-8) })] })] }) }), _jsx("td", { className: "px-6 py-4 text-gray-200", children: user.email }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadge(user.role)}`, children: user.role }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "text-pink-400 font-bold", children: user.ecoPoints || 0 }) }), _jsx("td", { className: "px-6 py-4 text-gray-200 text-sm", children: new Date(user.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4", children: _jsx("button", { onClick: () => navigate(`/admin/users/${user._id}`), className: "px-3 py-1.5 bg-pink-500/10 text-pink-400 rounded-lg hover:bg-pink-500/20 transition-colors text-sm font-medium", children: "View Details" }) })] }, user._id)))) })] }) })] })) })] })] }) }));
};
export default AdminUsers;
