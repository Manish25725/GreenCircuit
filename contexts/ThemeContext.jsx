import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext(undefined);
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    });
    useEffect(() => {
        // Apply theme to document root
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        // Save to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);
    const setTheme = (newTheme) => {
        setThemeState(newTheme);
    };
    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    };
    return (_jsx(ThemeContext.Provider, { value: { theme, setTheme, toggleTheme }, children: children }));
};
