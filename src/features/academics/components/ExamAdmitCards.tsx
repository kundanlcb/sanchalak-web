import React, { useState, useEffect, useMemo } from 'react';
import { useExamTerms } from '../hooks/useExamTerms';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useStudentsByClass } from '../hooks/useStudentsByClass';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { Download, Loader2, Users, FileText } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { useToast } from '../../../components/common/ToastContext';

export const ExamAdmitCards: React.FC = () => {
    const { examTerms } = useExamTerms();
    const { classes: schoolClasses, refresh: fetchStructure } = useAcademicStructure();
    const { showToast } = useToast();

    const [selectedClassTerm, setSelectedClassTerm] = useState('');
    const [selectedExamTerm, setSelectedExamTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');

    const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

    // Cleanup object URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl) window.URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // Automatically load preview when student changes
    useEffect(() => {
        if (selectedStudentId && selectedExamTerm) {
            handlePreviewIndividual(selectedStudentId);
        } else {
            setPreviewUrl(null);
        }
    }, [selectedStudentId, selectedExamTerm]);

    useEffect(() => {
        // Reset selections when class changes
        setSelectedStudentId('');
    }, [selectedClassTerm]);

    const handleSelectStudent = (id: string) => {
        setSelectedStudentId(id);
    };

    const handlePreviewIndividual = async (studentId: string) => {
        if (!selectedExamTerm) return;

        setIsLoadingPreview(true);
        if (previewUrl) {
            window.URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }

        try {
            const response = await apiClient.post(
                '/api/documents/admit-card',
                {
                    studentId: Number(studentId),
                    examTermId: Number(selectedExamTerm)
                },
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setPreviewUrl(url);
        } catch (err) {
            showToast('Failed to load Admit Card preview.', 'error');
            console.error(err);
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleDownloadIndividual = async () => {
        if (!selectedExamTerm || !selectedStudentId) {
            showToast('Please select an Exam Term and Student.', 'error');
            return;
        }

        try {
            const response = await apiClient.post(
                '/api/documents/admit-card',
                {
                    studentId: Number(selectedStudentId),
                    examTermId: Number(selectedExamTerm)
                },
                { responseType: 'blob' }
            );

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `AdmitCard_${selectedStudentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showToast('Admit Card downloaded successfully.', 'success');
        } catch (err) {
            showToast('Failed to download Admit Card.', 'error');
            console.error(err);
        }
    };

    const handleDownloadBulk = async () => {
        if (!selectedExamTerm || !classId || !section) {
            showToast('Please select both a Class and an Exam Term.', 'error');
            return;
        }

        setIsGeneratingBulk(true);
        try {
            const response = await apiClient.post(
                '/api/documents/admit-card/bulk',
                {
                    classId: Number(classId),
                    section,
                    examTermId: Number(selectedExamTerm)
                },
                { responseType: 'blob' }
            );

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bulk_AdmitCards_${classId}_${section}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showToast('Bulk Admit Cards downloaded successfully.', 'success');
        } catch (err) {
            showToast('Failed to download Bulk Admit Cards.', 'error');
            console.error(err);
        } finally {
            setIsGeneratingBulk(false);
        }
    };

    return (
        <div className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Admit Cards</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generate and download admit cards for exams.</p>
                </div>
                <Button
                    onClick={handleDownloadBulk}
                    disabled={!selectedExamTerm || !selectedClassTerm || isGeneratingBulk}
                    className="flex items-center shadow-lg shadow-blue-500/20"
                >
                    {isGeneratingBulk ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    Download Class Bundle
                </Button>
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
                            <div className="space-y-1">
                                {students.map(student => (
                                    <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            name="admit_student_select"
                                            className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedStudentId === String(student.id)}
                                            onChange={() => handleSelectStudent(String(student.id))}
                                        />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{student.name}</p>
                                            <p className="text-[10px] text-gray-500">Roll: {student.rollNumber || 'N/A'}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: Live PDF Preview */}
                <div className="flex-1 bg-gray-100 dark:bg-gray-950 rounded-xl shadow-inner border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col relative h-[600px] lg:h-auto">
                    {previewUrl && (
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <Button size="sm" variant="default" onClick={handleDownloadIndividual} className="shadow-lg shadow-blue-500/20">
                                <Download className="w-4 h-4 mr-2" />
                                Download Card
                            </Button>
                        </div>
                    )}

                    {!selectedStudentId ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <FileText className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-700" />
                            <p className="text-lg font-medium text-gray-500">No Student Selected</p>
                            <p className="text-sm mt-1">Select a student from the list to preview their Admit Card.</p>
                        </div>
                    ) : isLoadingPreview ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                            <p>Loading document from server...</p>
                        </div>
                    ) : previewUrl ? (
                        <div className="flex-1 w-full h-full p-2">
                            <iframe src={previewUrl} className="w-full h-full rounded-lg shadow-md border-0 bg-white" title="PDF Preview" />
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
