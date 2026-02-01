import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';

/**
 * Header Component
 * Displays the app name/logo and theme toggle button
 * @param {Object} props - Component props
 * @param {boolean} props.isDark - Current theme state
 * @param {Function} props.toggleTheme - Function to toggle theme
 * @param {Function} props.toggleSidebar - Function to toggle sidebar on mobile
 */
const Header = ({ isDark, toggleTheme, toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:py-2">
        {/* Left section: Mobile menu button + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface
                       transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          
          {/* App Logo/Name */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              NeuraMind
            </h1>
          </div>
        </div>

        {/* Right section: Theme toggle */}
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
};

export default Header;
