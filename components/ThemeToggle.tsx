import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'switch' | 'button';
  showLabel?: boolean;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'switch', 
  showLabel = true,
  className = ''
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${className}`}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="material-symbols-outlined text-xl">
          {isDark ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded-lg border border-white/5 hover:bg-white/5 transition-colors flex items-center gap-2 ${className}`}
      >
        <span className="material-symbols-outlined text-lg">
          {isDark ? 'light_mode' : 'dark_mode'}
        </span>
        {showLabel && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
      </button>
    );
  }

  // Default: switch variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <>
          <span className="text-sm font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-base">light_mode</span>
            Light
          </span>
        </>
      )}
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          checked={isDark}
          onChange={toggleTheme}
          className="sr-only peer" 
          type="checkbox" 
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981]"></div>
      </label>
      {showLabel && (
        <span className="text-sm font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-base">dark_mode</span>
          Dark
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;
