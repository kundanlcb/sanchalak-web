/**
 * Sidebar Layout Component
 * Navigation sidebar with responsive collapsing and mobile drawer
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  BarChart,
  Wallet,
  CreditCard,
  Banknote,
  TrendingUp,
  School,
  UserCog,
  CalendarClock
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useSidebar } from './SidebarContext';
import { useAuth } from '../../features/auth/services/authContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles?: string[]; // Optional: if defined, restricts to these roles
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Academic Setup', path: '/admin/academics/setup', icon: School, roles: ['Admin'] },
  { name: 'Teachers', path: '/admin/teachers', icon: UserCog, roles: ['Admin'] },
  { name: 'Timetable', path: '/admin/academics/routine', icon: CalendarClock, roles: ['Admin'] },
  { name: 'Students', path: '/students', icon: Users, roles: ['Admin', 'Teacher', 'Staff'] },
  { name: 'Attendance', path: '/attendance', icon: Calendar },
  { name: 'Exams', path: '/admin/academics/exams', icon: GraduationCap, roles: ['Admin'] },
  { name: 'Marks', path: '/teacher/marks', icon: ClipboardCheck, roles: ['Admin', 'Teacher'] },
  { name: 'Reports', path: '/admin/academics/reports', icon: BarChart, roles: ['Admin'] },
  { name: 'Homework', path: '/homework', icon: BookOpen },
  { name: 'Fees', path: '/admin/finance/fees', icon: Wallet, roles: ['Admin'] },
  { name: 'Pay Fees', path: '/finance/pay', icon: CreditCard, roles: ['Student', 'Parent'] },
  { name: 'Payroll', path: '/admin/finance/payroll', icon: Banknote, roles: ['Admin'] },
  { name: 'Finance', path: '/admin/finance/reports', icon: TrendingUp, roles: ['Admin'] },
  { name: 'Notices', path: '/notices', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();

  console.log('[Sidebar] Render state:', { isSidebarOpen, isCollapsed });
  
  // Filter nav items based on role
  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true; // Public/Shared
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  // Close sidebar on mobile when route changes
  useEffect(() => {
    closeSidebar();
  }, [location.pathname, closeSidebar]);

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[900] lg:hidden"
          onClick={() => {
            console.log('[Sidebar] Overlay clicked');
            closeSidebar();
          }}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 border-r border-gray-200 dark:border-gray-800',
          'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm transition-transform duration-300 shadow-lg z-[1000]',
          // Desktop: always visible (if screen >= lg)
          'lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0',
          isCollapsed ? 'lg:w-16' : 'lg:w-64',
          
          // Mobile:
          'top-0 h-full w-64',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Collapse Toggle (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md transition-all hover:shadow-lg z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Navigation */}
        <nav className="p-4 space-y-1 mt-12 lg:mt-0">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                isActive && 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/10 text-blue-600 dark:text-blue-400 shadow-sm',
                !isActive && 'text-gray-700 dark:text-gray-300',
                isCollapsed && 'justify-center'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                )}
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                  isCollapsed && "ml-0"
                )} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
    </>
  );
};

export { Sidebar };
