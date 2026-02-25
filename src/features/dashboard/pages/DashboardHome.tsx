import React from 'react';
import { Users, GraduationCap, School, IndianRupee } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { ExamResultChart } from '../components/ExamResultChart';
import { GenderDonutChart } from '../components/GenderDonutChart';
import { StarStudentTable } from '../components/StarStudentTable';
import { RecentActivity } from '../components/RecentActivity';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useAuth } from '../../auth/services/authContext';

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

            {/* ── Welcome Banner ─────────────────────────────────────── */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 p-6 text-white shadow-lg shadow-blue-500/20 overflow-hidden relative">
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

            {/* ── Stats Grid ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Total Students" value={stats ? stats.students.toString() : '...'} icon={Users} color="blue" trend={stats ? 'Active students' : ''} loading={loading} />
                <StatsCard title="Total Teachers" value={stats ? stats.teachers.toString() : '...'} icon={GraduationCap} color="purple" trend={stats ? 'Active faculty' : ''} loading={loading} />
                <StatsCard title="Total Classes" value={stats ? stats.classes.toString() : '...'} icon={School} color="orange" loading={loading} />
                {hasFinance && (
                    <StatsCard title="Monthly Earnings" value={stats ? formatCurrency(stats.monthlyEarnings) : '...'} icon={IndianRupee} color="green" trend={stats ? 'This month' : ''} loading={loading} />
                )}
            </div>

            {/* ── Charts Row ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={hasExams ? 'lg:col-span-2' : 'hidden'}>
                    <ExamResultChart loading={loading} />
                </div>
                <div className={hasExams ? 'lg:col-span-1' : 'lg:col-span-3'}>
                    <GenderDonutChart loading={loading} />
                </div>
            </div>

            {/* ── Tables & Activity Row ──────────────────────────────── */}
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
