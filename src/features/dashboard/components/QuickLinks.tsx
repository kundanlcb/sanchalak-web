import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    UserCog,
    ClipboardList,
    CreditCard,
    Wallet,
    Bell,
    BookOpen,
    GraduationCap,
    CalendarClock,
    Banknote,
} from 'lucide-react';
import { useAuth } from '../../auth/services/authContext';
import { cn } from '../../../utils/cn';

interface QuickLink {
    label: string;
    path: string;
    icon: React.ElementType;
    gradient: string;
    shadow: string;
    roles?: string[];
    featureCode?: string;
}

const quickLinks: QuickLink[] = [
    {
        label: 'Students',
        path: '/students',
        icon: Users,
        gradient: 'from-blue-500 to-blue-600',
        shadow: 'shadow-blue-200 dark:shadow-blue-900/40',
        roles: ['Admin', 'Teacher', 'Staff'],
        featureCode: 'STUDENT_MGMT',
    },
    {
        label: 'Teachers',
        path: '/admin/teachers',
        icon: UserCog,
        gradient: 'from-violet-500 to-purple-600',
        shadow: 'shadow-violet-200 dark:shadow-violet-900/40',
        roles: ['Admin'],
        featureCode: 'TEACHERS',
    },
    {
        label: 'Attendance',
        path: '/attendance',
        icon: ClipboardList,
        gradient: 'from-teal-400 to-teal-600',
        shadow: 'shadow-teal-200 dark:shadow-teal-900/40',
        featureCode: 'ATTENDANCE',
    },
    {
        label: 'Fee Payment',
        path: '/finance/pay',
        icon: CreditCard,
        gradient: 'from-emerald-400 to-green-600',
        shadow: 'shadow-emerald-200 dark:shadow-emerald-900/40',
        roles: ['Admin', 'Student', 'Parent'],
        featureCode: 'FEES',
    },
    {
        label: 'Fee Mgmt',
        path: '/admin/finance/fees',
        icon: Wallet,
        gradient: 'from-orange-400 to-orange-600',
        shadow: 'shadow-orange-200 dark:shadow-orange-900/40',
        roles: ['Admin'],
        featureCode: 'FEES',
    },
    {
        label: 'Notices',
        path: '/notices',
        icon: Bell,
        gradient: 'from-rose-400 to-pink-600',
        shadow: 'shadow-rose-200 dark:shadow-rose-900/40',
        featureCode: 'NOTICES',
    },
    {
        label: 'Homework',
        path: '/homework',
        icon: BookOpen,
        gradient: 'from-indigo-400 to-indigo-600',
        shadow: 'shadow-indigo-200 dark:shadow-indigo-900/40',
        featureCode: 'HOMEWORK',
    },
    {
        label: 'Exams',
        path: '/admin/academics/exams',
        icon: GraduationCap,
        gradient: 'from-amber-400 to-yellow-500',
        shadow: 'shadow-amber-200 dark:shadow-amber-900/40',
        roles: ['Admin'],
        featureCode: 'EXAMS',
    },
    {
        label: 'Timetable',
        path: '/admin/academics/routine',
        icon: CalendarClock,
        gradient: 'from-cyan-400 to-sky-500',
        shadow: 'shadow-cyan-200 dark:shadow-cyan-900/40',
        roles: ['Admin'],
        featureCode: 'TIMETABLE',
    },
    {
        label: 'Payroll',
        path: '/admin/finance/payroll',
        icon: Banknote,
        gradient: 'from-fuchsia-500 to-pink-500',
        shadow: 'shadow-fuchsia-200 dark:shadow-fuchsia-900/40',
        roles: ['Admin'],
        featureCode: 'PAYROLL',
    },
];

export const QuickLinks: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) return null;

    const visibleLinks = quickLinks.filter((link) => {
        if (link.roles && !link.roles.includes(user.role)) return false;
        if (link.featureCode && user.role !== 'Admin') {
            const perms: string[] = user.permissions || [];
            if (!perms.includes(link.featureCode)) return false;
        }
        return true;
    });

    if (visibleLinks.length === 0) return null;

    return (
        <div className="px-1 py-4">
            {/* Header */}
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                Quick Links
            </p>

            {/* Scrollable tile row */}
            <div className="flex gap-4 overflow-x-auto pt-2 pb-2 scrollbar-hide">
                {visibleLinks.map((link) => (
                    <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className={cn(
                            'group flex flex-col items-center gap-2.5 flex-shrink-0 w-[72px]',
                            'transition-all duration-200 hover:-translate-y-0.5'
                        )}
                    >
                        {/* Icon tile */}
                        <div
                            className={cn(
                                'w-12 h-12 rounded-full flex items-center justify-center',
                                'bg-gradient-to-br shadow-md',
                                link.gradient,
                                link.shadow,
                                'group-hover:shadow-lg group-hover:scale-105 transition-all duration-200'
                            )}
                        >
                            <link.icon className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                        {/* Label */}
                        <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 text-center leading-tight w-full">
                            {link.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
