import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReceiptDocument } from './ReceiptDocument';
import type { PaymentTransaction } from '../../types';
import { Download } from 'lucide-react';
import { Button } from '../../../../components/common/Button';

interface ReceiptDownloadButtonProps {
  transaction: PaymentTransaction;
  studentName: string;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ReceiptDownloadButton: React.FC<ReceiptDownloadButtonProps> = ({ 
  transaction, 
  studentName, 
  variant = 'outline',
  size = 'sm',
  className
}) => {
  const buttonVariant = (variant === 'danger' ? 'destructive' : (variant === 'primary' ? 'default' : variant)) as any;
  const buttonSize = (size === 'md' ? 'default' : size) as any;

  return (
    <PDFDownloadLink
      document={<ReceiptDocument transaction={transaction} studentName={studentName} />}
      fileName={`Receipt-${transaction.receiptId || transaction.id}.pdf`}
      className={className}
    >
      {({ loading }) => (
        <Button 
          variant={buttonVariant} 
          size={buttonSize} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          {!loading && <Download className="w-4 h-4" />}
          {loading ? 'Generating...' : 'Receipt'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};
