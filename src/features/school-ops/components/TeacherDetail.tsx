import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Phone, Mail, GraduationCap, Calendar, Clock, BookOpen } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { Skeleton } from '../../../components/common/Skeleton';
import { useToast } from '../../../components/common/ToastContext';
import { schoolOpsApi } from '../services/api';
import { useAcademicStructure } from '../hooks/useAcademicStructure';
import type { Teacher, Routine } from '../types';
import { cn } from '../../../utils/cn';

export const TeacherDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const teacherId = Number(id);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { subjects, classes } = useAcademicStructure();

    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchTeacher = async () => {
            if (!teacherId) return;
            try {
                setLoading(true);
                const data = await schoolOpsApi.getTeacherById(teacherId);
                setTeacher(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load teacher details');
            } finally {
                setLoading(false);
            }
        };

        const fetchRoutines = async () => {
            if (!teacherId) return;
            try {
                const data = await schoolOpsApi.getRoutines({ teacherId });
                setRoutines(data);
            } catch (err) {
                console.error('Failed to load routines:', err);
                // We don't set global error here to allow teacher profile to show
            }
        };

        fetchTeacher();
        fetchRoutines();
    }, [teacherId]);

    const handleDelete = async () => {
        if (!teacherId) return;
        setIsDeleting(true);
        try {
            await schoolOpsApi.deleteTeacher(teacherId);
            showToast('Teacher deleted successfully', 'success');
            navigate('/admin/teachers');
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Failed to delete teacher', 'error');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const getSubjectName = (subjectId: number) => {
        return subjects.find(s => s.id === subjectId)?.name || `Subject ${subjectId}`;
    };

    const getClassName = (classId: number) => {
        const cls = classes.find(c => c.id === classId);
        return cls ? `Grade ${cls.grade}-${cls.section}` : `Class ${classId}`;
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-in">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-9 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>
                <Skeleton className="h-64 w-full rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-48 col-span-1 rounded-xl" />
                    <Skeleton className="h-48 col-span-2 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !teacher) {
        return (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
                <p className="text-red-800 dark:text-red-200 mb-4">{error || 'Teacher not found'}</p>
                <Button onClick={() => navigate('/admin/teachers')}>Back to Teachers</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/teachers')} className="pl-0 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Teachers
                </Button>
                <div className="flex gap-2">
                    {/* Note: Edit in this context would typically open a modal or navigate to a form. 
              Since TeacherManager uses a modal, we might just redirect back to list with an edit state or 
              implement a separate edit page. For now, we'll favor consistency. */}
                    <Button variant="outline" size="sm" onClick={() => navigate('/admin/teachers', { state: { editTeacherId: teacherId } })}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col md:flex-row gap-6 relative">
                        <div className="-mt-16 mx-auto md:mx-0">
                            <div className="h-32 w-32 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg">
                                <div className="h-full w-full rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                        {teacher.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left pt-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{teacher.name}</h1>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">Teacher ID: {teacher.id}</p>
                                </div>
                                <div className="flex justify-center md:justify-start gap-2">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-semibold",
                                        teacher.isActive
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    )}>
                                        {teacher.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{teacher.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{teacher.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <GraduationCap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Qualification</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{teacher.qualification || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Education & Specialties */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500" />
                            Specializations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {teacher.specializedSubjects.length > 0 ? (
                                teacher.specializedSubjects.map(id => (
                                    <span key={id} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800">
                                        {getSubjectName(id)}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No specializations documented</p>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-500" />
                            Employment Info
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Joining Date</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {new Date(teacher.joiningDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Status</span>
                                <span className="font-medium text-green-600 dark:text-green-400">Active Duty</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule/Routine */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            Weekly Schedule
                        </h3>

                        {routines.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-semibold">Day</th>
                                            <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-semibold">Period</th>
                                            <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-semibold">Class</th>
                                            <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-semibold">Subject</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                        {routines.map((row) => (
                                            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                                <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{row.day}</td>
                                                <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{row.period}</td>
                                                <td className="py-3 px-2 font-medium text-blue-600 dark:text-blue-400">{getClassName(row.classId)}</td>
                                                <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{getSubjectName(row.subjectId)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Calendar className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">No active classes assigned in the routine.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                title="Delete Teacher"
                message={`Are you sure you want to delete ${teacher.name}? This will remove all their records from the system.`}
                confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
                onConfirm={handleDelete}
                onClose={() => setShowDeleteConfirm(false)}
                type="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};
