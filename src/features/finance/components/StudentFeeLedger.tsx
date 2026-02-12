import React from 'react';
import type { StudentFeeRecord, PaymentTransaction } from '../types';
import { formatCurrency } from '../utils/feeUtils';
import { Button } from '../../../components/common/Button';
import { Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import { ReceiptDownloadButton } from './receipts/ReceiptDownloadButton';

interface StudentFeeLedgerProps {
  ledger: StudentFeeRecord;
  transactions: PaymentTransaction[];
  onPayNow: () => void;
}

export const StudentFeeLedger: React.FC<StudentFeeLedgerProps> = ({ 
  ledger, 
  transactions,
  onPayNow
}) => {
  const isOverdue = ledger.pendingAmount > 0 && differenceInDays(new Date(), parseISO(ledger.dueDate)) > 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Total Payable</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(ledger.totalAmount)}</p>
          <p className="text-xs text-blue-600 mt-1">Academic Year {ledger.academicYear}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Paid So Far</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(ledger.paidAmount)}</p>
          <p className="text-xs text-gray-400 mt-1">{transactions.filter(t => t.status === 'Success').length} successful transactions</p>
        </div>

        <div className={`p-4 sm:p-6 rounded-xl shadow-sm border ${isOverdue ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
          <p className={`${isOverdue ? 'text-red-600' : 'text-gray-500'} text-sm font-medium`}>Remaining Due</p>
          <div className="flex justify-between items-end">
            <div>
              <p className={`text-2xl font-bold mt-2 ${isOverdue ? 'text-red-700' : 'text-gray-900'}`}>
                {formatCurrency(ledger.pendingAmount)}
              </p>
              {isOverdue && (
                <div className="flex items-center text-red-600 text-xs mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  <span>Overdue by {differenceInDays(new Date(), parseISO(ledger.dueDate))} days</span>
                </div>
              )}
            </div>
            {ledger.pendingAmount > 0 && (
              <Button onClick={onPayNow} size="sm" variant={isOverdue ? 'destructive' : 'default'}>
                Pay Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-4 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
             <Download className="w-4 h-4" />
             <span className="hidden sm:inline">Statement</span>
          </Button>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Transaction ID</th>
                  <th className="px-6 py-3 font-medium">Method</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(txn.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {txn.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {txn.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(txn.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${txn.status === 'Success' ? 'bg-green-100 text-green-800' : 
                          txn.status === 'Failed' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {txn.status === 'Success' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {txn.status === 'Failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {txn.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {txn.status === 'Success' && (
                        <ReceiptDownloadButton 
                          transaction={txn} 
                          studentName="Student" // TODO: Pass real name
                          variant="ghost"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
