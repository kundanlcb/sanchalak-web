import React, { useState, useEffect, useMemo } from 'react';
import { useExamTerms } from '../hooks/useExamTerms';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useStudentsByClass } from '../hooks/useStudentsByClass';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { Download, Loader2, Users, FileText, BarChart3 } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { useToast } from '../../../components/common/ToastContext';

export const ExamResultsMarksheet: React.FC = () => {
    const { examTerms } = useExamTerms();
    const { classes: schoolClasses, refresh: fetchStructure } = useAcademicStructure();
    const { showToast } = useToast();

    const [selectedClassTerm, setSelectedClassTerm] = useState('');
    const [selectedExamTerm, setSelectedExamTerm] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

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

    const handleDownloadIndividual = async (studentId: string) => {
        if (!selectedExamTerm) {
            showToast('Please select an Exam Term first.', 'error');
            return;
        }

        try {
            const response = await apiClient.post(
                '/api/documents/marksheet',
                {
                    studentId,
                    examTermId: selectedExamTerm,
                    issueDate: new Date().toISOString()
                },
                { responseType: 'blob' }
            );

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Marksheet_${studentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showToast('Marksheet downloaded successfully.', 'success');
        } catch (err) {
            showToast('Failed to download Marksheet.', 'error');
            console.error(err);
        }
    };

    const handleDownloadBulk = async () => {
        if (!selectedExamTerm || !classId || !section) {
            showToast('Please select both a Class and an Exam Term.', 'error');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await apiClient.post(
                '/api/documents/marksheet/bulk',
                {
                    classId,
                    section,
                    examTermId: selectedExamTerm,
                    issueDate: new Date().toISOString()
                },
                { responseType: 'blob' }
            );

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bulk_Marksheets_${classId}_${section}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            showToast('Bulk Marksheets downloaded successfully.', 'success');
        } catch (err) {
            showToast('Failed to download Bulk Marksheets. Endpoint might not exist.', 'error');
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 mt-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                    Exam Results & Marksheets
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Generate and download standard report cards for exams.</p>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <Select
                        label="Select Exam Term"
                        value={selectedExamTerm}
                        onChange={(e) => setSelectedExamTerm(e.target.value)}
                    >
                        <option value="">Choose Exam...</option>
                        {examTerms.map(term => (
                            <option key={term.id} value={term.id}>{term.name}</option>
                        ))}
                    </Select>
                </div>
                <div className="flex-1 w-full">
                    <Select
                        label="Select Class"
                        value={selectedClassTerm}
                        onChange={(e) => setSelectedClassTerm(e.target.value)}
                    >
                        <option value="">Choose Class...</option>
                        {classOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Select>
                </div>
                <Button
                    variant="default"
                    className="w-full sm:w-auto"
                    disabled={!selectedExamTerm || !selectedClassTerm || isGenerating}
                    onClick={handleDownloadBulk}
                >
                    {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                    {isGenerating ? 'Generating...' : 'Download Bulk (Class)'}
                </Button>
            </div>

            {/* Students List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        Class Students
                    </h3>
                    {students.length > 0 && (
                        <span className="text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                            {students.length} Students
                        </span>
                    )}
                </div>

                {loadingStudents ? (
                    <div className="p-8 text-center text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                        <p>Loading students...</p>
                    </div>
                ) : !selectedClassTerm ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>Please select a class to view students.</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>No students found for this class.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Roll No</th>
                                    <th className="px-6 py-3 font-medium">Student Name</th>
                                    <th className="px-6 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            {student.rollNumber || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{student.name}</p>
                                                <p className="text-xs text-gray-500">ID: {student.id}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownloadIndividual(String(student.id))}
                                                disabled={!selectedExamTerm}
                                                className="hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-700"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Marksheet
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
