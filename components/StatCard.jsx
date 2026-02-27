import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const StatCard = ({ icon, iconColor = '#10b981', label, value, suffix, borderColor, variant = 'dark', onClick, }) => {
    const bgClass = variant === 'dark' ? 'bg-[#0B1116]' : 'bg-[#151F26]';
    const border = borderColor || iconColor;
    return (_jsx("div", { className: `${bgClass} p-4 rounded-xl border transition-all ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`, style: { borderColor: `${border}33` }, onClick: onClick, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: `${iconColor}1a` }, children: _jsx("span", { className: "material-symbols-outlined", style: { color: iconColor }, children: icon }) }), _jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-xs", children: label }), _jsxs("p", { className: "text-white text-2xl font-bold", children: [value, suffix && ` ${suffix}`] })] })] }) }));
};
export default StatCard;
