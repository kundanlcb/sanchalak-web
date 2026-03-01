import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from '../../../components/common/Skeleton';
import type { GenderData } from '../types/dashboard.types';

interface GenderDonutChartProps {
  loading?: boolean;
  data?: GenderData;
}

export const GenderDonutChart: React.FC<GenderDonutChartProps> = ({ loading, data }) => {
  if (loading && !data) {
    return <Skeleton className="w-full h-[300px] rounded-xl" />;
  }

  const chartData = data ? [
    { name: 'Boys', value: data.MALE || 0, color: '#3B82F6' }, // blue-500
    { name: 'Girls', value: data.FEMALE || 0, color: '#EC4899' }, // pink-500
    ...(data.OTHER ? [{ name: 'Other', value: data.OTHER, color: '#9CA3AF' }] : []) // gray-400
  ].filter(item => item.value > 0) : [];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-8 self-start">Student Distribution</h3>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
            <PieChart className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No distribution data</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">
            Add student records to see the distribution by gender.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Student Distribution</h3>
      <div className="flex-1 flex items-center justify-center min-h-[250px] relative">
        <div className="w-full h-full absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Center Text (Total) */}
        <div className="pointer-events-none flex flex-col items-center justify-center mt-[-36px]">
          <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{total}</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
        </div>
      </div>
    </div>
  );
};
