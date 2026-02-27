import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const ALERT_DEFAULTS = {
    info: { color: '#06b6d4', icon: 'info' },
    success: { color: '#10b981', icon: 'check_circle' },
    warning: { color: '#f59e0b', icon: 'warning' },
    error: { color: '#ef4444', icon: 'error' },
};
const AlertBanner = ({ type = 'info', icon, title, message, color, className = '', }) => {
    const defaults = ALERT_DEFAULTS[type];
    const alertColor = color || defaults.color;
    const alertIcon = icon || defaults.icon;
    return (_jsx("div", { className: `rounded-lg p-4 ${className}`, style: {
            backgroundColor: `${alertColor}1a`,
            borderWidth: '1px',
            borderColor: `${alertColor}4d`,
        }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "material-symbols-outlined text-[20px] mt-0.5", style: { color: alertColor }, children: alertIcon }), _jsxs("div", { className: "flex-1", children: [title && (_jsx("p", { className: "text-sm font-medium mb-1", style: { color: alertColor }, children: title })), _jsx("p", { className: "text-slate-400 text-xs leading-relaxed", children: message })] })] }) }));
};
export default AlertBanner;
