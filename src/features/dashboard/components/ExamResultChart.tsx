import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../../../components/common/Skeleton';

const MOCK_DATA = [
  { name: 'Jan', student: 65, teacher: 75 },
  { name: 'Feb', student: 68, teacher: 78 },
  { name: 'Mar', student: 72, teacher: 80 },
  { name: 'Apr', student: 70, teacher: 76 },
  { name: 'May', student: 75, teacher: 82 },
  { name: 'Jun', student: 78, teacher: 85 },
];

interface ExamResultChartProps {
  loading?: boolean;
}

export const ExamResultChart: React.FC<ExamResultChartProps> = ({ loading }) => {
  if (loading) {
    return <Skeleton className="w-full h-[300px] rounded-xl" />;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance Overview</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={MOCK_DATA}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
            />
            <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
                verticalAlign="bottom" 
                height={60}
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar name="Students (Avg)" dataKey="student" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar name="Teachers (Performance)" dataKey="teacher" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
