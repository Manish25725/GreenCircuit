import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
const SettingsNavCard = ({ icon, color, title, description, link, hoverAccent, }) => {
    const navigate = useNavigate();
    const accent = hoverAccent || color;
    return (_jsx("div", { onClick: () => navigate(link), className: "bg-[#151F26] hover:bg-[#1a2730] p-6 rounded-xl border border-white/5 transition-all cursor-pointer group", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "p-3 rounded-xl transition-all group-hover:scale-110", style: { backgroundColor: `${color}15` }, children: _jsx("span", { className: "material-symbols-outlined text-[28px]", style: { color }, children: icon }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-white font-semibold text-lg mb-1 transition-colors", style: { ['--hover-color']: accent }, children: title }), _jsx("p", { className: "text-slate-400 text-sm", children: description })] }), _jsx("span", { className: "material-symbols-outlined text-gray-500 group-hover:text-current transition-colors", style: { color: undefined }, children: "arrow_forward" })] }) }));
};
export default SettingsNavCard;
