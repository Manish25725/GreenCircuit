import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
const ToggleRow = ({ label, description, defaultChecked = false, onChange, color = '#10b981', showBorder = true, }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const handleChange = () => {
        const newVal = !isChecked;
        setIsChecked(newVal);
        onChange?.(newVal);
    };
    return (_jsxs("div", { className: `flex items-center justify-between py-3 ${showBorder ? 'border-b border-white/5' : ''}`, children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-white text-sm font-medium", children: label }), description && (_jsx("span", { className: "text-[#94a3b8] text-xs", children: description }))] }), _jsx("button", { type: "button", role: "switch", "aria-checked": isChecked, onClick: handleChange, className: "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2", style: {
                    backgroundColor: isChecked ? color : '#0B1116',
                    ['--tw-ring-color']: `${color}80`,
                }, children: _jsx("span", { className: "inline-block h-5 w-5 rounded-full bg-white transition-transform", style: { transform: isChecked ? 'translateX(20px)' : 'translateX(2px)' } }) })] }));
};
export default ToggleRow;
