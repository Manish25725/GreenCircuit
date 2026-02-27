import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const Loader = ({ size = 'md', color = '#34D399', className = '' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };
    return (_jsx("div", { className: `flex items-center justify-center ${className}`, children: _jsx("div", { className: `${sizeClasses[size]} relative animate-spin`, style: { animationDuration: '2s' }, children: _jsx("svg", { className: "w-full h-full drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]", fill: "none", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z", stroke: color, strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3" }) }) }) }));
};
export default Loader;
