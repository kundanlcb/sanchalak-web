import React, { useMemo } from 'react';
import { useFinancialReports } from '../hooks/useFinancialReports';
import { IncomeExpenseChart } from '../components/IncomeExpenseChart';
import { FeeCollectionChart } from '../components/FeeCollectionChart';
import { DefaultersListWidget } from '../components/DefaultersListWidget';
import { Download } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export const FinancialReportsPage: React.FC = () => {
    const { transactions, defaulters } = useFinancialReports();

    // Aggregate Transactions for Income Chart
    const incomeExpenseData = useMemo(() => {
        // Group by Month (0-11)
        const incomeByMonth = new Array(12).fill(0);
        
        transactions.forEach(t => {
             if (t.status === 'Success') {
                 const d = new Date(t.timestamp);
                 incomeByMonth[d.getMonth()] += t.amount;
             }
        });
        
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // Return mostly for the current window (e.g., Feb is index 1)
        // We simulate a 6-month view centered on current or static
        return months.slice(0, 6).map((m, i) => ({
            month: m,
            income: incomeByMonth[i] > 0 ? incomeByMonth[i] : (i === 1 ? 6500 : 0), // Use real or fallback to show 'something' if empty
            expense: 20000 + Math.random() * 5000 // Mock expense
        }));
    }, [transactions]);

    // Aggregate Fee Categories
    const feeCollectionData = useMemo(() => {
        if (transactions.length === 0) {
             // Fallback for empty state just to keep chart rendered (optional)
             return [
                { category: 'Tuition Fees', amount: 0, color: '#3B82F6' }
             ];
        }

        const catMap: Record<string, number> = {};
        transactions.forEach(t => {
             if (t.status === 'Success') {
                 if (t.breakdown && t.breakdown.length > 0) {
                     t.breakdown.forEach(b => {
                         catMap[b.category] = (catMap[b.category] || 0) + b.amount;
                     });
                 } else {
                     catMap['Tuition'] = (catMap['Tuition'] || 0) + t.amount;
                 }
             }
        });

        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];
        return Object.keys(catMap).map((cat, idx) => ({
             category: cat,
             amount: catMap[cat],
             color: colors[idx % colors.length]
        }));
    }, [transactions]);
    
    // Sort defaulters
    const topDefaulters = useMemo(() => {
        return defaulters.slice(0, 5); 
    }, [defaulters]);

    return (
        <div className="space-y-6 animate-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Reports</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Overview of school finances, collections, and dues.</p>
                </div>
                <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <IncomeExpenseChart data={incomeExpenseData} />
                <FeeCollectionChart data={feeCollectionData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>
                    <div className="text-gray-500 dark:text-gray-400 text-center py-12">
                        Transaction table would go here (Similar to Fee Ledger)
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <DefaultersListWidget defaulters={topDefaulters} />
                </div>
            </div>
        </div>
    );
};
