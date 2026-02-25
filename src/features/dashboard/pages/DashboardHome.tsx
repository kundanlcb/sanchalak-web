import React from 'react';
import { Users, GraduationCap, School, IndianRupee, UserCog, Bell, ClipboardList, CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatsCard } from '../components/StatsCard';
import { ExamResultChart } from '../components/ExamResultChart';
import { GenderDonutChart } from '../components/GenderDonutChart';
import { StarStudentTable } from '../components/StarStudentTable';
import { RecentActivity } from '../components/RecentActivity';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useAuth } from '../../auth/services/authContext';

// Quick-access tiles for the dashboard
const quickTiles = [
    { label: 'Students', path: '/students', icon: Users, bg: 'bg-blue-500', shadow: 'shadow-blue-500/30' },
    { label: 'Teachers', path: '/admin/teachers', icon: UserCog, bg: 'bg-violet-500', shadow: 'shadow-violet-500/30' },
    { label: 'Fees', path: '/admin/finance/fees', icon: IndianRupee, bg: 'bg-teal-500', shadow: 'shadow-teal-500/30' },
    { label: 'Attendance', path: '/attendance', icon: ClipboardList, bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/30' },
    { label: 'Timetable', path: '/admin/academics/routine', icon: CalendarClock, bg: 'bg-amber-500', shadow: 'shadow-amber-500/30' },
    { label: 'Notices', path: '/notices', icon: Bell, bg: 'bg-rose-500', shadow: 'shadow-rose-500/30' },
];

export const DashboardHome: React.FC = () => {
    const { stats, loading } = useDashboardStats();
    const { user } = useAuth();
    const permissions = user?.permissions || [];

    const hasFinance = user?.role === 'Admin' || permissions.includes('FINANCE') || permissions.includes('FEES');
    const hasExams = user?.role === 'Admin' || permissions.includes('EXAMS');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* ── Welcome Banner ─────────────────────────────────────────── */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 p-6 text-white shadow-lg shadow-blue-500/20 overflow-hidden relative">
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute -bottom-10 right-16 w-28 h-28 rounded-full bg-white/5" />
                <div className="relative z-10">
                    <p className="text-sm font-medium text-blue-100">{dateStr}</p>
                    <h1 className="text-2xl font-extrabold mt-0.5 tracking-tight">
                        {greeting}, {user?.name?.split(' ')[0] || 'Admin'} 👋
                    </h1>
                    <p className="text-sm text-blue-100/80 mt-1">Here's what's happening at your school today.</p>
                </div>
            </div>

            {/* ── Quick-access tiles ──────────────────────────────────────── */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {quickTiles.map(tile => (
                    <Link
                        key={tile.path}
                        to={tile.path}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                        <div className={`h-11 w-11 rounded-xl ${tile.bg} ${tile.shadow} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                            <tile.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 text-center leading-tight">{tile.label}</span>
                    </Link>
                ))}
            </div>

            {/* ── Stats Grid ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Students" value={stats ? stats.students.toString() : '...'} icon={Users} color="blue" trend={stats ? 'Active students' : ''} loading={loading} />
                <StatsCard title="Total Teachers" value={stats ? stats.teachers.toString() : '...'} icon={GraduationCap} color="purple" trend={stats ? 'Active faculty' : ''} loading={loading} />
                <StatsCard title="Total Classes" value={stats ? stats.classes.toString() : '...'} icon={School} color="orange" loading={loading} />
                {hasFinance && (
                    <StatsCard title="Monthly Earnings" value={stats ? formatCurrency(stats.monthlyEarnings) : '...'} icon={IndianRupee} color="green" trend={stats ? 'This month' : ''} loading={loading} />
                )}
            </div>

            {/* ── Charts Row ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={hasExams ? 'lg:col-span-2' : 'hidden'}>
                    <ExamResultChart loading={loading} />
                </div>
                <div className={hasExams ? 'lg:col-span-1' : 'lg:col-span-3'}>
                    <GenderDonutChart loading={loading} />
                </div>
            </div>

            {/* ── Tables & Activity Row ───────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <StarStudentTable loading={loading} />
                </div>
                <div className="lg:col-span-1">
                    <RecentActivity loading={loading} />
                </div>
            </div>
        </div>
    );
};
