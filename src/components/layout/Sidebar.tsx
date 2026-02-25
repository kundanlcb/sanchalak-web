import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  ClipboardList,
  LayoutDashboard,
  Star,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useSidebar } from './SidebarContext';
import { useAuth } from '../../features/auth/services/authContext';
import { useFavorites } from '../../hooks/useFavorites';

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
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Students', path: '/students', icon: Users, featureCode: 'STUDENT_MGMT' },
      { name: 'Teachers', path: '/admin/teachers', icon: UserCog, roles: ['Admin'], featureCode: 'TEACHERS' },
      { name: 'Fees', path: '/admin/finance/fees', icon: Wallet, roles: ['Admin'], featureCode: 'FEES' },
      { name: 'Notices', path: '/notices', icon: Bell, featureCode: 'NOTICES' },
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
      { name: 'Marks', path: '/teacher/marks', icon: FileUser, roles: ['Admin', 'Teacher'], featureCode: 'MARKS' },
      { name: 'Reports', path: '/admin/academics/reports', icon: BarChart, roles: ['Admin'], featureCode: 'REPORTS' },
    ]
  },
  {
    name: 'Student Ops',
    icon: Users,
    items: [
      { name: 'Attendance', path: '/attendance', icon: ClipboardList, featureCode: 'ATTENDANCE' },
      { name: 'Homework', path: '/homework', icon: BookOpen, featureCode: 'HOMEWORK' },
    ]
  },
  {
    name: 'HR & Staff',
    icon: FileUser,
    items: [
      { name: 'Leave Policies', path: '/admin/hr/leave-policies', icon: FileUser, roles: ['Admin'], featureCode: 'HR' },
      { name: 'Leave Approvals', path: '/admin/hr/leave-approvals', icon: ClipboardList, roles: ['Admin'], featureCode: 'HR' },
    ]
  },
  {
    name: 'Finance',
    icon: Wallet,
    items: [
      { name: 'Pay Fees', path: '/finance/pay', icon: CreditCard, roles: ['Student', 'Parent'], featureCode: 'FEES' },
      { name: 'Payroll', path: '/admin/finance/payroll', icon: Banknote, roles: ['Admin'], featureCode: 'PAYROLL' },
      { name: 'Finance', path: '/admin/finance/reports', icon: TrendingUp, roles: ['Admin'], featureCode: 'FINANCE' },
    ]
  },
  {
    name: 'More',
    icon: Settings,
    items: [
      { name: 'School Template', path: '/admin/settings/school-template', icon: School, roles: ['Admin'] },
      { name: 'Settings', path: '/settings', icon: Settings },
      { name: 'Access Control', path: '/admin/permissions', icon: ShieldCheck, roles: ['Admin'] },
    ]
  }
];

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
        'group relative flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl transition-all duration-300',
        'hover:bg-gray-100 dark:hover:bg-white/5 hover:translate-x-1',
        isActive && [
          'bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-600/20 dark:to-blue-500/10',
          'text-white dark:text-blue-400 shadow-lg shadow-blue-500/20 dark:shadow-none',
        ],
        !isActive && 'text-gray-600 dark:text-gray-400',
        isCollapsed && 'justify-center mx-1 px-0'
      )
    }
  >
    {({ isActive }) => (
      <>
        {isActive && !isCollapsed && (
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 dark:bg-blue-400 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
        )}
        <item.icon className={cn(
          "w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110",
          isActive && "text-white dark:text-blue-400",
          !isActive && "text-gray-400 dark:text-gray-500 group-hover:text-blue-500/70"
        )} />
        {!isCollapsed && (
          <span className={cn(
            "text-sm font-semibold tracking-tight",
            isActive ? "font-bold" : "font-medium"
          )}>{item.name}</span>
        )}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/10">
            {item.name}
          </div>
        )}
      </>
    )}
  </NavLink>
);

const UserProfile: React.FC<{ isCollapsed: boolean; user: any }> = ({ isCollapsed, user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    navigate('/login');
  };

  const initials = user.name ? user.name.split(' ').map((n: any) => n[0]).join('').toUpperCase() : user.email[0].toUpperCase();

  return (
    <div className={cn(
      "border-t border-gray-100 dark:border-white/5 p-4 mt-auto mb-2",
      isCollapsed ? "flex justify-center" : ""
    )}>
      <NavLink
        to="/admin/account"
        className={cn(
          "flex items-center gap-3 p-2 rounded-2xl transition-all group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5",
          isCollapsed ? "justify-center" : ""
        )}
      >
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-gray-900 overflow-hidden transform group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate tracking-tight">{user.name || 'User'}</p>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{user.role}</p>
          </div>
        )}

        {!isCollapsed && (
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </NavLink>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const { user } = useAuth();
  const { favorites } = useFavorites();
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[900] lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 border-r border-gray-100 dark:border-white/5',
          'bg-white dark:bg-slate-950 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[1000]',
          'lg:top-0 lg:h-screen lg:translate-x-0',
          isCollapsed ? 'lg:w-20' : 'lg:w-72',
          'top-0 h-full w-72',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-none',
          'flex flex-col'
        )}
      >
        {/* Brand Header */}
        <div className={cn(
          "flex items-center gap-3 px-6 h-20 border-b border-gray-50 dark:border-white/5",
          isCollapsed ? "justify-center px-0" : ""
        )}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-blue-600/20 group cursor-pointer overflow-hidden">
            <School className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent leading-tight">
                Sanchalan
              </span>
              <span className="text-[10px] font-bold text-blue-600/80 dark:text-blue-400/80 uppercase tracking-[0.1em] mt-0.5">
                School Management
              </span>
            </div>
          )}
        </div>

        {/* Close Button (Mobile Only) */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute right-4 top-5 p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Collapse Toggle (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-4 top-8 w-8 h-8 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-slate-900 items-center justify-center text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-xl hover:shadow-blue-500/10 transition-all group z-50"
        >
          {isCollapsed ?
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /> :
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          }
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {/* Favorites Section */}
          {(() => {
            const favoriteItems = navGroups
              .flatMap(g => g.items)
              .filter(item => favorites.includes(item.path))
              .filter(item => {
                if (!user) return false;
                if (item.roles && !item.roles.includes(user.role)) return false;
                if (item.featureCode && user.role !== 'Admin') {
                  const userPermissions = user.permissions || [];
                  if (!userPermissions.includes(item.featureCode)) return false;
                }
                return true;
              });

            if (favoriteItems.length === 0) return null;

            return (
              <div className="mb-6 space-y-1">
                {!isCollapsed && (
                  <p className="px-5 mb-2 text-[11px] font-medium text-amber-500 dark:text-amber-400 tracking-wide flex items-center gap-2">
                    <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-400" />
                    Favorites
                  </p>
                )}
                {favoriteItems.map((item) => (
                  <NavLinkItem
                    key={`fav-${item.path}`}
                    item={item}
                    isCollapsed={isCollapsed}
                    onItemClick={closeSidebar}
                  />
                ))}
                {!isCollapsed && <div className="mx-5 my-4 border-t border-gray-100 dark:border-gray-800" />}
              </div>
            );
          })()}

          {navGroups.map((group) => {
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

            return (
              <div key={group.name} className="mb-6 last:mb-0 space-y-1">
                {!isCollapsed && (
                  <p className="px-6 mb-2 text-[11px] font-medium text-gray-400 dark:text-gray-500 tracking-wide">
                    {group.name}
                  </p>
                )}
                {filteredItems.map((item) => (
                  <NavLinkItem
                    key={item.path}
                    item={item}
                    isCollapsed={isCollapsed}
                    onItemClick={closeSidebar}
                  />
                ))}
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <UserProfile isCollapsed={isCollapsed} user={user} />
      </aside>
    </>
  );
};


export { Sidebar };
