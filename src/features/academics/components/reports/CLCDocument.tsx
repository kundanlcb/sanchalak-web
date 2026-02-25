import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ReportHeader } from './pdf-components';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Times-Roman', border: '1px solid #000' },
    border: { border: '2pt solid #112143', height: '100%', padding: 20 },
    content: { marginTop: 30, lineHeight: 1.6, fontSize: 12 },
    title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, textDecoration: 'underline' },
    paragraph: { marginBottom: 15, textAlign: 'justify' },
    bold: { fontWeight: 'bold' },
    signatureSection: { marginTop: 80, flexDirection: 'row', justifyContent: 'space-between' },
    sigLine: { borderTopWidth: 1, borderTopColor: '#000', width: 150, textAlign: 'center', paddingTop: 5, fontSize: 10 },
    footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 9, color: '#666' }
});

interface CLCData {
    student: {
        name: string;
        fatherName?: string;
        motherName?: string;
        dateOfBirth?: string;
        admissionDate?: string;
        admissionNumber: string;
        class: string;
        section: string;
        leavingDate?: string;
        reasonForLeaving?: string;
        character?: string;
    };
}

export const CLCDocument: React.FC<{ data: CLCData }> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.border}>
                <ReportHeader title="COLLEGE LEAVING CERTIFICATE (CLC)" />

                <View style={styles.content}>
                    <Text style={styles.paragraph}>
                        This is to certify that <Text style={styles.bold}>{data.student.name.toUpperCase()}</Text>,
                        Son/Daughter of <Text style={styles.bold}>{data.student.fatherName || '____________________'}</Text>
                        and <Text style={styles.bold}>{data.student.motherName || '____________________'}</Text>,
                        was a bonafide student of this institution.
                    </Text>

                    <Text style={styles.paragraph}>
                        He/She was admitted to class <Text style={styles.bold}>{data.student.class}</Text> on
                        <Text style={styles.bold}> {data.student.admissionDate ? new Date(data.student.admissionDate).toLocaleDateString() : '____________'}</Text>
                        with Admission Number <Text style={styles.bold}>{data.student.admissionNumber}</Text>.
                    </Text>

                    <Text style={styles.paragraph}>
                        His/Her Date of Birth as per school records is
                        <Text style={styles.bold}> {data.student.dateOfBirth ? new Date(data.student.dateOfBirth).toLocaleDateString() : '____________'}</Text>.
                    </Text>

                    <Text style={styles.paragraph}>
                        He/She has left the institution on <Text style={styles.bold}>{data.student.leavingDate || new Date().toLocaleDateString()}</Text> due to
                        <Text style={styles.bold}> {data.student.reasonForLeaving || 'Completion of Studies'}</Text>.
                    </Text>

                    <Text style={styles.paragraph}>
                        To the best of my knowledge, his/her character and conduct have been <Text style={styles.bold}>{data.student.character || 'Good'}</Text>.
                    </Text>

                    <Text style={styles.paragraph}>We wish him/her every success in future endeavors.</Text>
                </View>

                <View style={styles.signatureSection}>
                    <View>
                        <View style={styles.sigLine}><Text>Class Teacher</Text></View>
                    </View>
                    <View>
                        <View style={styles.sigLine}><Text>Principal / Headmaster</Text></View>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Serial No: CLC/{new Date().getFullYear()}/{Math.floor(1000 + Math.random() * 9000)}
                </Text>
            </View>
        </Page>
    </Document>
);
