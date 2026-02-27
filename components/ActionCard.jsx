import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const ActionCard = ({ icon, iconColor, title, description, actionLabel, actionIcon, accentColor = '#10b981', hoverColor, variant = 'outline', onAction, className = 'mb-6', }) => {
    const isFilled = variant === 'filled';
    return (_jsx("div", { className: `bg-[#151F26] p-6 md:p-8 rounded-xl border border-white/5 ${className}`, children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-6", children: [_jsxs("div", { className: "flex flex-col gap-1 max-w-2xl", children: [_jsxs("div", { className: "flex items-center gap-2", children: [icon && (_jsx("span", { className: "material-symbols-outlined", style: { color: iconColor || accentColor }, children: icon })), _jsx("h3", { className: "text-white text-lg font-bold leading-tight", children: title })] }), _jsx("p", { className: "text-[#94a3b8] text-sm", children: description })] }), _jsxs("button", { onClick: onAction, className: `flex whitespace-nowrap min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-colors ${isFilled ? 'text-white' : 'bg-[#0B1116] border border-white/5'}`, style: {
                        backgroundColor: isFilled ? accentColor : undefined,
                        color: isFilled ? '#fff' : accentColor,
                    }, onMouseEnter: (e) => {
                        if (isFilled && hoverColor) {
                            e.currentTarget.style.backgroundColor = hoverColor;
                        }
                        else if (!isFilled) {
                            e.currentTarget.style.backgroundColor = `${accentColor}1a`;
                        }
                    }, onMouseLeave: (e) => {
                        if (isFilled) {
                            e.currentTarget.style.backgroundColor = accentColor;
                        }
                        else {
                            e.currentTarget.style.backgroundColor = '#0B1116';
                        }
                    }, children: [actionIcon && _jsx("span", { className: "material-symbols-outlined text-[18px]", children: actionIcon }), _jsx("span", { children: actionLabel })] })] }) }));
};
export default ActionCard;
