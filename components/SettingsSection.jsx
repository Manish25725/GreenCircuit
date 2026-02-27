import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const SettingsSection = ({ icon, iconColor, title, description, children, className = 'mb-6', borderClass = 'border-white/5', }) => {
    return (_jsx("div", { className: `bg-[#151F26] p-6 md:p-8 rounded-xl border ${borderClass} ${className}`, children: _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [icon && (_jsx("span", { className: "material-symbols-outlined", style: { color: iconColor }, children: icon })), _jsx("h3", { className: "text-white text-lg font-bold leading-tight", children: title })] }), description && (_jsx("p", { className: "text-[#94a3b8] text-sm", children: description }))] }), children] }) }));
};
export default SettingsSection;
