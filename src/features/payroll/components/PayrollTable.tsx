import React from 'react';
import type { PayrollRecord } from '../types';
import { formatCurrency } from '../../finance/utils/feeUtils';
import { Download, Eye } from 'lucide-react';

interface PayrollTableProps {
  records: PayrollRecord[];
  onView: (record: PayrollRecord) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ records, onView }) => {
  if (records.length === 0) {
    return <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">No payroll records found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{record.staffName}</div>
                  <div className="text-xs text-gray-500">{record.staffId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.presentDays}/{record.workingDays} Days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {formatCurrency(record.netPayable)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${record.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                      record.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => onView(record)}
                      className="text-gray-400 hover:text-blue-600"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {record.status !== 'Draft' && (
                      <button className="text-gray-400 hover:text-green-600" title="Download Slip">
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
      </table>
    </div>
  );
};
