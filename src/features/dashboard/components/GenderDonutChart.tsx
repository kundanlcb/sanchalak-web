import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from '../../../components/common/Skeleton';

const data = [
  { name: 'Boys', value: 450, color: '#3B82F6' }, // Blue-500
  { name: 'Girls', value: 380, color: '#EC4899' }, // Pink-500
];

interface GenderDonutChartProps {
  loading?: boolean;
}

export const GenderDonutChart: React.FC<GenderDonutChartProps> = ({ loading }) => {
  if (loading) {
    return <Skeleton className="w-full h-[300px] rounded-xl" />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Distribution</h3>
      <div className="h-[250px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text (Total) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
           <div className="text-center">
             <span className="text-2xl font-bold text-gray-900 dark:text-white">830</span>
             <p className="text-xs text-gray-500">Total</p>
           </div>
        </div>
      </div>
    </div>
  );
};
