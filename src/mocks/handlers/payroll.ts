import { http, HttpResponse, delay } from 'msw';
import payrollData from '../data/payroll.json';
import type { PayrollRecord, SalaryStructure } from '../../features/payroll/types';

// In-memory storage
let structures: SalaryStructure[] = [...(payrollData.structures as unknown as SalaryStructure[])];
let records: PayrollRecord[] = [...(payrollData.records as unknown as PayrollRecord[])];

export const payrollHandlers = [
  // Salary Config
  http.get('/api/payroll/config', async () => {
    await delay(300);
    return HttpResponse.json(structures);
  }),
  
  // Payroll History
  http.get('/api/payroll/history', async () => {
    await delay(300);
    return HttpResponse.json(records);
  }),

  // Generate Payroll (Bulk)
  http.post('/api/payroll/generate', async ({ request }) => {
    await delay(1500); // Simulate processing time
    const { month, year } = await request.json() as { month: string, year: string };
    
    // Mock generation: create a record for EMP-001 if not exists
    const newRecord: PayrollRecord = {
      id: `PAY-${month}-${year}-EMP-001`,
      staffId: 'EMP-001',
      staffName: 'Mr. Amit Singh',
      month: `${month} ${year}`,
      workingDays: 22,
      presentDays: 22,
      lossOfPayDays: 0,
      basicPay: 40000,
      allowancesBreakdown: {
        hra: 12000,
        da: 3000,
        ta: 2000
      },
      deductionsBreakdown: {
        pf: 1800,
        tds: 5500
      },
      totalAllowances: 17000,
      totalDeductions: 7300,
      netPayable: 49700,
      status: 'Draft'
    };
    
    records.push(newRecord);
    
    return HttpResponse.json({
      month: `${month} ${year}`,
      totalEmployees: 1,
      totalPayout: 49700,
      status: 'Processed'
    });
  })
];
