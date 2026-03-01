import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { DocumentTemplateData } from '../../finance/services/documentTemplateService';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#f8fafc',
        padding: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
    },
    // Portrait Layout (Minimalist & Premium)
    cardPortrait: {
        width: 210, // ~54mm (CR80 standard)
        height: 330, // ~86mm
        border: '1pt solid #e2e8f0',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
    },
    headerBoxPortrait: {
        paddingTop: 16,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    schoolNamePortrait: {
        color: '#0f172a',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    schoolAddressPortrait: {
        color: '#64748b',
        fontSize: 6,
        textAlign: 'center',
        marginTop: 2,
        paddingHorizontal: 10,
    },
    badgePortrait: {
        marginTop: 8,
        backgroundColor: '#f1f5f9',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    badgeTextPortrait: {
        color: '#334155',
        fontSize: 6,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    photoContainerPortrait: {
        alignSelf: 'center',
        marginTop: 14,
        width: 76,
        height: 76,
        borderRadius: 38,
        border: '1pt solid #e2e8f0',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
    },
    photo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    detailsPortrait: {
        marginTop: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    studentNamePortrait: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0f172a',
        textAlign: 'center',
        marginBottom: 2,
    },
    studentClassPortrait: {
        fontSize: 9,
        color: '#3b82f6',
        fontWeight: 'bold',
        marginBottom: 12,
    },
    infoGridPortrait: {
        width: '100%',
        flexDirection: 'column',
        gap: 5,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '0.5pt solid #f1f5f9',
        paddingBottom: 3,
    },
    infoLabelPortrait: {
        fontSize: 7,
        color: '#94a3b8',
        fontWeight: 'heavy',
        textTransform: 'uppercase',
    },
    infoValuePortrait: {
        fontSize: 8,
        color: '#334155',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    footerPortrait: {
        marginTop: 'auto',
        height: 18,
        backgroundColor: '#0f172a',
        borderBottomLeftRadius: 9, // Slightly less than card radius to prevent clipping glitch
        borderBottomRightRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerTextPortrait: {
        color: '#ffffff',
        fontSize: 6,
        letterSpacing: 1.5,
    },

    // Landscape Layout (Minimalist & Premium)
    cardLandscape: {
        width: 330,
        height: 210,
        border: '1pt solid #e2e8f0',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
    },
    leftPanelLandscape: {
        width: 110,
        borderRight: '1pt solid #f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    photoContainerLandscape: {
        width: 70,
        height: 70,
        borderRadius: 35,
        border: '1pt solid #e2e8f0',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        marginBottom: 10,
    },
    badgeLandscape: {
        backgroundColor: '#f1f5f9',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    badgeTextLandscape: {
        color: '#334155',
        fontSize: 6,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    rightPanelLandscape: {
        flex: 1,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
    },
    schoolNameLandscape: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f172a',
        letterSpacing: 0.5,
    },
    schoolAddressLandscape: {
        color: '#64748b',
        fontSize: 6,
        marginTop: 2,
        marginBottom: 12,
    },
    studentNameLandscape: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 2,
    },
    studentClassLandscape: {
        fontSize: 9,
        color: '#3b82f6',
        fontWeight: 'bold',
        marginBottom: 12,
    },
    infoGridLandscape: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 8,
    },
    infoColLandscape: {
        width: '50%',
        paddingRight: 10,
    },
    infoLabelLandscape: {
        fontSize: 6,
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    infoValueLandscape: {
        fontSize: 8,
        color: '#334155',
        fontWeight: 'bold',
    },
    addressBlockLandscape: {
        marginTop: 8,
        paddingTop: 8,
        borderTop: '0.5pt solid #f1f5f9',
    },
});

export interface IDCardData {
    id: string;
    name: string;
    rollNumber: string;
    className: string;
    section: string;
    bloodGroup: string;
    dob: string;
    parentName: string;
    phone: string;
    address: string;
    photoUrl?: string;
}

interface IDCardDocumentProps {
    students: IDCardData[];
    layoutType?: 'portrait' | 'landscape';
    schoolTemplate?: DocumentTemplateData;
}

const PLACEHOLDER_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239CA3AF"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" /></svg>';

export const IDCardDocument: React.FC<IDCardDocumentProps> = ({
    students,
    layoutType = 'portrait',
    schoolTemplate
}) => {
    const isPortrait = layoutType === 'portrait';
    const SCHOOL_NAME = schoolTemplate?.schoolName || 'Sanchalan Public School';

    // Construct address from lines
    let addressParts = [];
    if (schoolTemplate?.addressLine1) addressParts.push(schoolTemplate.addressLine1);
    if (schoolTemplate?.addressLine2) addressParts.push(schoolTemplate.addressLine2);
    const SCHOOL_ADDRESS = addressParts.join(', ') || '123 Education Lane, Knowledge City, State - 123456';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {students.map((student, index) => (
                    <View key={index} style={isPortrait ? styles.cardPortrait : styles.cardLandscape} wrap={false}>

                        {isPortrait ? (
                            // PORTRAIT STRUCTURE (Minimal & Premium)
                            <React.Fragment>
                                <View style={styles.headerBoxPortrait}>
                                    <Text style={styles.schoolNamePortrait}>{SCHOOL_NAME}</Text>
                                    <Text style={styles.schoolAddressPortrait}>{SCHOOL_ADDRESS}</Text>
                                    <View style={styles.badgePortrait}>
                                        <Text style={styles.badgeTextPortrait}>STUDENT ID</Text>
                                    </View>
                                </View>

                                <View style={styles.photoContainerPortrait}>
                                    <Image src={student.photoUrl || PLACEHOLDER_AVATAR} style={styles.photo} />
                                </View>

                                <View style={styles.detailsPortrait}>
                                    <Text style={styles.studentNamePortrait}>{student.name}</Text>
                                    <Text style={styles.studentClassPortrait}>Class: {student.className} - {student.section}</Text>

                                    <View style={styles.infoGridPortrait}>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabelPortrait}>Roll No</Text>
                                            <Text style={styles.infoValuePortrait}>{student.rollNumber}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabelPortrait}>D.O.B</Text>
                                            <Text style={styles.infoValuePortrait}>{student.dob}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabelPortrait}>Blood Grp</Text>
                                            <Text style={styles.infoValuePortrait}>{student.bloodGroup}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabelPortrait}>Phone</Text>
                                            <Text style={styles.infoValuePortrait}>{student.phone}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.footerPortrait}>
                                    <Text style={styles.footerTextPortrait}>VALID FOR ACADEMIC YEAR</Text>
                                </View>
                            </React.Fragment>
                        ) : (
                            // LANDSCAPE STRUCTURE (Minimal & Premium)
                            <React.Fragment>
                                <View style={styles.leftPanelLandscape}>
                                    <View style={styles.photoContainerLandscape}>
                                        <Image src={student.photoUrl || PLACEHOLDER_AVATAR} style={styles.photo} />
                                    </View>
                                    <View style={styles.badgeLandscape}>
                                        <Text style={styles.badgeTextLandscape}>STUDENT ID</Text>
                                    </View>
                                </View>

                                <View style={styles.rightPanelLandscape}>
                                    <Text style={styles.schoolNameLandscape}>{SCHOOL_NAME}</Text>
                                    <Text style={styles.schoolAddressLandscape}>{SCHOOL_ADDRESS}</Text>

                                    <Text style={styles.studentNameLandscape}>{student.name}</Text>
                                    <Text style={styles.studentClassLandscape}>Class: {student.className} - {student.section}</Text>

                                    <View style={styles.infoGridLandscape}>
                                        <View style={styles.infoColLandscape}>
                                            <Text style={styles.infoLabelLandscape}>Roll No</Text>
                                            <Text style={styles.infoValueLandscape}>{student.rollNumber}</Text>
                                        </View>
                                        <View style={styles.infoColLandscape}>
                                            <Text style={styles.infoLabelLandscape}>D.O.B</Text>
                                            <Text style={styles.infoValueLandscape}>{student.dob}</Text>
                                        </View>
                                        <View style={styles.infoColLandscape}>
                                            <Text style={styles.infoLabelLandscape}>Blood Group</Text>
                                            <Text style={styles.infoValueLandscape}>{student.bloodGroup}</Text>
                                        </View>
                                        <View style={styles.infoColLandscape}>
                                            <Text style={styles.infoLabelLandscape}>Phone</Text>
                                            <Text style={styles.infoValueLandscape}>{student.phone}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.addressBlockLandscape}>
                                        <Text style={styles.infoLabelLandscape}>Student Address</Text>
                                        <Text style={styles.infoValueLandscape}>{student.address || 'N/A'}</Text>
                                    </View>
                                </View>
                            </React.Fragment>
                        )}

                    </View>
                ))}
            </Page>
        </Document>
    );
};
