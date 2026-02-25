import React, { useState, useEffect, useMemo } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { ReportCardDocument } from '../components/reports/ReportCardDocument';
import { FeeSlipDocument } from '../components/reports/FeeSlipDocument';
import { CLCDocument } from '../components/reports/CLCDocument';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Download, FileText, Loader2, Search, User, ChevronRight, Filter, Wallet, GraduationCap, FileCheck } from 'lucide-react';
import { Select } from '../../../components/common/Select';
import { useExamTerms } from '../hooks/useExamTerms';
import { useStudentsByClass } from '../hooks/useStudentsByClass';
import { useSubjects } from '../hooks/useSubjects';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useReportData, type ReportCategory } from '../hooks/useReportData';
import { cn } from '../../../utils/cn';

export const ReportGenerationPage: React.FC = () => {
    const { examTerms } = useExamTerms();
    const { subjects, refetch: fetchSubjects } = useSubjects();
    const { classes: schoolClasses, refresh: fetchStructure } = useAcademicStructure();

    // Selection State
    const [category, setCategory] = useState<ReportCategory>('Academic');
    const [selectedClassTerm, setSelectedClassTerm] = useState('');
    const [selectedExamTerm, setSelectedExamTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [reportType, setReportType] = useState('Marksheet');

    // Search State
    const [searchTerm, setSearchTerm] = useState('');

    const [classId, section] = selectedClassTerm.split('|');
    const { students, isLoading: loadingStudents } = useStudentsByClass(classId || '', section || '');

    // Unified Data Hook
    const { student, academic, finance, isLoading: loadingData } = useReportData({
        category,
        reportType,
        studentId: selectedStudentId || undefined,
        examTermId: selectedExamTerm || undefined,
    });

    useEffect(() => {
        fetchSubjects();
        fetchStructure();
    }, [fetchSubjects, fetchStructure]);

    // Report Type Options based on Category
    const reportTypeOptions = useMemo(() => {
        if (category === 'Academic') return [{ value: 'Marksheet', label: 'Student Marksheet' }];
        if (category === 'Finance') return [{ value: 'Fee Slip', label: 'Fee Challan/Slip' }];
        if (category === 'Certificates') return [
            { value: 'CLC', label: 'College Leaving Certificate' },
            { value: 'Character', label: 'Character Certificate' }
        ];
        return [];
    }, [category]);

    // Reset report type when category changes
    useEffect(() => {
        setReportType(reportTypeOptions[0]?.value || '');
    }, [category, reportTypeOptions]);

    // Process Academic Report Data
    const academicReportData = useMemo(() => {
        if (!student || !selectedExamTerm || academic.marks.length === 0 || subjects.length === 0) return null;
        const exam = examTerms.find(e => e.id === selectedExamTerm);
        if (!exam) return null;

        const subjectMarks = academic.marks.map(mark => {
            const subject = subjects.find(s => s.id === mark.subjectId);
            const maxMarks = (subject as any)?.maxMarks || 100;
            const percentage = (mark.marksObtained / maxMarks) * 100;
            // Simplified grading for demo
            let grade = 'F';
            if (percentage >= 90) grade = 'A+';
            else if (percentage >= 80) grade = 'A';
            else if (percentage >= 70) grade = 'B+';
            else if (percentage >= 60) grade = 'B';
            else if (percentage >= 50) grade = 'C';
            else if (percentage >= 40) grade = 'D';

            return {
                subject: subject?.name || 'Unknown',
                max: maxMarks,
                obtained: mark.marksObtained,
                grade
            };
        });

        const totalMax = subjectMarks.reduce((sum, m) => sum + m.max, 0);
        const totalObtained = subjectMarks.reduce((sum, m) => sum + m.obtained, 0);
        const percentage = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(2)) : 0;

        return {
            student: {
                name: student.name,
                rollNumber: String(student.rollNumber),
                class: String(student.classId),
                section: student.section
            },
            exam: { name: exam.name, year: exam.academicYear },
            marks: subjectMarks,
            summary: { totalMax, totalObtained, percentage, finalGrade: 'Pass' } // Simplified
        };
    }, [student, selectedExamTerm, academic.marks, subjects, examTerms]);

    // Formatted Finance Data
    const financeReportData = useMemo(() => {
        if (!student || !finance.ledger) return null;
        return {
            student: {
                name: student.name,
                rollNumber: String(student.rollNumber),
                admissionNumber: student.admissionNumber,
                class: String(student.classId),
                section: student.section
            },
            ledger: {
                totalAmount: finance.ledger.totalAmount,
                paidAmount: finance.ledger.paidAmount,
                pendingAmount: finance.ledger.pendingAmount,
                dueDate: finance.ledger.dueDate
            },
            transactions: finance.transactions.map(t => ({
                date: t.timestamp,
                amount: t.amount,
                method: t.paymentMethod,
                status: t.status
            }))
        };
    }, [student, finance.ledger, finance.transactions]);

    // Formatted Certificate Data
    const certificateData = useMemo(() => {
        if (!student) return null;
        return {
            student: {
                name: student.name,
                fatherName: student.primaryParent?.name,
                dateOfBirth: student.dateOfBirth,
                admissionDate: student.admissionDate,
                admissionNumber: student.admissionNumber,
                class: String(student.classId),
                section: student.section,
                character: 'Very Good'
            }
        };
    }, [student]);

    // Current Document Component Selection
    const CurrentDocument = useMemo(() => {
        if (category === 'Academic' && academicReportData) return <ReportCardDocument data={academicReportData as any} />;
        if (category === 'Finance' && financeReportData) return <FeeSlipDocument data={financeReportData as any} />;
        if (category === 'Certificates' && certificateData) return <CLCDocument data={certificateData as any} />;
        return null;
    }, [category, academicReportData, financeReportData, certificateData]);

    // Derived filtered students
    const filteredStudents = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return students.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.rollNumber && s.rollNumber.toString().includes(searchTerm))
        );
    }, [students, searchTerm]);

    const classOptions = useMemo(() => {
        return schoolClasses.map(c => ({
            value: `${c.id}|${c.section}`,
            label: c.className || `Class ${c.grade} - ${c.section}`
        }));
    }, [schoolClasses]);

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col sm:flex-row gap-6">

            {/* LEFT SIDEBAR: Controls & List */}
            <div className="w-full sm:w-1/3 min-w-[340px] flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700">

                {/* Category Selection Tabs */}
                <div className="grid grid-cols-3 p-1 bg-gray-100 dark:bg-gray-900 rounded-t-xl">
                    <button
                        onClick={() => setCategory('Academic')}
                        className={cn(
                            "flex flex-col items-center gap-1 py-3 rounded-lg text-[10px] font-bold transition-all",
                            category === 'Academic' ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        <GraduationCap className="w-4 h-4" />
                        ACADEMIC
                    </button>
                    <button
                        onClick={() => setCategory('Finance')}
                        className={cn(
                            "flex flex-col items-center gap-1 py-3 rounded-lg text-[10px] font-bold transition-all",
                            category === 'Finance' ? "bg-white dark:bg-gray-800 text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        <Wallet className="w-4 h-4" />
                        FINANCE
                    </button>
                    <button
                        onClick={() => setCategory('Certificates')}
                        className={cn(
                            "flex flex-col items-center gap-1 py-3 rounded-lg text-[10px] font-bold transition-all",
                            category === 'Certificates' ? "bg-white dark:bg-gray-800 text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        <FileCheck className="w-4 h-4" />
                        CERTIFICATES
                    </button>
                </div>

                {/* Header & Filters */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="space-y-3">
                        <Select
                            label="Report Sub-type"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full"
                        >
                            {reportTypeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>

                        <Select
                            label="Target Class"
                            value={selectedClassTerm}
                            onChange={(e) => setSelectedClassTerm(e.target.value)}
                            className="w-full"
                        >
                            <option value="">Select Class</option>
                            {classOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>

                        {category === 'Academic' && (
                            <Select
                                label="Exam Term"
                                value={selectedExamTerm}
                                onChange={(e) => setSelectedExamTerm(e.target.value)}
                                className="w-full"
                            >
                                <option value="">Select Exam Term</option>
                                {examTerms.map(term => (
                                    <option key={term.id} value={term.id}>{term.name}</option>
                                ))}
                            </Select>
                        )}
                    </div>

                    {/* Student Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search student for report..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                            disabled={!selectedClassTerm}
                        />
                    </div>
                </div>

                {/* Student List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {loadingStudents ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="text-xs">Loading Students...</span>
                        </div>
                    ) : !selectedClassTerm ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2 text-center p-4">
                            <Filter className="w-8 h-8 opacity-20" />
                            <span className="text-sm">Select Class to view students</span>
                        </div>
                    ) : (
                        filteredStudents.map(student => (
                            <button
                                key={student.id}
                                onClick={() => {
                                    setSelectedStudentId(String(student.id));
                                    if (category === 'Finance') {
                                        finance.fetchLedger(student.id);
                                        finance.fetchTransactions(student.id);
                                    }
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all border",
                                    selectedStudentId === String(student.id)
                                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                                        : "bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                                        selectedStudentId === String(student.id) ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700"
                                    )}>
                                        {student.rollNumber || '#'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{student.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">ID: {student.id}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: Content Preview */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">

                {/* Toolbar */}
                <div className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 bg-gray-50/50 dark:bg-gray-900/10">
                    <h3 className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {reportType} Preview
                    </h3>

                    {CurrentDocument && (
                        <PDFDownloadLink
                            document={CurrentDocument}
                            fileName={`${reportType}_${student?.name || 'Report'}.pdf`}
                        >
                            {({ loading }) => (
                                <Button size="sm" disabled={loading}>
                                    <Download className="w-4 h-4 mr-2" />
                                    {loading ? 'Generating...' : 'Download PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>

                {/* Preview Area */}
                <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-950 p-4 flex items-center justify-center">
                    {!selectedStudentId ? (
                        <div className="text-center text-gray-400 max-w-sm">
                            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">No Student Selected</h3>
                            <p className="text-sm mt-1">Select a student from the list to preview their {reportType}.</p>
                        </div>
                    ) : loadingData ? (
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <p className="text-sm">Preparing {reportType} Preview...</p>
                        </div>
                    ) : !CurrentDocument ? (
                        <div className="text-center text-red-500 max-w-md bg-red-50 p-6 rounded-lg border border-red-100">
                            <p className="font-bold">Missing Report Data</p>
                            <p className="text-xs mt-2">Ensure all required fields (Exam Terms, Fee Ledgers, etc.) are available for the selected student.</p>
                        </div>
                    ) : (
                        <div className="w-full h-full shadow-2xl border dark:border-gray-700 rounded-lg overflow-hidden">
                            <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: 'none' }}>
                                {CurrentDocument}
                            </PDFViewer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
