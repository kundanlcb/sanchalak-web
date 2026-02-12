import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { PayrollRecord } from '../types';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#112143',
    paddingBottom: 10,
    textAlign: 'center'
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112143',
    marginBottom: 4,
  },
  docTitle: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  staffInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 4,
  },
  infoCol: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cell: {
    padding: 5,
    fontSize: 10,
  },
  colParams: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  colAmount: {
    width: '25%',
    textAlign: 'right',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  colAmountLast: {
    width: '25%',
    textAlign: 'right',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#112143',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 5,
  },
  netPay: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#112143',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netPayLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#112143',
  },
  netPayValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#112143',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
  }
});

interface PayslipDocumentProps {
  record: PayrollRecord;
}

export const PayslipDocument: React.FC<PayslipDocumentProps> = ({ record }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>Sanchalan Public School</Text>
          <Text style={styles.docTitle}>Payslip for {record.month}</Text>
        </View>

        {/* Staff Info */}
        <View style={styles.staffInfo}>
          <View style={styles.infoCol}>
            <Text style={styles.label}>STAFF NAME</Text>
            <Text style={styles.value}>{record.staffName}</Text>
            <Text style={styles.label}>STAFF ID</Text>
            <Text style={styles.value}>{record.staffId}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.label}>PAY PERIOD</Text>
            <Text style={styles.value}>{record.month}</Text>
            <Text style={styles.label}>WORK DAYS / PRESENT</Text>
            <Text style={styles.value}>{record.workingDays} / {record.presentDays}</Text>
          </View>
        </View>

        {/* Earnings */}
        <Text style={styles.sectionHeader}>Earnings</Text>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.colParams]}>Description</Text>
            <Text style={[styles.cell, styles.colAmountLast]}>Amount</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.cell, styles.colParams]}>Basic Salary</Text>
            <Text style={[styles.cell, styles.colAmountLast]}>{formatCurrency(record.basicPay)}</Text>
          </View>
          
          {record.allowancesBreakdown && (
            <>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.colParams]}>HRA</Text>
                <Text style={[styles.cell, styles.colAmountLast]}>{formatCurrency(record.allowancesBreakdown.hra)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.colParams]}>DA</Text>
                <Text style={[styles.cell, styles.colAmountLast]}>{formatCurrency(record.allowancesBreakdown.da)}</Text>
              </View>
               <View style={styles.row}>
                <Text style={[styles.cell, styles.colParams]}>TA</Text>
                <Text style={[styles.cell, styles.colAmountLast]}>{formatCurrency(record.allowancesBreakdown.ta)}</Text>
              </View>
            </>
          )}

          <View style={styles.totalRow}>
             <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>Total Earnings</Text>
             <Text style={[styles.cell, { fontWeight: 'bold' }]}>{formatCurrency(record.totalAllowances + record.basicPay)}</Text>
          </View>
        </View>

        {/* Deductions */}
        <Text style={styles.sectionHeader}>Deductions</Text>
        <View style={styles.table}>
           <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.colParams]}>Description</Text>
            <Text style={[styles.cell, styles.colAmountLast]}>Amount</Text>
          </View>

          {record.deductionsBreakdown && (
            <>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.colParams]}>Provident Fund (PF)</Text>
                <Text style={[styles.cell, styles.colAmountLast]}>{formatCurrency(record.deductionsBreakdown.pf)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.colParams]}>TDS / Tax</Text>
                <Text style={[styles.cell, styles.colAmountLast]}>{formatCurrency(record.deductionsBreakdown.tds)}</Text>
              </View>
            </>
          )}

          <View style={styles.totalRow}>
             <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>Total Deductions</Text>
             <Text style={[styles.cell, { fontWeight: 'bold' }]}>{formatCurrency(record.totalDeductions)}</Text>
          </View>
        </View>

        {/* Net Pay */}
        <View style={styles.netPay}>
          <Text style={styles.netPayLabel}>NET PAYABLE AMOUNT</Text>
          <Text style={styles.netPayValue}>{formatCurrency(record.netPayable)}</Text>
        </View>
        
        <Text style={{ marginTop: 5, fontSize: 9, fontStyle: 'italic', color: '#666' }}>
          By Bank Transfer
        </Text>

        {/* Footer */}
        <Text style={styles.footer}>
          computer generated document • no signature required • {format(new Date(), 'dd MMM yyyy HH:mm')}
        </Text>
      </Page>
    </Document>
  );
};
