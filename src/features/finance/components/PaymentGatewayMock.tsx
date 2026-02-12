import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { formatCurrency } from '../utils/feeUtils';

interface PaymentGatewayMockProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  studentName: string;
  onSuccess: (txnId: string) => void;
  // onFailure: (error: string) => void;
}

export const PaymentGatewayMock: React.FC<PaymentGatewayMockProps> = ({
  isOpen,
  onClose,
  amount,
  studentName,
  onSuccess,
  // onFailure
}) => {
  const [step, setStep] = useState<'method' | 'processing' | 'result'>('method');
  // const [method, setMethod] = useState<'UPI' | 'Card' | null>(null);
  const [, setMethod] = useState<'UPI' | 'Card' | null>(null);
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('method');
      setMethod(null);
      setStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = (selectedMethod: 'UPI' | 'Card') => {
    setMethod(selectedMethod);
    setStep('processing');

    // Simulate Network Delay
    setTimeout(() => {
      // 90% Success Rate
      const isSuccess = Math.random() > 0.1;
      
      setStatus(isSuccess ? 'success' : 'failed');
      setStep('result');

      if (isSuccess) {
        // Generate Mock Txn ID
        const txnId = `TXN-${Date.now()}`;
        // Auto close after 2 seconds
        setTimeout(() => {
          onSuccess(txnId);
        }, 2000);
      } else {
        // Let user retry
        // onFailure('Payment Failed'); 
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span className="font-semibold">Secure Payment Gateway</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 text-center">
            <p className="text-gray-500 text-sm">Paying for {studentName}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(amount)}</p>
          </div>

          {step === 'method' && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Select Payment Method:</p>
              
              <button 
                onClick={() => handlePay('UPI')}
                className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-white border">
                  📱
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">UPI / QR Code</p>
                  <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </button>

              <button 
                onClick={() => handlePay('Card')}
                className="w-full flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-white border">
                  💳
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Credit / Debit Card</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                </div>
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Processing Payment...</h3>
              <p className="text-gray-500 text-sm mt-2">Please do not close this window.</p>
            </div>
          )}

          {step === 'result' && status === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-green-600">Payment Successful!</h3>
              <p className="text-gray-500 text-sm mt-2 mb-4">Redirecting back to app...</p>
              
              {/* Note: We don't have the full transaction object here yet, it's created on the server after this returns.
                  In a real app, the verification step would return the Transaction object.
                  For this mock, we can't show the download button immediately without the txn object.
                  So we just show success message.
              */}
            </div>
          )}

          {step === 'result' && status === 'failed' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-red-600">Payment Failed</h3>
              <p className="text-gray-500 text-sm mt-2 mb-6">Bank declined the transaction.</p>
              <Button onClick={() => setStep('method')} className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center text-xs text-gray-400 border-t">
          Secured by Sanchalak Mock Gateway (Test Mode)
        </div>
      </div>
    </div>
  );
};
