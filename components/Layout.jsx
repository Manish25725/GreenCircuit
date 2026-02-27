import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Get current user from localStorage
const getStoredUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
    }
    catch (e) {
    }
    return null;
};
const Layout = ({ children, title, subtitle, role, fullWidth = false, hideSidebar = false }) => {
    const navigate = useNavigate();
    const storedUser = getStoredUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const agencyNav = [
        { label: 'Dashboard', icon: 'dashboard', path: '/agency' },
        { label: 'Manage Slots', icon: 'calendar_month', path: '/agency/slots', active: title === 'Manage Slots' },
        { label: 'Bookings', icon: 'book_online', path: '/agency/bookings' },
        { label: 'Profile', icon: 'person', path: '/agency/profile' },
        { label: 'Settings', icon: 'settings', path: '/agency/settings' },
    ];
    const userNav = [
        { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
        { label: 'Book Pickup', icon: 'local_shipping', path: '/search' },
        { label: 'Rewards', icon: 'military_tech', path: '/rewards' },
        { label: 'Certificate', icon: 'workspace_premium', path: '/certificate' },
        { label: 'How It Works', icon: 'info', path: '/how-it-works' },
        { label: 'Profile', icon: 'person', path: '/profile' },
    ];
    const adminNav = [
        { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
        { label: 'Users', icon: 'group', path: '/admin/users' },
        { label: 'Vetting Queue', icon: 'verified_user', path: '/admin/vetting' },
        { label: 'Agencies', icon: 'domain', path: '/admin/agencies' },
        { label: 'Reports', icon: 'assessment', path: '/admin/reports' },
    ];
    const businessNav = [
        { label: 'Dashboard', icon: 'dashboard', path: '/business' },
        { label: 'Inventory', icon: 'inventory_2', path: '/business/inventory' },
        { label: 'Certificates', icon: 'verified', path: '/business/certificates' },
        { label: 'Analytics', icon: 'analytics', path: '/business/analytics' },
        { label: 'Book Pickup', icon: 'local_shipping', path: '/search' },
    ];
    const currentNav = role === 'Agency' ? agencyNav : role === 'Admin' ? adminNav : role === 'Business' ? businessNav : userNav;
    // Use stored user info or fallback to defaults
    const userName = storedUser?.name || (role === 'Agency' ? 'EcoCycle Inc.' : role === 'Admin' ? 'Admin Panel' : role === 'Business' ? 'Business User' : 'User');
    const userEmail = storedUser?.email || (role === 'Agency' ? 'agency@ecocycle.com' : role === 'Admin' ? 'admin@ecocycle.com' : role === 'Business' ? 'business@company.com' : 'user@example.com');
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };
    return (_jsxs("div", { className: "flex min-h-screen w-full bg-[#0B1116] text-gray-200 font-sans", children: [!hideSidebar && (_jsxs("header", { className: "lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0B1116] border-b border-white/5 flex items-center justify-between px-4 z-50", children: [_jsxs("div", { className: "flex items-center gap-2", onClick: () => navigate('/'), children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-[#34D399]/10 text-[#34D399] flex items-center justify-center font-bold text-sm border border-[#34D399]/20", children: _jsx("span", { className: "material-symbols-outlined text-lg", children: "recycling" }) }), _jsx("div", { className: "flex flex-col", children: _jsx("h1", { className: "text-sm font-bold text-white tracking-tight", children: userName }) })] }), _jsx("button", { onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), className: "p-2 text-white hover:bg-white/5 rounded-lg transition-colors", children: _jsx("span", { className: "material-symbols-outlined", children: isMobileMenuOpen ? 'close' : 'menu' }) })] })), !hideSidebar && isMobileMenuOpen && (_jsx("div", { className: "lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm", onClick: () => setIsMobileMenuOpen(false) })), !hideSidebar && (_jsxs("aside", { className: `fixed top-0 left-0 h-screen w-64 border-r border-white/5 bg-[#0B1116] flex flex-col z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`, children: [_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-8 cursor-pointer", onClick: () => navigate('/'), children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-[#34D399]/10 text-[#34D399] flex items-center justify-center font-bold text-lg border border-[#34D399]/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]", children: _jsx("span", { className: "material-symbols-outlined", children: "recycling" }) }), _jsxs("div", { className: "flex flex-col", children: [_jsx("h1", { className: "text-base font-bold text-white tracking-tight", children: userName }), _jsx("p", { className: "text-xs text-slate-400", children: userEmail })] })] }), _jsx("nav", { className: "flex flex-col gap-1", children: currentNav.map((item) => (_jsxs("a", { href: item.path, onClick: (e) => {
                                        e.preventDefault();
                                        navigate(item.path);
                                        setIsMobileMenuOpen(false); // Close mobile menu on navigation
                                    }, className: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${item.active || window.location.pathname === item.path
                                        ? 'bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/10'
                                        : 'text-slate-400 hover:bg-white/5 hover:translate-x-1'}`, children: [_jsx("span", { className: `material-symbols-outlined ${item.active ? 'fill' : ''} text-xl`, children: item.icon }), item.label] }, item.label))) })] }), _jsx("div", { className: "mt-auto p-6 border-t border-white/5", children: _jsxs("button", { onClick: handleLogout, className: "flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors", children: [_jsx("span", { className: "material-symbols-outlined", children: "logout" }), "Logout"] }) })] })), _jsx("main", { className: `flex-1 ${!hideSidebar ? 'lg:ml-64 pt-16 lg:pt-0' : ''} overflow-y-auto ${fullWidth ? 'p-0' : 'p-4 sm:p-6 lg:p-8'}`, children: _jsxs("div", { className: fullWidth ? 'w-full' : 'max-w-7xl mx-auto', children: [_jsx("div", { className: `flex flex-col gap-1 ${fullWidth ? 'hidden' : 'mb-6 lg:mb-8'}`, children: title && (_jsxs("div", { className: "animate-fade-in-up", children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black tracking-tight text-white", children: title }), subtitle && _jsx("p", { className: "text-slate-400 mt-1 text-sm sm:text-base", children: subtitle })] })) }), children] }) })] }));
};
export default Layout;
