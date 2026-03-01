import React, { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Skeleton } from '../../../components/common/Skeleton';
import { TrendingUp } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useDashboardGrowth } from '../hooks/useDashboardGrowth';

interface GrowthGraphProps { }

export const GrowthGraph: React.FC<GrowthGraphProps> = () => {
    const [duration, setDuration] = useState<'1M' | '3M' | '6M'>('6M');
    const { data: chartData, loading } = useDashboardGrowth(duration);

    if (loading && (!chartData || chartData.length === 0)) {
        return <Skeleton className="w-full h-[350px] rounded-2xl" />;
    }

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Financial & Student Growth</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly progression of collections and admissions</p>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-1 rounded-xl">
                    {(['1M', '3M', '6M'] as const).map((d) => (
                        <button
                            key={d}
                            onClick={() => setDuration(d)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200",
                                duration === d
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
                            tickFormatter={formatCurrency}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-2xl">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{label} Report</p>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-10">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Collections</span>
                                                    </div>
                                                    <span className="text-sm font-black text-gray-900 dark:text-white">₹{payload[0].value?.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-10">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Students</span>
                                                    </div>
                                                    <span className="text-sm font-black text-gray-900 dark:text-white">{payload[1].value}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="collections"
                            stroke="#22C55E"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorCollections)"
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="students"
                            stroke="#EAB308"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorStudents)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Admissions</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12.5%</span>
                </div>
            </div>
        </div>
    );
};
