import React, { useState, useEffect } from 'react';
import { PayrollStats } from '../components/PayrollStats';
import { PayrollTable } from '../components/PayrollTable';
import { PayrollGenerator } from '../components/PayrollGenerator';
import { SalaryConfigForm } from '../components/SalaryConfigForm';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Settings, Download } from 'lucide-react';
import type { PayrollRecord } from '../types';
import type { SalaryStructureFormData } from '../types/schema';
import { BlobProvider } from '@react-pdf/renderer';
import { PayslipDocument } from '../components/PayslipDocument';
import { useToast } from '../../../components/common/ToastContext';

export const PayrollPage: React.FC = () => {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const { showToast } = useToast();

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/payroll/history');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Failed to fetch payroll history', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async (month: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: month.split('-')[1], year: month.split('-')[0] }) // rudimentary parsing, ideally use date-fns
      });
      
      if (res.ok) {
        showToast('Payroll generated successfully', 'success');
        await fetchHistory();
      } else {
        showToast('Failed to generate payroll', 'error');
      }
    } catch (error) {
      showToast('Error generating payroll', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfigSave = async (_data: SalaryStructureFormData) => {
    // Mock save
    showToast('Salary structure updated', 'success');
    setShowConfig(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Payroll</h1>
          <p className="mt-1 text-sm text-gray-500">Manage salaries, payslips, and compensation structures.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowConfig(true)}
          className="w-full sm:w-auto"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configure Structure
        </Button>
      </div>

      <PayrollStats records={records} />

      <PayrollGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payroll History</h2>
        </div>
        <div className="overflow-x-auto">
          <PayrollTable 
            records={records} 
            onView={(record) => setSelectedRecord(record)} 
          />
        </div>
      </div>

      {/* Config Modal */}
      <Modal 
        isOpen={showConfig} 
        onClose={() => setShowConfig(false)}
        title="Valid Salary Configuration"
      >
        <SalaryConfigForm 
          onSubmit={handleConfigSave}
          initialData={{
            academicYear: '2025-2026',
            baseSalary: 40000,
            allowances: { hra: 12000, da: 3000, ta: 2000 },
            deductions: { pf: 1800, tds: 2500 },
            paymentFrequency: 'Monthly'
          }}
        />
      </Modal>

      {/* Payslip View Modal */}
      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title="Payslip Details"
      >
        {selectedRecord && (
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-gray-50 p-4 rounded">
                <div>
                    <h3 className="font-bold text-lg">{selectedRecord.staffName}</h3>
                    <p className="text-sm text-gray-500">{selectedRecord.month}</p>
                </div>
                 <div className="text-right">
                    <p className="text-sm text-gray-500">Net Pay</p>
                    <p className="font-bold text-xl text-green-600">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(selectedRecord.netPayable)}</p>
                </div>
             </div>

             <div className="border rounded-md p-4 bg-white/50">
                <h4 className="font-medium mb-2 border-b pb-2">Breakdown</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold text-gray-600 mb-1">Earnings</p>
                        <div className="flex justify-between"><span>Basic</span> <span>{selectedRecord.basicPay}</span></div>
                        <div className="flex justify-between"><span>Allowances</span> <span>{selectedRecord.totalAllowances}</span></div>
                    </div>
                    <div>
                         <p className="font-semibold text-gray-600 mb-1">Deductions</p>
                         <div className="flex justify-between"><span>Total Deductions</span> <span>{selectedRecord.totalDeductions}</span></div>
                    </div>
                </div>
             </div>

             <div className="pt-4 flex justify-end">
                <BlobProvider document={<PayslipDocument record={selectedRecord} />}>
                  {({ url, loading }) => (
                    <a 
                      href={url || '#'} 
                      target="_blank"
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {loading ? 'Generating...' : <><Download className="w-4 h-4 mr-2"/> Download PDF</>}
                    </a>
                  )}
                </BlobProvider>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
