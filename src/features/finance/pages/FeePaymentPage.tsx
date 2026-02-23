import React, { useEffect, useState } from 'react';
import { usePayment } from '../hooks/usePayment';
import { StudentFeeLedger } from '../components/StudentFeeLedger';
import { PaymentGatewayMock } from '../components/PaymentGatewayMock';
// import { useAuth } from '../../auth/services/authContext';

export const FeePaymentPage: React.FC = () => {
  // const { user } = useAuth(); // Assuming we have logged in user
  const {
    ledger, transactions, isProcessing, error,
    fetchLedger, fetchTransactions, initiatePayment
  } = usePayment();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // MOCK: Hardcode student ID for demo if user context doesn't have it
  const studentId = 'STU-2026-001';
  const studentName = 'Raj Kumar';

  useEffect(() => {
    if (studentId) {
      fetchLedger(studentId);
      fetchTransactions(studentId);
    }
  }, [studentId, fetchLedger, fetchTransactions]);

  const handlePayNow = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (txnId: string) => {
    setIsPaymentModalOpen(false);
    if (ledger) {
      // Record transaction
      await initiatePayment(studentId, ledger.pendingAmount, 'UPI', txnId);
    }
  };

  if (isProcessing && !ledger) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Fee Details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 dark:text-red-400">{error}</div>;
  }

  if (!ledger) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">No fee records found for this student.</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Payment</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage fees for {studentName} ({studentId})</p>
        </div>
      </div>

      <StudentFeeLedger
        ledger={ledger}
        transactions={transactions}
        onPayNow={handlePayNow}
      />

      <PaymentGatewayMock
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={ledger.pendingAmount}
        studentName={studentName}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
