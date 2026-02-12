export interface IncomeExpenseData {
  month: string;
  income: number;
  expense: number;
}

export interface FeeCollectionData {
  category: string;
  amount: number;
  color?: string;
}

export interface FeeDefaulter {
  id: string;
  studentName: string;
  studentId: string;
  grade: string;
  amountDue: number;
  daysOverdue: number;
}
