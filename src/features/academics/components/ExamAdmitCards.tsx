import React, { useState, useEffect, useMemo } from 'react';
import { useExamTerms } from '../hooks/useExamTerms';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useStudentsByClass } from '../hooks/useStudentsByClass';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { Download, Loader2, Users, FileText } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { useToast } from '../../../components/common/ToastContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AdmitCardDocument } from './AdmitCardDocument';
import type { AdmitCardDataResponse } from './AdmitCardDocument';

export const ExamAdmitCards: React.FC = () => {
    const { examTerms } = useExamTerms();
    const { classes: schoolClasses, refresh: fetchStructure } = useAcademicStructure();
    const { showToast } = useToast();

    const [selectedClassTerm, setSelectedClassTerm] = useState('');
    const [selectedExamTerm, setSelectedExamTerm] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [admitCardData, setAdmitCardData] = useState<AdmitCardDataResponse | null>(null);

    const [classId, section] = selectedClassTerm.split('|');
    const { students, isLoading: loadingStudents } = useStudentsByClass(classId || '', section || '');

    useEffect(() => {
        fetchStructure();
    }, [fetchStructure]);

    const classOptions = useMemo(() => {
        return schoolClasses.map(c => ({
            value: `${c.id}|${c.section}`,
            label: c.className || `Class ${c.grade} - ${c.section}`
        }));
    }, [schoolClasses]);

    // Automatically load preview when selection changes
    useEffect(() => {
        if (selectedStudentIds.length > 0 && selectedExamTerm && classId && section) {
            handlePreviewSelection();
        } else {
            setAdmitCardData(null);
        }
    }, [selectedStudentIds, selectedExamTerm, classId, section]);

    useEffect(() => {
        // Reset selections when class changes
        setSelectedStudentIds([]);
    }, [selectedClassTerm]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudentIds(students.map(s => String(s.id)));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const handleSelectStudent = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedStudentIds(prev => [...prev, id]);
        } else {
            setSelectedStudentIds(prev => prev.filter(sId => sId !== id));
        }
    };

    const isAllSelected = students.length > 0 && selectedStudentIds.length === students.length;

    const handlePreviewSelection = async () => {
        if (!selectedExamTerm) return;

        setIsLoadingPreview(true);
        setAdmitCardData(null);

        try {
            let response;
            // If ONLY ONE student is selected, use the individual endpoint for optimization
            if (selectedStudentIds.length === 1) {
                response = await apiClient.post<AdmitCardDataResponse>(
                    '/api/documents/admit-card/data',
                    {
                        studentId: Number(selectedStudentIds[0]),
                        examTermId: Number(selectedExamTerm)
                    }
                );
            }
            // For multiple or all students, use the bulk endpoint with the selected IDs
            else if (selectedStudentIds.length > 1) {
                response = await apiClient.post<AdmitCardDataResponse>(
                    '/api/documents/admit-card/bulk/data',
                    {
                        classId: Number(classId),
                        section,
                        examTermId: Number(selectedExamTerm),
                        studentIds: selectedStudentIds.map(id => Number(id))
                    }
                );
            } else {
                setIsLoadingPreview(false);
                return;
            }

            setAdmitCardData(response.data);
        } catch (err) {
            showToast('Failed to load Admit Card preview.', 'error');
            console.error(err);
        } finally {
            setIsLoadingPreview(false);
        }
    };

    return (
        <div className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Admit Cards</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generate and download admit cards for exams.</p>
                </div>
                {admitCardData && admitCardData.cards.length > 0 && (
                    <PDFDownloadLink
                        document={<AdmitCardDocument data={admitCardData} />}
                        fileName={`Bulk_AdmitCards_${classId}_${section}.pdf`}
                    >
                        {({ loading }) => (
                            <Button
                                disabled={loading || !selectedExamTerm || !selectedClassTerm}
                                className="flex items-center shadow-lg shadow-blue-500/20"
                            >
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                {loading ? 'Preparing PDF...' : 'Download Class Bundle'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-6 min-h-[calc(100vh-16rem)]">
                {/* LEFT PANEL: Filters & Student List */}
                <div className="w-full lg:w-1/3 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
                        <Select
                            label="Select Exam Term"
                            value={selectedExamTerm}
                            onChange={(e) => setSelectedExamTerm(e.target.value)}
                            className="w-full"
                        >
                            <option value="">Choose Exam...</option>
                            {examTerms.map(term => (
                                <option key={term.id} value={term.id}>{term.name}</option>
                            ))}
                        </Select>

                        <Select
                            label="Select Class"
                            value={selectedClassTerm}
                            onChange={(e) => setSelectedClassTerm(e.target.value)}
                            className="w-full"
                        >
                            <option value="">Choose Class...</option>
                            {classOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                    </div>

                    {/* List Container */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50 min-h-[300px]">
                        {!selectedExamTerm ? (
                            <div className="flex flex-col items-center py-4 text-gray-500 text-sm">
                                <FileText className="w-8 h-8 mb-2 text-gray-400" />
                                <span>Select an Exam Term to begin</span>
                            </div>
                        ) : loadingStudents ? (
                            <div className="flex flex-col items-center py-4 text-gray-500">
                                <Loader2 className="w-6 h-6 animate-spin mb-2 text-blue-500" />
                                <span className="text-sm">Loading students...</span>
                            </div>
                        ) : !selectedClassTerm ? (
                            <div className="flex flex-col items-center py-4 text-gray-500 text-sm">
                                <Users className="w-8 h-8 mb-2 text-gray-400" />
                                <span>Select a class to load students</span>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="flex flex-col items-center py-4 text-gray-500 text-sm">
                                <span>No students found in this class.</span>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b dark:border-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={isAllSelected}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                        />
                                        Select All
                                    </label>
                                    <span className="text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                                        {selectedStudentIds.length} Selected
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    {students.map(student => (
                                        <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedStudentIds.includes(String(student.id))}
                                                onChange={(e) => handleSelectStudent(String(student.id), e.target.checked)}
                                            />
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{student.name}</p>
                                                <p className="text-[10px] text-gray-500">Roll: {student.rollNumber || 'N/A'}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: Live PDF Preview */}
                <div className="flex-1 bg-gray-100 dark:bg-gray-950 rounded-xl shadow-inner border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col relative h-[600px] lg:h-auto">
                    {admitCardData && admitCardData.cards.length === 1 && (
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <PDFDownloadLink
                                document={<AdmitCardDocument data={admitCardData} />}
                                fileName={`AdmitCard_${selectedStudentIds[0]}.pdf`}
                            >
                                {({ loading }) => (
                                    <Button size="sm" variant="default" disabled={loading} className="shadow-lg shadow-blue-500/20">
                                        <Download className="w-4 h-4 mr-2" />
                                        {loading ? 'Preparing...' : 'Download Card'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    )}

                    {selectedStudentIds.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <FileText className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-700" />
                            <p className="text-lg font-medium text-gray-500">No Student Selected</p>
                            <p className="text-sm mt-1">Select a student (or all) from the list to preview their Admit Card.</p>
                        </div>
                    ) : isLoadingPreview ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                            <p>Loading document from server...</p>
                        </div>
                    ) : admitCardData ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 m-4">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Admit Cards Ready
                            </h3>
                            <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                                Successfully generated admit cards for {admitCardData.cards.length} {admitCardData.cards.length === 1 ? 'student' : 'students'}.
                                Live preview is disabled due to strict security headers in this environment. Please download to view.
                            </p>

                            <PDFDownloadLink
                                document={<AdmitCardDocument data={admitCardData} />}
                                fileName={selectedStudentIds.length === 1 ? `AdmitCard_${selectedStudentIds[0]}.pdf` : `Bulk_AdmitCards_${classId}_${section}.pdf`}
                            >
                                {({ loading }) => (
                                    <Button
                                        size="lg"
                                        disabled={loading}
                                        className="shadow-lg shadow-blue-500/20 px-8 py-6 text-lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                                Preparing PDF...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-6 h-6 mr-3" />
                                                Download PDF Document
                                            </>
                                        )}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-red-400">
                            <FileText className="w-16 h-16 mb-4 text-red-300 dark:text-red-900" />
                            <p className="text-lg font-medium">Preview Failed</p>
                            <p className="text-sm mt-1">Could not render the document.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
