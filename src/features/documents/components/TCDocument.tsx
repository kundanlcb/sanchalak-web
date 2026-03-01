import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { DocumentTemplateData } from '../../finance/services/documentTemplateService';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: 40,
        flexDirection: 'column',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        borderBottom: '2pt solid #1e3a8a',
        paddingBottom: 10,
    },
    schoolName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    subHeader: {
        fontSize: 10,
        color: '#6b7280',
        marginTop: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        textDecoration: 'underline',
    },
    bodyText: {
        fontSize: 12,
        lineHeight: 1.8,
        color: '#111827',
        marginTop: 10,
    },
    bold: {
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
        fontSize: 12,
    },
    label: {
        width: 150,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
        borderBottom: '1pt dotted #9ca3af',
    },
    signatures: {
        marginTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sigBox: {
        alignItems: 'center',
    },
    sigLine: {
        width: 150,
        borderBottom: '1pt solid #111827',
        marginBottom: 5,
    },
    sigLabel: {
        fontSize: 10,
        fontWeight: 'bold',
    }
});

export interface TCData {
    studentName: string;
    parentName: string;
    dob: string;
    admissionNo: string;
    dateOfLeaving: string;
    classLeft: string;
    reason: string;
    conduct: string;
    remarks: string;
}

interface TCDocumentProps {
    data: TCData;
    schoolTemplate?: DocumentTemplateData;
}

export const TCDocument: React.FC<TCDocumentProps> = ({ data, schoolTemplate }) => {
    const SCHOOL_NAME = schoolTemplate?.schoolName || 'Sanchalan Public School';

    // Construct address from lines
    let addressParts = [];
    if (schoolTemplate?.addressLine1) addressParts.push(schoolTemplate.addressLine1);
    if (schoolTemplate?.addressLine2) addressParts.push(schoolTemplate.addressLine2);
    const SCHOOL_ADDRESS = addressParts.join(', ') || '123 Education Lane, Knowledge City, State - 123456';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.schoolName}>{SCHOOL_NAME}</Text>
                    <Text style={styles.subHeader}>{SCHOOL_ADDRESS}</Text>
                    <Text style={styles.subHeader}>Affiliated to Central Board of Secondary Education</Text>
                </View>

                <Text style={styles.title}>TRANSFER CERTIFICATE</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>1. Name of Pupil:</Text>
                    <Text style={styles.value}>  {data.studentName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>2. Mother's / Father's Name:</Text>
                    <Text style={styles.value}>  {data.parentName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>3. Nationality:</Text>
                    <Text style={styles.value}>  Indian</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>4. Date of Birth:</Text>
                    <Text style={styles.value}>  {data.dob}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>5. Admission No:</Text>
                    <Text style={styles.value}>  {data.admissionNo}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>6. Class studied last:</Text>
                    <Text style={styles.value}>  {data.classLeft}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>7. Date of leaving:</Text>
                    <Text style={styles.value}>  {data.dateOfLeaving}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>8. Reason for leaving:</Text>
                    <Text style={styles.value}>  {data.reason}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>9. General Conduct:</Text>
                    <Text style={styles.value}>  {data.conduct}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>10. Any other remarks:</Text>
                    <Text style={styles.value}>  {data.remarks}</Text>
                </View>

                <Text style={styles.bodyText}>
                    This is to certify that the above mentioned information is in accordance with the school register. All dues have been cleared.
                </Text>

                <View style={styles.signatures}>
                    <View style={styles.sigBox}>
                        <View style={styles.sigLine}></View>
                        <Text style={styles.sigLabel}>Class Teacher</Text>
                    </View>
                    <View style={styles.sigBox}>
                        <View style={styles.sigLine}></View>
                        <Text style={styles.sigLabel}>Principal</Text>
                        <Text style={styles.sigLabel}>(Seal)</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
