import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAcademicStructure } from '../../../school-ops/hooks/useAcademicStructure';
import { useSubjects } from '../../hooks/useSubjects';
import { useStudentsByClass } from '../../hooks/useStudentsByClass';
import { ArrowLeft, Edit, Loader2, Users, BookOpen, GraduationCap, TrendingUp, CheckCircle, Plus } from 'lucide-react';
import { Button } from '../../../../components/common/Button';
import { ClassSubjectTab } from './ClassSubjectTab';

export const ClassDetailRouter: React.FC = () => {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const { classes, loading: classLoading } = useAcademicStructure();
    const { subjects, isLoading: subjectsLoading } = useSubjects();
    const { students, isLoading: studentsLoading } = useStudentsByClass(classId || '', 'all');

    const [activeTab, setActiveTab] = useState<'subjects' | 'students' | 'exams'>('subjects');

    const schoolClass = classes.find(c => String(c.id) === classId);

    // Derive real stats
    const classSubjects = subjects.filter(s => String(s.classId) === classId || s.classId === 'all');
    const subjectCount = classSubjects.length;
    const studentCount = students.length;

    const isLoading = classLoading || subjectsLoading || studentsLoading;

    if (isLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    }

    if (!schoolClass) {
        return (
            <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200">Class not found</p>
                <Button onClick={() => navigate('/admin/academics/setup')} className="mt-4">
                    Back to Classes
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
            {/* Top Navigation Bar — matches StudentDetail */}
            <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/academics/setup')} className="pl-0 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Classes
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/admin/academics/classes/${classId}/edit`)}>
                        <Edit className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                    </Button>
                </div>
            </div>

            {/* Overview Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                {/* Gradient Banner */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 px-6 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Academic Year {schoolClass.academicYear || '2025-2026'}</p>
                            <h1 className="text-3xl font-bold text-white">
                                {schoolClass.className || `Grade ${schoolClass.grade} — Section ${schoolClass.section}`}
                            </h1>
                            <p className="text-blue-100 mt-1">
                                Room: {schoolClass.room || 'Not assigned'} &bull; Section: {schoolClass.section || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Strip — Real Data */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-5 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                            <Users className="w-4 h-4 text-blue-500" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Students</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{studentCount}</p>
                    </div>
                    <div className="text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                            <BookOpen className="w-4 h-4 text-emerald-500" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Subjects</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{subjectCount}</p>
                    </div>
                    <div className="text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                            <TrendingUp className="w-4 h-4 text-amber-500" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Avg Performance</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">—</p>
                    </div>
                    <div className="text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                            <CheckCircle className="w-4 h-4 text-purple-500" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Attendance</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">—</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                    <button
                        onClick={() => setActiveTab('subjects')}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap inline-flex items-center gap-2
                            ${activeTab === 'subjects'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Subjects Curriculum
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap inline-flex items-center gap-2
                            ${activeTab === 'students'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        <Users className="w-4 h-4" />
                        Students ({studentCount})
                    </button>
                    <button
                        onClick={() => setActiveTab('exams')}
                        className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap inline-flex items-center gap-2
                            ${activeTab === 'exams'
                                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Exams & Schedules
                    </button>
                </div>
            </div>

            {/* Tab Panes */}
            <div className="mt-6">
                {activeTab === 'subjects' && (
                    <ClassSubjectTab classId={classId!} />
                )}

                {activeTab === 'students' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Enrolled Students</h3>
                            <Button variant="outline" size="sm" onClick={() => navigate('/students/new')}>
                                <Plus className="w-4 h-4 mr-2" /> Add Student
                            </Button>
                        </div>

                        {students.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                                No students enrolled in this class yet.
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-left">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Roll</th>
                                            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Section</th>
                                            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Gender</th>
                                            <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Contact</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {students.map(s => (
                                            <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{s.rollNumber}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                                                            {(s.name || s.firstName || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-white">{s.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{s.section || '—'}</td>
                                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell">{s.gender || '—'}</td>
                                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell">{s.mobileNumber || '—'}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${s.id}`)}>
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'exams' && (
                    <div className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                        Exam configuration component will go here
                    </div>
                )}
            </div>
        </div>
    );
};
