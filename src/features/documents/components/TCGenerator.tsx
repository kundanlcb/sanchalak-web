import React, { useState, useEffect, useMemo } from 'react';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useStudentsByClass } from '../../academics/hooks/useStudentsByClass';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { Loader2, Users, FileText, Download } from 'lucide-react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { TCDocument, type TCData } from './TCDocument';
import { documentTemplateService, type DocumentTemplateData } from '../../finance/services/documentTemplateService';

export const TCGenerator: React.FC = () => {
    const { classes: schoolClasses, refresh: fetchStructure } = useAcademicStructure();

    const [selectedClassTerm, setSelectedClassTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');

    // TC specific form state
    const [reason, setReason] = useState('Transfer of parents');
    const [conduct, setConduct] = useState('Good');
    const [remarks, setRemarks] = useState('NIL');
    const [dateOfLeaving, setDateOfLeaving] = useState(new Date().toISOString().split('T')[0]);

    const [schoolTemplate, setSchoolTemplate] = useState<DocumentTemplateData>();

    const [classId, section] = selectedClassTerm.split('|');
    const { students, isLoading: loadingStudents } = useStudentsByClass(classId || '', section || '');

    useEffect(() => {
        fetchStructure();
    }, [fetchStructure]);

    useEffect(() => {
        documentTemplateService.get().then(res => setSchoolTemplate(res)).catch(err => console.error("Could not load setting", err));
    }, []);

    useEffect(() => {
        // Reset selections when class changes
        setSelectedStudentId('');
    }, [selectedClassTerm]);

    const classOptions = useMemo(() => {
        return schoolClasses.map(c => ({
            value: `${c.id}|${c.section}`,
            label: c.className || `Class ${c.grade} - ${c.section}`
        }));
    }, [schoolClasses]);

    const handleSelectStudent = (id: string) => {
        setSelectedStudentId(id);
    };

    const selectedStudent = useMemo(() => {
        return students.find(s => String(s.id) === selectedStudentId);
    }, [students, selectedStudentId]);

    // Prepare data for the PDF
    const tcData: TCData | null = useMemo(() => {
        if (!selectedStudent) return null;

        return {
            studentName: selectedStudent.name,
            parentName: selectedStudent.primaryParent?.name || 'Guardian',
            dob: selectedStudent.dateOfBirth || 'N/A',
            admissionNo: selectedStudent.rollNumber ? String(selectedStudent.rollNumber) : 'N/A',
            dateOfLeaving: dateOfLeaving,
            classLeft: selectedStudent.className || classId,
            reason: reason,
            conduct: conduct,
            remarks: remarks
        };
    }, [selectedStudent, dateOfLeaving, classId, reason, conduct, remarks]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 mt-6 min-h-[calc(100vh-14rem)]">

            {/* LEFT PANEL: Filters, Student List & Form */}
            <div className="w-full lg:w-1/3 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
                <div className="flex-none max-h-48 overflow-y-auto p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    {loadingStudents ? (
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
                                        name="tc_student_select"
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

                {/* TC Form Configuration */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Certificate Details</h3>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Leaving</label>
                        <input
                            type="date"
                            value={dateOfLeaving}
                            onChange={(e) => setDateOfLeaving(e.target.value)}
                            className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Leaving</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Relocating, Parent Transfer"
                            className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">General Conduct</label>
                        <select
                            value={conduct}
                            onChange={(e) => setConduct(e.target.value)}
                            className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Excellent">Excellent</option>
                            <option value="Very Good">Very Good</option>
                            <option value="Good">Good</option>
                            <option value="Satisfactory">Satisfactory</option>
                            <option value="Needs Improvement">Needs Improvement</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Any other remarks</label>
                        <input
                            type="text"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="e.g. NIL, Has cleared all dues"
                            className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Live PDF Preview */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-950 rounded-xl shadow-inner border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col relative h-[800px] lg:h-auto">

                {tcData && selectedStudent && (
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <PDFDownloadLink
                            document={<TCDocument data={tcData} schoolTemplate={schoolTemplate} />}
                            fileName={`TC_${selectedStudent.name.replace(/\s+/g, '_')}.pdf`}
                        >
                            {({ loading }) => (
                                <Button size="sm" variant="default" disabled={loading} className="shadow-lg shadow-blue-500/20">
                                    <Download className="w-4 h-4 mr-2" />
                                    {loading ? 'Preparing TC...' : 'Download TC'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    </div>
                )}

                {!tcData ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <FileText className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-700" />
                        <p className="text-lg font-medium text-gray-500">No Student Selected</p>
                        <p className="text-sm mt-1">Select a student from the list to preview and generate their TC.</p>
                    </div>
                ) : (
                    <div className="flex-1 w-full h-full p-2">
                        <PDFViewer width="100%" height="100%" showToolbar={true} className="rounded-lg shadow-md border-0 bg-white">
                            <TCDocument data={tcData} schoolTemplate={schoolTemplate} />
                        </PDFViewer>
                    </div>
                )}
            </div>

        </div>
    );
};
