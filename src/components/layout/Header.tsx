/**
 * Header Layout Component
 * Main navigation header with user profile and theme toggle
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../common/ThemeToggle';
import { LogOut, User, ChevronDown, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/services/authContext';
import { useSidebar } from './SidebarContext';
import { GlobalSearch } from '../../features/dashboard/components/GlobalSearch';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent immediate closing if overlay captures bubbled event
              toggleSidebar();
            }}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          {/* Logo */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white font-bold text-lg sm:text-xl">S</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
              {t('common.appName')}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">School Management System</p>
          </div>
        </div>

        {/* Global Search (Center) */}
        <div className="flex-1 mx-4 lg:mx-8 flex justify-center max-w-2xl">
           <GlobalSearch />
        </div>

        {/* Right side: Theme toggle and user profile */}
        <div className="flex items-center gap-1 sm:gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-2 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors max-w-[100px] sm:max-w-none">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
            <div className="hidden md:block text-sm truncate">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.role}
              </p>
            </div>
            <ChevronDown className="hidden sm:block w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
            aria-label={t('common.logout')}
            title={t('common.logout')}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export { Header };
