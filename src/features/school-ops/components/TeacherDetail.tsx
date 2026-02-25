import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Edit, Trash2, Phone, Mail, GraduationCap,
    Calendar, Clock, BookOpen, User, ClipboardList, Briefcase,
    MapPin, Award, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { Skeleton } from '../../../components/common/Skeleton';
import { useToast } from '../../../components/common/ToastContext';
import { schoolOpsApi } from '../services/api';
import { useAcademicStructure } from '../hooks/useAcademicStructure';
import type { Teacher, Routine } from '../types';
import { cn } from '../../../utils/cn';

type TabId = 'profile' | 'schedule' | 'employment';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'employment', label: 'Employment', icon: Briefcase },
];

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

// Subject accent colors (same palette as RoutineGrid)
const SUBJECT_COLORS = [
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800',
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800',
    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800',
];

const InfoRow: React.FC<{ label: string; value?: string | null; icon?: React.ElementType; accent?: string }> = ({
    label, value, icon: Icon, accent = 'text-gray-500 dark:text-gray-400'
}) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-b-0">
        {Icon && (
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex-shrink-0 mt-0.5">
                <Icon className={cn('w-4 h-4', accent)} />
            </div>
        )}
        <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5 truncate">{value || '—'}</p>
        </div>
    </div>
);

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
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchTeacher = async () => {
            if (!teacherId) return;
            try {
                setLoading(true);
                const [data, routineData] = await Promise.all([
                    schoolOpsApi.getTeacherById(teacherId),
                    schoolOpsApi.getRoutines({ teacherId }).catch(() => []),
                ]);
                setTeacher(data);
                setRoutines(routineData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load teacher details');
            } finally {
                setLoading(false);
            }
        };
        fetchTeacher();
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

    const getSubjectName = (subjectId: number) =>
        subjects.find(s => s.id === subjectId)?.name || `Subject ${subjectId}`;

    const getClassName = (classId: number) => {
        const cls = classes.find(c => c.id === classId);
        return cls ? (cls.className || `Grade ${cls.grade}-${cls.section}`) : `Class ${classId}`;
    };

    // ── Loading skeleton ─────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-9 w-32" />
                    <div className="flex gap-2"><Skeleton className="h-9 w-20" /><Skeleton className="h-9 w-20" /></div>
                </div>
                <Skeleton className="h-52 w-full rounded-2xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        );
    }

    if (error || !teacher) {
        return (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-center">
                <p className="text-red-800 dark:text-red-200 mb-4">{error || 'Teacher not found'}</p>
                <Button onClick={() => navigate('/admin/teachers')}>Back to Teachers</Button>
            </div>
        );
    }

    const initials = teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const subjectColorMap = new Map(subjects.map((s, i) => [s.id, SUBJECT_COLORS[i % SUBJECT_COLORS.length]]));

    // Group routines by day
    const routinesByDay: Record<string, Routine[]> = {};
    routines.forEach(r => {
        if (!routinesByDay[r.day]) routinesByDay[r.day] = [];
        routinesByDay[r.day].push(r);
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-300">

            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/teachers')} className="pl-0 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Teachers
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/admin/teachers', { state: { editTeacherId: teacherId } })}>
                        <Edit className="w-4 h-4 mr-2" />Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                        <Trash2 className="w-4 h-4 mr-2" />Delete
                    </Button>
                </div>
            </div>

            {/* ── Hero Profile Card ─────────────────────────────────────────── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                {/* Cover gradient */}
                <div className="h-28 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                </div>

                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row gap-5 relative">
                        {/* Avatar */}
                        <div className="-mt-14 flex-shrink-0 mx-auto sm:mx-0">
                            <div className="h-28 w-28 rounded-2xl border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden">
                                <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                    <span className="text-3xl font-black text-white tracking-tight">{initials}</span>
                                </div>
                            </div>
                        </div>

                        {/* Name + status */}
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2 sm:pt-0 sm:pb-1 text-center sm:text-left">
                            <div>
                                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{teacher.name}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    {teacher.qualification || 'Teacher'} · ID #{teacher.id}
                                </p>
                                {/* Specializations inline */}
                                {teacher.specializedSubjects.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
                                        {teacher.specializedSubjects.slice(0, 3).map(sid => (
                                            <span key={sid} className={cn('px-2.5 py-0.5 rounded-lg text-xs font-semibold border', subjectColorMap.get(sid) ?? SUBJECT_COLORS[0])}>
                                                {getSubjectName(sid)}
                                            </span>
                                        ))}
                                        {teacher.specializedSubjects.length > 3 && (
                                            <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                                +{teacher.specializedSubjects.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-center sm:justify-end gap-2">
                                <span className={cn(
                                    'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                                    teacher.isActive
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                )}>
                                    {teacher.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                    {teacher.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Key contact info strip */}
                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{teacher.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 text-violet-500 flex-shrink-0" />
                            <span>{teacher.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <span>Joined {new Date(teacher.joiningDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tabs ─────────────────────────────────────────────────────── */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex gap-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-150 whitespace-nowrap',
                                activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                            )}
                        >
                            <tab.icon className={cn('w-4 h-4', activeTab === tab.id ? 'text-indigo-500' : '')} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* ── Tab: Profile ─────────────────────────────────────────────── */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" /> Personal Information
                        </h3>
                        <InfoRow label="Full Name" value={teacher.name} icon={User} accent="text-indigo-500" />
                        <InfoRow label="Email Address" value={teacher.email} icon={Mail} accent="text-blue-500" />
                        <InfoRow label="Phone Number" value={teacher.phone} icon={Phone} accent="text-violet-500" />
                        <InfoRow label="Address" value={(teacher as any).address} icon={MapPin} accent="text-rose-500" />
                    </div>

                    {/* Qualifications & Subjects */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Award className="w-4 h-4" /> Qualifications & Subjects
                        </h3>
                        <InfoRow label="Qualification" value={teacher.qualification} icon={GraduationCap} accent="text-amber-500" />
                        <div className="pt-3 border-b border-gray-50 dark:border-gray-700/50">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specialized Subjects</p>
                            {teacher.specializedSubjects.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {teacher.specializedSubjects.map((sid, i) => (
                                        <span key={sid} className={cn('px-2.5 py-0.5 rounded-lg text-xs font-semibold border', SUBJECT_COLORS[i % SUBJECT_COLORS.length])}>
                                            {getSubjectName(sid)}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No specializations listed</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Tab: Schedule ────────────────────────────────────────────── */}
            {activeTab === 'schedule' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Weekly Schedule
                        <span className="ml-auto text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg">
                            {routines.length} periods
                        </span>
                    </h3>

                    {routines.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center">
                                <Calendar className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No schedule assigned yet</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Assign this teacher to classes in the timetable.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {DAY_ORDER.filter(d => routinesByDay[d]).map(day => (
                                <div key={day}>
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                        {day.charAt(0) + day.slice(1).toLowerCase()}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {(routinesByDay[day] ?? []).sort((a, b) => (a.periodIndex ?? 0) - (b.periodIndex ?? 0)).map(r => {
                                            const color = subjectColorMap.get(r.subjectId) ?? SUBJECT_COLORS[0];
                                            return (
                                                <div key={r.id} className={cn('flex items-center gap-3 p-3 rounded-xl border', color)}>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold truncate">{getSubjectName(r.subjectId)}</p>
                                                        <p className="text-[11px] opacity-70 truncate mt-0.5">
                                                            {getClassName(r.classId)} · {r.period}
                                                        </p>
                                                    </div>
                                                    <span className="text-[10px] font-bold opacity-60 bg-white/60 dark:bg-black/20 px-1.5 py-0.5 rounded">
                                                        P{(r.periodIndex ?? 0) + 1}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Tab: Employment ──────────────────────────────────────────── */}
            {activeTab === 'employment' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Employment Details
                        </h3>
                        <InfoRow label="Joining Date" value={new Date(teacher.joiningDate).toLocaleDateString('en-IN', { dateStyle: 'long' })} icon={Calendar} accent="text-amber-500" />
                        <InfoRow label="Status" value={teacher.isActive ? 'Active' : 'Inactive'} icon={CheckCircle} accent={teacher.isActive ? 'text-emerald-500' : 'text-gray-400'} />
                        <InfoRow label="Employee ID" value={`TCH-${String(teacher.id).padStart(4, '0')}`} icon={ClipboardList} accent="text-indigo-500" />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Teaching Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {[
                                { label: 'Subjects', value: teacher.specializedSubjects.length, color: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300' },
                                { label: 'Classes', value: [...new Set(routines.map(r => r.classId))].length, color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' },
                                { label: 'Total Periods', value: routines.length, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' },
                                { label: 'Days Active', value: Object.keys(routinesByDay).length, color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' },
                            ].map(item => (
                                <div key={item.label} className={cn('rounded-xl p-4 text-center', item.color)}>
                                    <p className="text-2xl font-extrabold">{item.value}</p>
                                    <p className="text-xs font-semibold opacity-70 mt-0.5">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                title="Delete Teacher"
                message={`Are you sure you want to delete ${teacher.name}? This will remove all their records.`}
                confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
                onConfirm={handleDelete}
                onClose={() => setShowDeleteConfirm(false)}
                type="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};
