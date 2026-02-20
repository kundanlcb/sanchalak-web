import React, { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Play } from 'lucide-react';

interface PayrollGeneratorProps {
  onGenerate: (month: string) => Promise<void>;
  isGenerating: boolean;
}

export const PayrollGenerator: React.FC<PayrollGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleGenerate = async () => {
    if (!selectedMonth) return;
    await onGenerate(selectedMonth);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-end gap-4">
        <div className="w-64">
          <label htmlFor="payroll-month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payroll Period
          </label>
          <input
            type="month"
            id="payroll-month"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border dark:text-white"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
        <Button
          onClick={handleGenerate}
          disabled={!selectedMonth || isGenerating}
        >
          {isGenerating ? 'Generating...' : <><Play className="w-4 h-4 mr-2" /> Generate Payroll</>}
        </Button>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Generating payroll will calculate salaries based on attendance and configured structure for all active staff.
      </p>
    </div>
  );
};
