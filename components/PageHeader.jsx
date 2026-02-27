import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const PageHeader = ({ icon, iconColor = '#8b5cf6', title, subtitle, rightContent, }) => {
    return (_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between gap-3 mb-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: `${iconColor}1a` }, children: _jsx("span", { className: "material-symbols-outlined text-[28px]", style: { color: iconColor }, children: icon }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-white", children: title }), subtitle && _jsx("p", { className: "text-slate-400 text-sm", children: subtitle })] })] }), rightContent && _jsx("div", { children: rightContent })] }) }));
};
export default PageHeader;
