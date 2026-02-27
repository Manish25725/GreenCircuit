import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const BackButton = ({ label = 'Back', color = '#10b981', hoverColor, onClick, }) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        else {
            window.history.back();
        }
    };
    return (_jsxs("button", { onClick: handleClick, className: "flex items-center gap-2 transition-colors mb-6 group", style: { color }, onMouseEnter: (e) => hoverColor && (e.currentTarget.style.color = hoverColor), onMouseLeave: (e) => hoverColor && (e.currentTarget.style.color = color), children: [_jsx("span", { className: "material-symbols-outlined text-[20px]", children: "arrow_back" }), _jsx("span", { className: "text-sm font-medium", children: label })] }));
};
export default BackButton;
