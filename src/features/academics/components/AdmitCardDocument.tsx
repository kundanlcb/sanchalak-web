import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { DocumentTemplateData } from '../../finance/services/documentTemplateService';

// Define the exact types matching the raw JSON data returned from the backend AdmitCardController structure
export interface ExamRowInfo {
    subject: string;
    date: string;
    day: string;
    time: string;
    duration: string;
    maxMarks: string;
    shift: string;
}

export interface AdmitCardInfo {
    studentName: string;
    fatherName: string;
    village: string;
    className: string;
    rollNo: string;
    admissionNumber: string;
    photoUrl: string;
    examRows: ExamRowInfo[];
}

export interface AdmitCardDataResponse {
    cards: AdmitCardInfo[];
    template: DocumentTemplateData;
    examTermName: string;
}

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30, // margin around the entire A4 page
        gap: 20, // space between the top card and bottom card
    },
    cardBox: {
        width: '100%',
        height: '48%', // Allows exactly 2 cards per page (with the gap)
        border: '1pt solid #cbd5e1', // Tailwind slate-300
        padding: 15,
        position: 'relative',
    },
    // Header Section
    headerContainer: {
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottom: '1pt solid #e2e8f0', // Tailwind slate-200
    },
    schoolName: {
        fontSize: 16,
        fontWeight: 'extrabold',
        color: '#0f172a',
        marginBottom: 4,
    },
    schoolAddress: {
        fontSize: 10,
        color: '#475569',
        textAlign: 'center',
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 6,
    },
    docTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textDecoration: 'underline',
        color: '#0f172a',
        letterSpacing: 1,
        marginBottom: 4,
    },
    examTerm: {
        fontSize: 12,
        fontWeight: 'medium',
        color: '#1e293b',
    },
    // Student Info Section
    infoSection: {
        width: '75%', // Leave room on the right for the photo
        flexDirection: 'column',
        gap: 6,
    },
    infoRow: {
        flexDirection: 'row',
        fontSize: 10,
    },
    infoLabel: {
        width: 100,
        color: '#475569',
        fontWeight: 'medium',
    },
    infoVal: {
        color: '#0f172a',
        fontWeight: 'bold',
        flex: 1,
    },
    photoBox: {
        position: 'absolute',
        top: 80,
        right: 15,
        width: 70,
        height: 90,
        border: '1pt solid #cbd5e1',
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    photoPlaceholderText: {
        fontSize: 9,
        color: '#94a3b8',
    },
    // Exam Table Section
    tableContainer: {
        marginTop: 15,
        border: '1pt solid #e2e8f0',
        borderRadius: 2,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        borderBottom: '1pt solid #e2e8f0',
    },
    tableHeaderCell: {
        padding: 6,
        fontSize: 9,
        fontWeight: 'bold',
        color: '#334155',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid #f1f5f9',
    },
    tableCell: {
        padding: 6,
        fontSize: 9,
        color: '#0f172a',
        textAlign: 'center',
    },
    // Column widths
    colSubj: { width: '25%' },
    colDate: { width: '15%' },
    colDay: { width: '15%' },
    colTime: { width: '15%' },
    colDuration: { width: '15%' },
    colMarks: { width: '15%' },
    // Footer
    footerNote: {
        marginTop: 'auto', // Push to bottom of the card
        textAlign: 'center',
        fontSize: 8,
        color: '#64748b',
        fontStyle: 'italic',
        borderTop: '1pt dashed #cbd5e1',
        paddingTop: 8,
    }
});

interface AdmitCardDocumentProps {
    data: AdmitCardDataResponse;
}

export const AdmitCardDocument: React.FC<AdmitCardDocumentProps> = ({ data }) => {
    // We want exactly 2 cards per page
    const chunkedCards = [];
    for (let i = 0; i < data.cards.length; i += 2) {
        chunkedCards.push(data.cards.slice(i, i + 2));
    }

    return (
        <Document>
            {chunkedCards.map((pageCards, pageIndex) => (
                <Page size="A4" style={styles.page} key={`page-${pageIndex}`}>
                    {pageCards.map((card, cardIndex) => (
                        <View style={styles.cardBox} key={`card-${cardIndex}`}>

                            {/* Header Section */}
                            <View style={styles.headerContainer}>
                                <Text style={styles.schoolName}>
                                    {data.template?.schoolName || 'YOUR SCHOOL NAME HERE'}
                                </Text>
                                <Text style={styles.schoolAddress}>
                                    {data.template?.addressLine1 || 'School Address Not Provided'} | Mobile: {data.template?.phone1 || 'N/A'}
                                </Text>
                            </View>

                            {/* Titles */}
                            <View style={styles.titleSection}>
                                <Text style={styles.docTitle}>ADMIT CARD</Text>
                                <Text style={styles.examTerm}>{data.examTermName}</Text>
                            </View>

                            {/* Student Data */}
                            <View style={styles.infoSection}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Student Name</Text>
                                    <Text style={styles.infoVal}>: {card.studentName}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Father Name</Text>
                                    <Text style={styles.infoVal}>: {card.fatherName}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Class/Batch</Text>
                                    <Text style={styles.infoVal}>: {card.className}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Roll Number</Text>
                                    <Text style={styles.infoVal}>: {card.rollNo || 'N/A'}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Admission No.</Text>
                                    <Text style={styles.infoVal}>: {card.admissionNumber}</Text>
                                </View>
                            </View>

                            {/* Photo Placeholder absolutely positioned manually */}
                            <View style={styles.photoBox}>
                                {card.photoUrl && card.photoUrl.trim() !== '' ? (
                                    <Image src={card.photoUrl} style={styles.photoImage} />
                                ) : (
                                    <Text style={styles.photoPlaceholderText}>Photo</Text>
                                )}
                            </View>

                            {/* Exams Timetable */}
                            <View style={styles.tableContainer}>
                                <View style={styles.tableHeaderRow}>
                                    <Text style={[styles.tableHeaderCell, styles.colSubj]}>Subject</Text>
                                    <Text style={[styles.tableHeaderCell, styles.colDate]}>Date</Text>
                                    <Text style={[styles.tableHeaderCell, styles.colDay]}>Day</Text>
                                    <Text style={[styles.tableHeaderCell, styles.colTime]}>Time</Text>
                                    <Text style={[styles.tableHeaderCell, styles.colDuration]}>Duration</Text>
                                    <Text style={[styles.tableHeaderCell, styles.colMarks]}>Marks</Text>
                                </View>
                                {card.examRows && card.examRows.length > 0 ? (
                                    card.examRows.map((row, rIdx) => (
                                        <View style={[styles.tableRow, rIdx === card.examRows.length - 1 ? { borderBottom: 0 } : {}]} key={`row-${rIdx}`}>
                                            <Text style={[styles.tableCell, styles.colSubj]}>{row.subject}</Text>
                                            <Text style={[styles.tableCell, styles.colDate]}>{row.date}</Text>
                                            <Text style={[styles.tableCell, styles.colDay]}>{row.day}</Text>
                                            <Text style={[styles.tableCell, styles.colTime]}>{row.time}</Text>
                                            <Text style={[styles.tableCell, styles.colDuration]}>{row.duration}</Text>
                                            <Text style={[styles.tableCell, styles.colMarks]}>{row.maxMarks}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <View style={[styles.tableRow, { borderBottom: 0, paddingVertical: 10 }]}>
                                        <Text style={{ width: '100%', textAlign: 'center', fontSize: 9, color: '#64748b' }}>
                                            No Exam Schedule found for this student.
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Footer Signature */}
                            <Text style={styles.footerNote}>
                                Controller of Examinations / Principal Signature
                            </Text>

                        </View>
                    ))}
                </Page>
            ))}
        </Document>
    );
};
