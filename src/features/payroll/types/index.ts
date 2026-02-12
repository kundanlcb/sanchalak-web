// Staff Salary Configuration
export interface SalaryStructure {
  id: string; // PAY-STR-001
  staffId: string; // EMP-001
  academicYear: string;
  baseSalary: number;
  allowances: {
    hra: number;
    da: number;
    ta: number;
  };
  deductions: {
    pf: number;
    tds: number;
  };
  paymentFrequency: 'Monthly';
}

// Monthly Payroll Record
export interface PayrollRecord {
  id: string; // PAY-FEB-2026-EMP-001
  staffId: string;
  staffName: string;
  month: string; // "February 2026"
  workingDays: number;
  presentDays: number;
  lossOfPayDays: number; // Unpaid leave
  
  // Breakdown
  basicPay: number; // Base (prorated)
  allowancesBreakdown?: {
    hra: number;
    da: number;
    ta: number;
  };
  deductionsBreakdown?: {
    pf: number;
    tds: number;
  };
  totalAllowances: number;
  totalDeductions: number;
  netPayable: number;
  
  status: 'Draft' | 'Approved' | 'Paid';
  paymentDate?: string;
  payslipUrl?: string; // Blob URL
}

// Bulk API Response
export interface PayrollSummary {
  month: string;
  totalEmployees: number;
  totalPayout: number;
  status: 'Pending' | 'Processed';
}
