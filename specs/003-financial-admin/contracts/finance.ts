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
