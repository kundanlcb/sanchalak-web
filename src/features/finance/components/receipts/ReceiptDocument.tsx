import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { PaymentTransaction } from '../../types';
import { format } from 'date-fns';

// Create styles
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#112143',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
  },
  receiptInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 4,
  },
  infoGroup: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 10,
    color: '#111827',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 2,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '70%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#E5E7EB',
  },
  tableColAmount: {
    width: '30%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#E5E7EB',
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    color: '#4B5563',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 20,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  statusBadge: {
    padding: 4,
    backgroundColor: '#DCFCE7',
    color: '#166534',
    fontSize: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});

interface ReceiptDocumentProps {
  transaction: PaymentTransaction;
  studentName: string;
}

export const ReceiptDocument: React.FC<ReceiptDocumentProps> = ({ transaction, studentName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SANCHALAK HIGH SCHOOL</Text>
          <Text style={styles.subtitle}>Excellence in Education Since 1995</Text>
          <Text style={styles.subtitle}>123 Knowledge Park, New Delhi, India 110001</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.title}>RECEIPT</Text>
          <Text style={styles.statusBadge}>PAID</Text>
        </View>
      </View>

      {/* Info Grid */}
      <View style={styles.receiptInfo}>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Receipt No</Text>
          <Text style={styles.value}>{transaction.receiptId || `RCP-${transaction.id.slice(-6)}`}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{format(new Date(transaction.timestamp), 'PPpp')}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Student ID</Text>
          <Text style={styles.value}>{transaction.studentId}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Student Name</Text>
          <Text style={styles.value}>{studentName}</Text>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.receiptInfo}>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>{transaction.paymentMethod}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Gateway Ref</Text>
          <Text style={styles.value}>{transaction.paymentGatewayRefId}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{transaction.status}</Text>
        </View>
      </View>

      {/* Fee Breakdown Table */}
      <Text style={styles.sectionTitle}>Fee Details</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Description</Text>
          </View>
          <View style={styles.tableColAmount}>
            <Text style={styles.tableCellHeader}>Amount (INR)</Text>
          </View>
        </View>
        
        {transaction.breakdown.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.category}</Text>
            </View>
            <View style={styles.tableColAmount}>
              <Text style={styles.tableCell}>{item.amount.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Paid:</Text>
        <Text style={styles.totalAmount}>₹ {transaction.amount.toLocaleString('en-IN')}</Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        This is a computer-generated receipt and does not require a physical signature.
        {'\n'}Thank you for your timely payment.
        {'\n'}For any queries, please contact accounts@sanchalak.edu.in
      </Text>
    </Page>
  </Document>
);
