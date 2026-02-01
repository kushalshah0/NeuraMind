import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

/**
 * ThemeToggle Component
 * Allows users to switch between light and dark themes
 * @param {Object} props - Component props
 * @param {boolean} props.isDark - Current theme state
 * @param {Function} props.toggleTheme - Function to toggle theme
 */
const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {/* Sun icon for light mode */}
        <SunIcon
          className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        {/* Moon icon for dark mode */}
        <MoonIcon
          className={`absolute inset-0 w-6 h-6 text-indigo-400 transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
