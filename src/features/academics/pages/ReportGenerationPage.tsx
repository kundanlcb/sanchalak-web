import React, { useState, useEffect, useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReportCardDocument } from '../components/reports/ReportCardDocument';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Download, FileText, Loader2, Search, User, ChevronRight, Filter } from 'lucide-react';
import { ReportCardPreview } from '../components/reports/ReportCardPreview';
import { Select } from '../../../components/common/Select';
import { useExamTerms } from '../hooks/useExamTerms';
import { useStudentsByClass } from '../hooks/useStudentsByClass';
import { useMarks } from '../hooks/useMarks';
import { useSubjects } from '../hooks/useSubjects';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';

export const ReportGenerationPage: React.FC = () => {
    const { examTerms } = useExamTerms();
    const { subjects, refetch: fetchSubjects } = useSubjects();
    const { classes: schoolClasses, refresh: fetchStructure } = useAcademicStructure();

    // Selection State
    const [selectedClassTerm, setSelectedClassTerm] = useState('');
    const [selectedExamTerm, setSelectedExamTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    // Search State
    const [searchTerm, setSearchTerm] = useState('');

    const [classId, section] = selectedClassTerm.split('|');
    const { students, isLoading: loadingStudents } = useStudentsByClass(classId || '', section || '');

    // Fetch marks for the selected student specifically
    const { marks, isLoading: loadingData } = useMarks({
        studentId: selectedStudentId || '',
        examTermId: selectedExamTerm
    });

    useEffect(() => {
        fetchSubjects();
        fetchStructure();
    }, [fetchSubjects, fetchStructure]);

    // Generate Report Data Logic (Memoized)
    const reportData = useMemo(() => {
        if (!selectedStudentId || !selectedExamTerm || marks.length === 0 || subjects.length === 0) {
            return null;
        }

        const student = students.find(s => String(s.id) === selectedStudentId);
        const exam = examTerms.find(e => e.id === selectedExamTerm);

        if (!student || !exam) return null;

        const subjectMarks = marks.map(mark => {
            const subject = subjects.find(s => s.id === mark.subjectId);
            const maxMarks = (subject as any)?.maxMarks || 100;
            const percentage = (mark.marksObtained / maxMarks) * 100;

            let grade = 'F';
            if (percentage >= 90) grade = 'A+';
            else if (percentage >= 80) grade = 'A';
            else if (percentage >= 70) grade = 'B+';
            else if (percentage >= 60) grade = 'B';
            else if (percentage >= 50) grade = 'C';
            else if (percentage >= 40) grade = 'D';

            return {
                subject: subject?.name || 'Unknown Subject',
                max: maxMarks,
                obtained: mark.marksObtained,
                grade
            };
        });

        const totalMax = subjectMarks.reduce((sum, m) => sum + m.max, 0);
        const totalObtained = subjectMarks.reduce((sum, m) => sum + m.obtained, 0);
        const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

        let finalGrade = 'F';
        if (overallPercentage >= 90) finalGrade = 'A+';
        else if (overallPercentage >= 80) finalGrade = 'A';
        else if (overallPercentage >= 70) finalGrade = 'B+';
        else if (overallPercentage >= 60) finalGrade = 'B';
        else if (overallPercentage >= 50) finalGrade = 'C';
        else if (overallPercentage >= 40) finalGrade = 'D';

        return {
            student: {
                id: String(student.id),
                name: student.name,
                rollNumber: student.rollNumber?.toString() || 'N/A',
                class: String(student.classId) || 'N/A',
                section: student.section || 'A'
            },
            exam: { name: exam.name, year: exam.academicYear },
            marks: subjectMarks,
            summary: {
                totalMax,
                totalObtained,
                percentage: parseFloat(overallPercentage.toFixed(2)),
                finalGrade
            }
        };
    }, [marks, students, subjects, examTerms, selectedStudentId, selectedExamTerm]);

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
            <div className="w-full sm:w-1/3 min-w-[320px] flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700">

                {/* Header & Filters */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Report Cards
                    </h2>

                    <div className="space-y-3">
                        <Select
                            value={selectedExamTerm}
                            onChange={(e) => setSelectedExamTerm(e.target.value)}
                            className="w-full"
                        >
                            <option value="">Select Exam Term</option>
                            {examTerms.map(term => (
                                <option key={term.id} value={term.id}>{term.name}</option>
                            ))}
                        </Select>

                        <Select
                            value={selectedClassTerm}
                            onChange={(e) => setSelectedClassTerm(e.target.value)}
                            className="w-full"
                        >
                            <option value="">Select Class</option>
                            {classOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                    </div>

                    {/* Student Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Type to search students..."
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
                            <span className="text-sm">Select Class & Exam Term to view students</span>
                        </div>
                    ) : !searchTerm.trim() ? (
                        null
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 text-sm">No students found.</div>
                    ) : (
                        filteredStudents.map(student => (
                            <button
                                key={student.id}
                                onClick={() => setSelectedStudentId(String(student.id))}
                                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${selectedStudentId === String(student.id)
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 ring-1 ring-blue-500'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedStudentId === String(student.id)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                        }`}>
                                        {student.rollNumber || '#'}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${selectedStudentId === String(student.id) ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-200'
                                            }`}>
                                            {student.name}
                                        </p>
                                        <p className="text-xs text-gray-500">ID: {student.id}</p>
                                    </div>
                                </div>
                                <ChevronRight className={`w-4 h-4 ${selectedStudentId === String(student.id) ? 'text-blue-500' : 'text-gray-300'
                                    }`} />
                            </button>
                        ))
                    )}
                </div>

                {/* Footer Stats */}
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <span>Matches: {filteredStudents.length}</span>
                    <span>{selectedExamTerm ? 'Term Selected' : 'No Term'}</span>
                </div>
            </div>

            {/* RIGHT SIDEBAR: Content Preview */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">

                {/* Toolbar */}
                <div className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 bg-gray-50/50 dark:bg-gray-900/10">
                    <h3 className="font-medium text-gray-700 dark:text-gray-200">
                        {reportData ? `Report Card: ${reportData.student.name}` : 'Report Preview'}
                    </h3>

                    {reportData && (
                        <div className="flex gap-2">
                            <PDFDownloadLink
                                document={<ReportCardDocument data={reportData} />}
                                fileName={`${reportData.student.name}_${reportData.exam.name}_Report.pdf`}
                            >
                                {({ loading }) => (
                                    <Button size="sm" disabled={loading}>
                                        <Download className="w-4 h-4 mr-2" />
                                        {loading ? 'Preparing...' : 'Download PDF'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    )}
                </div>

                {/* Preview Area */}
                <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-950 p-4 flex items-center justify-center">
                    {!selectedStudentId ? (
                        <div className="text-center text-gray-400 max-w-sm">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-full inline-block mb-4 shadow-sm">
                                <User className="w-12 h-12 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">No Student Selected</h3>
                            <p className="text-sm mt-2">Select a student from the list to view and generate their report card.</p>
                        </div>
                    ) : loadingData ? (
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <p>Generating Report Data...</p>
                        </div>
                    ) : !reportData ? (
                        <div className="text-center text-red-500 bg-red-50 p-6 rounded-lg border border-red-100">
                            <p className="font-medium">Insufficient Data</p>
                            <p className="text-sm mt-1">Marks entries for this exam term might be missing for this student.</p>
                        </div>
                    ) : (
                        <div className="w-full h-full shadow-lg">
                            <ReportCardPreview data={reportData} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
