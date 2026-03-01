import React, { useState, useEffect, useMemo } from 'react';
import { useAcademicStructure } from '../../school-ops/hooks/useAcademicStructure';
import { useStudentsByClass } from '../../academics/hooks/useStudentsByClass';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { Loader2, Users, LayoutTemplate, MonitorSmartphone, Download } from 'lucide-react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { IDCardDocument, type IDCardData } from './IDCardDocument';
import { documentTemplateService, type DocumentTemplateData } from '../../finance/services/documentTemplateService';

export const IDCardGenerator: React.FC = () => {
    const { classes: schoolClasses, refresh: fetchStructure } = useAcademicStructure();

    const [selectedClassTerm, setSelectedClassTerm] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [layoutChoice, setLayoutChoice] = useState<'portrait' | 'landscape'>('portrait');
    const [schoolTemplate, setSchoolTemplate] = useState<DocumentTemplateData>();

    const [classId, section] = selectedClassTerm.split('|');
    const { students, isLoading: loadingStudents } = useStudentsByClass(classId || '', section || '');

    useEffect(() => {
        fetchStructure();
        // Load school dynamic template data once on mount
        documentTemplateService.get().then(res => setSchoolTemplate(res)).catch(err => console.error("Could not load setting", err));
    }, [fetchStructure]);

    useEffect(() => {
        // Reset selections when class changes
        setSelectedStudentIds([]);
    }, [selectedClassTerm]);

    const classOptions = useMemo(() => {
        return schoolClasses.map(c => ({
            value: `${c.id}|${c.section}`,
            label: c.className || `Class ${c.grade} - ${c.section}`
        }));
    }, [schoolClasses]);

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

    // Prepare data for the PDF
    const selectedStudentsData: IDCardData[] = useMemo(() => {
        return students
            .filter(s => selectedStudentIds.includes(String(s.id)))
            .map(s => {
                const phone = s.primaryParent?.mobileNumber || s.mobileNumber || 'N/A';
                let addrStr = 'N/A';
                if (s.address) {
                    addrStr = `${s.address.street || ''}, ${s.address.city || ''}, ${s.address.state || ''}`.replace(/(^,\s*)|(,\s*$)/g, '');
                }

                return {
                    id: String(s.id),
                    name: s.name,
                    rollNumber: String(s.rollNumber),
                    className: s.className || classId,
                    section: s.section || section,
                    bloodGroup: s.bloodGroup || 'O+',
                    dob: s.dateOfBirth || '01-Jan-2010',
                    parentName: s.primaryParent?.name || 'Guardian',
                    phone: phone,
                    address: addrStr,
                    photoUrl: s.profilePhoto || undefined
                };
            });
    }, [students, selectedStudentIds, classId, section]);

    const isAllSelected = students.length > 0 && selectedStudentIds.length === students.length;

    return (
        <div className="flex flex-col lg:flex-row gap-6 mt-6 h-[calc(100vh-14rem)]">

            {/* LEFT PANEL: Filters & Student List */}
            <div className="w-full lg:w-1/3 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-4">
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

                    <div className="flex gap-2">
                        <button
                            onClick={() => setLayoutChoice('portrait')}
                            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${layoutChoice === 'portrait' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                }`}
                        >
                            <MonitorSmartphone className="w-5 h-5 mb-1" />
                            <span className="text-xs font-semibold">Portrait</span>
                        </button>
                        <button
                            onClick={() => setLayoutChoice('landscape')}
                            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${layoutChoice === 'landscape' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                }`}
                        >
                            <LayoutTemplate className="w-5 h-5 mb-1" />
                            <span className="text-xs font-semibold">Landscape</span>
                        </button>
                    </div>
                </div>

                {/* List Container */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loadingStudents ? (
                        <div className="flex flex-col items-center py-10 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
                            <span>Loading students...</span>
                        </div>
                    ) : !selectedClassTerm ? (
                        <div className="flex flex-col items-center py-10 text-gray-500">
                            <Users className="w-12 h-12 mb-2 text-gray-300" />
                            <span>Select a class to load students</span>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="flex flex-col items-center py-10 text-gray-500">
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

                            <div className="space-y-1 mt-2">
                                {students.map(student => (
                                    <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
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
            <div className="flex-1 bg-gray-100 dark:bg-gray-950 rounded-xl shadow-inner border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col relative">

                {selectedStudentIds.length > 0 && (
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <PDFDownloadLink
                            document={<IDCardDocument students={selectedStudentsData} layoutType={layoutChoice} schoolTemplate={schoolTemplate} />}
                            fileName={`IDCards_${classId}_${section}.pdf`}
                        >
                            {({ loading }) => (
                                <Button size="sm" variant="default" disabled={loading} className="shadow-lg shadow-blue-500/20">
                                    <Download className="w-4 h-4 mr-2" />
                                    {loading ? 'Preparing PDF...' : 'Download PDF'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    </div>
                )}

                {selectedStudentIds.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <LayoutTemplate className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-700" />
                        <p className="text-lg font-medium text-gray-500">No Students Selected</p>
                        <p className="text-sm mt-1">Select students from the list to preview their ID cards.</p>
                    </div>
                ) : (
                    <div className="flex-1 w-full h-full p-2">
                        <PDFViewer width="100%" height="100%" showToolbar={true} className="rounded-lg shadow-md border-0 bg-white">
                            <IDCardDocument students={selectedStudentsData} layoutType={layoutChoice} schoolTemplate={schoolTemplate} />
                        </PDFViewer>
                    </div>
                )}
            </div>

        </div>
    );
};
