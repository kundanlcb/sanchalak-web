import React from 'react';
import type { PayrollRecord } from '../types';
import { formatCurrency } from '../../finance/utils/feeUtils';
import { DollarSign, Users, CheckCircle, Clock } from 'lucide-react';

interface PayrollStatsProps {
  records: PayrollRecord[];
}

export const PayrollStats: React.FC<PayrollStatsProps> = ({ records }) => {
  const totalPayroll = records.reduce((sum, r) => sum + r.netPayable, 0);
  const totalPaid = records.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.netPayable, 0);
  const paidCount = records.filter(r => r.status === 'Paid').length;
  const pendingCount = records.filter(r => r.status !== 'Paid').length;

  const stats = [
    {
      label: 'Total Payroll',
      value: formatCurrency(totalPayroll),
      icon: DollarSign,
      color: 'text-blue-600',
      bgContext: 'bg-blue-100'
    },
    {
      label: 'Amount Paid',
      value: formatCurrency(totalPaid),
      icon: CheckCircle,
      color: 'text-green-600',
      bgContext: 'bg-green-100'
    },
    {
      label: 'Employees Paid',
      value: paidCount.toString(),
      icon: Users,
      color: 'text-purple-600',
      bgContext: 'bg-purple-100'
    },
    {
      label: 'Pending Approval',
      value: pendingCount.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bgContext: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgContext} dark:bg-opacity-30 transition-colors`}>
              <stat.icon className={`w-6 h-6 ${stat.color} dark:text-inherit`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
