// Fee Category Definition
export type FeeFrequency = 'Monthly' | 'Quarterly' | 'Annual' | 'OneTime';
export type FeeType = 'Tuition' | 'Transport' | 'Exam' | 'Lab' | 'Library' | 'Activity' | 'Other';

export interface FeeCategory {
  id: string; // F-CAT-001
  name: string; 
  description?: string;
  type: FeeType;
  frequency: FeeFrequency;
  isMandatory: boolean;
  active: boolean;
}

// Fee Structure Configuration (Assigned to Grade)
export interface FeeStructure {
  id: string; // FS-2026-G5-001
  academicYear: string; // "2025-2026"
  classId: string; // CLS-2026-005 (Grade 5)
  categoryId: string; // F-CAT-001
  amount: number;
  dueDateDay: number; // 10th of applicable month
  lateFeeRule?: {
    gracePeriodDays: number;
    penaltyType: 'Fixed' | 'Percentage';
    penaltyAmount: number;
  };
}

// Student Individual Fee Record
export interface StudentFeeRecord {
  id: string; // SFR-STU-001
  studentId: string; // STU-2026-001
  feeStructureId: string; // FS-2026-G5-001
  academicYear: string;
  totalAmount: number; // Base + Late - Discounts
  paidAmount: number;
  pendingAmount: number; // Total - Paid
  status: 'Paid' | 'Partial' | 'Overdue' | 'Pending';
  dueDate: string; // ISO Date
  lastPaymentDate?: string;
  transactions: string[]; // List of TXN IDs
}

// API Responses
export interface FeeStructureResponse {
  year: string;
  structures: FeeStructure[];
}

export interface StudentLedgerResponse {
  summary: {
    totalDue: number;
    totalPaid: number;
    totalPending: number;
  };
  records: StudentFeeRecord[];
}

// Payment Flow
export type PaymentMethod = 'UPI' | 'Card' | 'Cash' | 'Cheque';
export type PaymentStatus = 'Pending' | 'Success' | 'Failed' | 'Refunded';

export interface PaymentTransaction {
  id: string; // TXN-2026-001
  studentId: string; // STU-2026-001
  amount: number;
  paymentMethod: PaymentMethod;
  paymentGatewayRefId?: string; // raz_pay_123
  status: PaymentStatus;
  timestamp: string; // ISO 8601
  receiptId?: string; // RCP-2026-001
  breakdown: {
    category: string; // "Tuition"
    amount: number;
  }[];
}

export interface Receipt {
  id: string; // RCP-2026-001
  transactionId: string; // TXN-2026-001
  receiptNumber: string; // Human Readable: REC-001
  studentName: string;
  classId: string;
  amountPaid: number;
  issuedDate: string;
  paymentMode: PaymentMethod;
  generatedByUserId?: string; // Admin ID or 'System'
  downloadUrl?: string; // Blob URL
}

// Payment Gateway Mock
export interface PaymentIntent {
  amount: number;
  studentId: string;
  feeIds: string[]; // List of FeeStructure IDs being paid for
}

export interface PaymentConfirmation {
  transactionId: string;
  status: 'Success';
  receiptUrl?: string;
}
