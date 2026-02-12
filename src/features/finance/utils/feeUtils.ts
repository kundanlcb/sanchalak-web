import { differenceInDays, isAfter, parseISO } from 'date-fns';
import type { FeeStructure } from '../types';

/**
 * Calculate late fee based on due date and rules
 */
export const calculateLateFee = (
  structure: FeeStructure,
  dueDate: string,
  paymentDate: Date = new Date()
): number => {
  if (!structure.lateFeeRule) return 0;

  const due = parseISO(dueDate);
  if (!isAfter(paymentDate, due)) return 0;

  const overdueDays = differenceInDays(paymentDate, due);
  const { gracePeriodDays, penaltyType, penaltyAmount } = structure.lateFeeRule;

  if (overdueDays <= gracePeriodDays) return 0;

  // Apply penalty
  if (penaltyType === 'Fixed') {
    return penaltyAmount;
  } else {
    // Percentage
    return (structure.amount * penaltyAmount) / 100;
  }
};

/**
 * Calculate discounts (Mock implementation)
 * In a real app, strict rules would be passed in
 */
export const calculateDiscounts = (
  studentId: string,
  baseAmount: number
): { amount: number; description: string }[] => {
  const discounts = [];
  
  // Mock Logic: If student ID ends in '2', they get a Sibling Discount
  if (studentId.endsWith('2')) {
    discounts.push({
      amount: baseAmount * 0.10, // 10%
      description: 'Sibling Discount (10%)'
    });
  }

  // Mock Logic: If student ID ends in '9', Merit Discount
  if (studentId.endsWith('9')) {
    discounts.push({
      amount: 500,
      description: 'Merit Scholarship'
    });
  }

  return discounts;
};

/**
 * Calculate total payable amount for a fee structure
 */
export const calculateFeePayable = (
  structure: FeeStructure,
  studentId: string
) => {
  // 1. Base Amount
  const base = structure.amount;
  
  // 2. Late Fee (Assuming standard due date for current academic year is passed for demo)
  // For demo: Use current date vs fixed due date logic from structure
  // We'll mock a due date for current month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const dueDate = new Date(currentYear, currentMonth, structure.dueDateDay || 10).toISOString();
  
  const lateFee = calculateLateFee(structure, dueDate);

  // 3. Discounts
  const discounts = calculateDiscounts(studentId, base);
  const totalDiscount = discounts.reduce((sum, d) => sum + d.amount, 0);

  // 4. Final
  const total = base + lateFee - totalDiscount;

  return {
    base,
    lateFee,
    discounts,
    totalDiscount,
    total,
    dueDate
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
