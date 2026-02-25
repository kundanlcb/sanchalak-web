import React from 'react';
import { Users, GraduationCap, School, IndianRupee } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { ExamResultChart } from '../components/ExamResultChart';
import { GenderDonutChart } from '../components/GenderDonutChart';
import { StarStudentTable } from '../components/StarStudentTable';
import { RecentActivity } from '../components/RecentActivity';
import { QuickLinks } from '../components/QuickLinks';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useAuth } from '../../auth/services/authContext';

export const DashboardHome: React.FC = () => {
    const { stats, loading } = useDashboardStats();
    const { user } = useAuth();
    const permissions = user?.permissions || [];

    const hasFinance = user?.role === 'Admin' || permissions.includes('FINANCE') || permissions.includes('FEES');
    const hasExams = user?.role === 'Admin' || permissions.includes('EXAMS');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, here's what's happening today.</p>
                </div>
            </div>

            {/* Quick Links */}
            <QuickLinks />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Students"
                    value={stats ? stats.students.toString() : "..."}
                    icon={Users}
                    color="blue"
                    trend={stats ? "Active students" : ""}
                    loading={loading}
                />
                <StatsCard
                    title="Total Teachers"
                    value={stats ? stats.teachers.toString() : "..."}
                    icon={GraduationCap}
                    color="purple"
                    trend={stats ? "Active faculty" : ""}
                    loading={loading}
                />
                <StatsCard
                    title="Total Classes"
                    value={stats ? stats.classes.toString() : "..."}
                    icon={School}
                    color="orange"
                    loading={loading}
                />
                {hasFinance && (
                    <StatsCard
                        title="Monthly Earnings"
                        value={stats ? formatCurrency(stats.monthlyEarnings) : "..."}
                        icon={IndianRupee}
                        color="green"
                        trend={stats ? "This month" : ""}
                        loading={loading}
                    />
                )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={hasExams ? "lg:col-span-2" : "hidden"}>
                    <ExamResultChart loading={loading} />
                </div>
                <div className={hasExams ? "lg:col-span-1" : "lg:col-span-3"}>
                    <GenderDonutChart loading={loading} />
                </div>
            </div>

            {/* Tables & Activity Row */}
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
