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
  CalendarClock,
  FileUser,
  ShieldCheck,
  Clock,
  ClipboardList
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useSidebar } from './SidebarContext';
import { useAuth } from '../../features/auth/services/authContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
  featureCode?: string;
}

interface NavGroup {
  name: string;
  icon: React.ElementType;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    name: 'Overview',
    icon: Home,
    items: [
      { name: 'Dashboard', path: '/', icon: Home },
    ]
  },
  {
    name: 'Academics',
    icon: GraduationCap,
    items: [
      { name: 'Classes', path: '/admin/academics/setup', icon: School, roles: ['Admin'], featureCode: 'ACADEMICS' },
      { name: 'Curriculum', path: '/admin/curriculum', icon: BookOpen, roles: ['Admin', 'Teacher'], featureCode: 'ACADEMICS' },
      { name: 'Timetable', path: '/admin/academics/routine', icon: CalendarClock, roles: ['Admin'], featureCode: 'TIMETABLE' },
      { name: 'Bell Schedule', path: '/admin/academics/timetable-config', icon: Clock, roles: ['Admin'], featureCode: 'TIMETABLE' },
      { name: 'Holidays', path: '/admin/academics/holidays', icon: Calendar, roles: ['Admin'], featureCode: 'ACADEMICS' },
      { name: 'Exams', path: '/admin/academics/exams', icon: GraduationCap, roles: ['Admin'], featureCode: 'EXAMS' },
      { name: 'Marks', path: '/teacher/marks', icon: ClipboardCheck, roles: ['Admin', 'Teacher'], featureCode: 'MARKS' },
      { name: 'Reports', path: '/admin/academics/reports', icon: BarChart, roles: ['Admin'], featureCode: 'REPORTS' },
    ]
  },
  {
    name: 'Student Ops',
    icon: Users,
    items: [
      { name: 'Students', path: '/students', icon: Users, roles: ['Admin', 'Teacher', 'Staff'], featureCode: 'STUDENT_MGMT' },
      { name: 'Attendance', path: '/attendance', icon: Calendar, featureCode: 'ATTENDANCE' },
      { name: 'Homework', path: '/homework', icon: BookOpen, featureCode: 'HOMEWORK' },
    ]
  },
  {
    name: 'HR & Staff',
    icon: FileUser,
    items: [
      { name: 'Teachers', path: '/admin/teachers', icon: UserCog, roles: ['Admin'], featureCode: 'TEACHERS' },
      { name: 'Leave Policies', path: '/admin/hr/leave-policies', icon: FileUser, roles: ['Admin'], featureCode: 'HR' },
      { name: 'Leave Approvals', path: '/admin/hr/leave-approvals', icon: ClipboardList, roles: ['Admin'], featureCode: 'HR' },
    ]
  },
  {
    name: 'Finance',
    icon: Wallet,
    items: [
      { name: 'Fees', path: '/admin/finance/fees', icon: Wallet, roles: ['Admin'], featureCode: 'FEES' },
      { name: 'Pay Fees', path: '/finance/pay', icon: CreditCard, roles: ['Student', 'Parent'], featureCode: 'FEES' },
      { name: 'Payroll', path: '/admin/finance/payroll', icon: Banknote, roles: ['Admin'], featureCode: 'PAYROLL' },
      { name: 'Finance', path: '/admin/finance/reports', icon: TrendingUp, roles: ['Admin'], featureCode: 'FINANCE' },
    ]
  },
  {
    name: 'More',
    icon: Settings,
    items: [
      { name: 'Notices', path: '/notices', icon: Bell, featureCode: 'NOTICES' },
      { name: 'Settings', path: '/settings', icon: Settings },
      { name: 'Access Control', path: '/admin/permissions', icon: ShieldCheck, roles: ['Admin'] },
    ]
  }
];

const SidebarGroup: React.FC<{
  group: NavGroup;
  user: any;
  isCollapsed: boolean;
  isActive: boolean;
  onItemClick: () => void;
}> = ({ group, user, isCollapsed, isActive: isParentActive, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(isParentActive);

  // Filter items based on role and permissions
  const filteredItems = group.items.filter(item => {
    if (!user) return false;
    if (item.roles && !item.roles.includes(user.role)) return false;
    if (item.featureCode && user.role !== 'Admin') {
      const userPermissions = user.permissions || [];
      if (!userPermissions.includes(item.featureCode)) return false;
    }
    return true;
  });

  if (filteredItems.length === 0) return null;

  // Overview special case: just show the item if it's the only one
  if (group.name === 'Overview') {
    return (
      <NavLinkItem item={filteredItems[0]} isCollapsed={isCollapsed} onItemClick={onItemClick} />
    );
  }

  return (
    <div className="space-y-1">
      {!isCollapsed && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
            isOpen ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          )}
        >
          <span>{group.name}</span>
          <ChevronRight className={cn("w-3 h-3 transition-transform duration-200", isOpen && "rotate-90")} />
        </button>
      )}

      {(isOpen || isCollapsed) && (
        <div className={cn("space-y-1", !isCollapsed && "pl-2")}>
          {filteredItems.map(item => (
            <NavLinkItem key={item.path} item={item} isCollapsed={isCollapsed} onItemClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  );
};

const NavLinkItem: React.FC<{
  item: NavItem;
  isCollapsed: boolean;
  onItemClick: () => void;
}> = ({ item, isCollapsed, onItemClick }) => (
  <NavLink
    to={item.path}
    onClick={onItemClick}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative',
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
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
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
);

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();

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
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 border-r border-gray-200 dark:border-gray-800',
          'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm transition-transform duration-300 shadow-lg z-[1000]',
          'lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0',
          isCollapsed ? 'lg:w-16' : 'lg:w-64',
          'top-0 h-full w-64',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Collapse Toggle (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md transition-all hover:shadow-lg z-10"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Navigation */}
        <nav className="p-4 space-y-4 mt-12 lg:mt-0 overflow-y-auto max-h-full scrollbar-hide">
          {navGroups.map((group) => {
            const isActive = group.items.some(item => location.pathname === item.path);
            return (
              <SidebarGroup
                key={group.name}
                group={group}
                user={user}
                isCollapsed={isCollapsed}
                isActive={isActive}
                onItemClick={closeSidebar}
              />
            );
          })}
        </nav>
      </aside>
    </>
  );
};


export { Sidebar };
