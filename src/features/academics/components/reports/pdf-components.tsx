import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#112143',
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#112143',
    textTransform: 'uppercase',
  },
  schoolAddress: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginTop: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 10,
  },
});

export const ReportHeader = ({ title }: { title: string }) => (
  <View>
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.schoolName}>Sanchalan High School</Text>
        <Text style={styles.schoolAddress}>123 Academic Road, Knowledge City, INDIA</Text>
      </View>
      <View>
        {/* Logo placeholder */}
        <View style={{ width: 50, height: 50, backgroundColor: '#eee', borderRadius: 25 }} />
      </View>
    </View>
    <Text style={styles.reportTitle}>{title}</Text>
  </View>
);

export const ReportCardHeader = () => <ReportHeader title="ANNUAL REPORT CARD" />;

interface MarksTableProps {
  data: Array<{ subject: string; max: number; obtained: number; grade: string }>;
}

export const MarksTable: React.FC<MarksTableProps> = ({ data }) => (
  <View style={styles.table}>
    <View style={styles.tableRow}>
      <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Subject</Text></View>
      <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Max Marks</Text></View>
      <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Obtained</Text></View>
      <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Grade</Text></View>
    </View>
    {data.map((row, i) => (
      <View style={styles.tableRow} key={i}>
        <View style={styles.tableCol}><Text style={styles.tableCell}>{row.subject}</Text></View>
        <View style={styles.tableCol}><Text style={styles.tableCell}>{row.max}</Text></View>
        <View style={styles.tableCol}><Text style={styles.tableCell}>{row.obtained}</Text></View>
        <View style={styles.tableCol}><Text style={styles.tableCell}>{row.grade}</Text></View>
      </View>
    ))}
  </View>
);
