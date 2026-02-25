/**
 * Header Layout Component
 * Main navigation header with user profile and theme toggle
 */

import React from 'react';
import { ThemeToggle } from '../common/ThemeToggle';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/services/authContext';
import { useSidebar } from './SidebarContext';
import { GlobalSearch } from '../../features/dashboard/components/GlobalSearch';
import { FavoriteToggle } from '../common/FavoriteToggle';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { toggleSidebar } = useSidebar();
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
              e.stopPropagation();
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
          {/* Favorite Toggle */}
          <div className="hidden sm:block">
            <FavoriteToggle />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export { Header };
