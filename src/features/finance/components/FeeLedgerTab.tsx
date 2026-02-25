import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Loader2, AlertTriangle, IndianRupee, Bell,
    Search, CheckSquare, Square, ChevronLeft,
    TrendingUp, FileDown, X, Receipt, History
} from 'lucide-react';
import { useToast } from '../../../components/common/ToastContext';
import { demandBillService, type DemandBillPreviewItem } from '../services/demandBillService';
import { apiClient } from '../../../services/api/client';
import { getStudents } from '../../students/services/studentService';

interface ClassOption { id: number; name: string; }
interface StudentRow {
    id: number;
    name: string;
    rollNumber?: number;
    totalBilled: number;
    totalDues: number;
    billCount: number;
}

interface Props {
    classes: ClassOption[];
}

export const FeeLedgerTab: React.FC<Props> = ({ classes }) => {
    const { showToast } = useToast();

    // ── Class + student list state ─────────────────────────────────────────────
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [rawStudents, setRawStudents] = useState<{ id: number; name: string; rollNumber?: number }[]>([]);
    const [classHistory, setClassHistory] = useState<DemandBillPreviewItem[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [loadingBills, setLoadingBills] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // ── Student detail drawer state ────────────────────────────────────────────
    const [detailStudent, setDetailStudent] = useState<StudentRow | null>(null);
    const [detailBills, setDetailBills] = useState<DemandBillPreviewItem[]>([]);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [sendingId, setSendingId] = useState<number | null>(null);
    const [sendingAll, setSendingAll] = useState(false);

    // Auto-select first class
    useEffect(() => {
        if (classes.length > 0 && selectedClassId === null) {
            setSelectedClassId(classes[0].id);
        }
    }, [classes, selectedClassId]);

    // Load students list + class-level bill history whenever class changes
    useEffect(() => {
        if (!selectedClassId) return;
        setLoadingStudents(true);
        setLoadingBills(true);
        setSelectedIds(new Set());
        setDetailStudent(null);

        getStudents({ classId: selectedClassId, limit: 200 })
            .then(r => setRawStudents(r.students.map(s => ({
                id: s.id,
                name: s.name,
                rollNumber: s.rollNumber,
            }))))
            .catch(() => setRawStudents([]))
            .finally(() => setLoadingStudents(false));

        demandBillService.getClassHistory(selectedClassId)
            .then(data => setClassHistory(data || []))
            .catch(() => setClassHistory([]))
            .finally(() => setLoadingBills(false));
    }, [selectedClassId]);

    // Build student rows by merging student list with aggregate bill data
    const studentRows: StudentRow[] = useMemo(() => {
        return rawStudents.map(s => {
            const bills = classHistory.filter(b => b.studentId === s.id);
            return {
                id: s.id,
                name: s.name,
                rollNumber: s.rollNumber,
                totalBilled: bills.reduce((sum, b) => sum + (b.grandTotal || 0), 0),
                totalDues: bills.reduce((sum, b) => sum + (b.totalBackDues || 0), 0),
                billCount: bills.length,
            };
        });
    }, [rawStudents, classHistory]);

    const filteredRows = useMemo(() =>
        studentRows.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())),
        [studentRows, searchQuery]);

    // Class-level summary
    const classTotalDues = studentRows.reduce((s, r) => s + r.totalDues, 0);
    const classTotalBilled = studentRows.reduce((s, r) => s + r.totalBilled, 0);
    const studentsWithDues = studentRows.filter(r => r.totalDues > 0).length;

    // ── Selection helpers ──────────────────────────────────────────────────────
    const allSelected = filteredRows.length > 0 && filteredRows.every(r => selectedIds.has(r.id));
    const anySelected = selectedIds.size > 0;

    const toggleStudent = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredRows.map(r => r.id)));
        }
    };

    // ── Open student detail panel ──────────────────────────────────────────────
    const openDetail = async (row: StudentRow) => {
        setDetailStudent(row);
        setLoadingDetail(true);
        setDetailBills([]);
        try {
            const data = await demandBillService.getStudentHistory(row.id);
            setDetailBills(data || []);
        } catch {
            showToast('Failed to load student bill history', 'error');
        } finally {
            setLoadingDetail(false);
        }
    };

    const closeDetail = () => { setDetailStudent(null); setDetailBills([]); };

    // ── Send reminder ─────────────────────────────────────────────────────────
    const sendReminder = async (studentId: number) => {
        setSendingId(studentId);
        try {
            await apiClient.post(`/api/notifications/payment-reminder/${studentId}`);
            showToast('Reminder sent', 'success');
        } catch {
            showToast('Failed to send reminder', 'error');
        } finally {
            setSendingId(null);
        }
    };

    const sendRemindersToSelected = async () => {
        setSendingAll(true);
        const dueIds = [...selectedIds].filter(id => {
            const row = studentRows.find(r => r.id === id);
            return row && row.totalDues > 0;
        });
        if (dueIds.length === 0) { showToast('None of the selected students have pending dues', 'info'); setSendingAll(false); return; }
        for (const id of dueIds) await sendReminder(id);
        showToast(`Reminders sent to ${dueIds.length} student(s)`, 'success');
        setSendingAll(false);
    };

    // ── Generate receipt (preview PDF) for selected ───────────────────────────
    const generateReceiptForSelected = useCallback(async () => {
        if (selectedIds.size === 0) return;
        showToast('Preparing receipts…', 'info');
        // For simplicity, generate per-student and open each; could be extended to batch
        for (const id of selectedIds) {
            try {
                const blob = await demandBillService.previewPdf({
                    monthLabel: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase(),
                    studentId: id,
                    lineItems: [],
                });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } catch {
                // ignore individual failures
            }
        }
    }, [selectedIds, showToast]);

    const loading = loadingStudents || loadingBills;

    return (
        <div className="space-y-4">
            {/* ── Class selector + search ──────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[180px] max-w-xs">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Class</label>
                    <select
                        value={selectedClassId ?? ''}
                        onChange={e => setSelectedClassId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="flex-1 relative min-w-[200px]">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* ── Class-level summary cards ────────────────────────────────── */}
            {!loading && studentRows.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Class Total Billed', value: `₹${classTotalBilled.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'blue' },
                        { label: 'Collective Pending', value: `₹${classTotalDues.toLocaleString('en-IN')}`, icon: AlertTriangle, color: 'orange' },
                        { label: 'Students with Dues', value: `${studentsWithDues} / ${studentRows.length}`, icon: TrendingUp, color: studentsWithDues > 0 ? 'red' : 'green' },
                    ].map(card => (
                        <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 shadow-sm">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0
                                ${card.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' :
                                    card.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20' :
                                        card.color === 'red' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                                <card.icon className={`h-4 w-4
                                    ${card.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                        card.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                                            card.color === 'red' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
                                <p className="text-base font-black text-gray-900 dark:text-white">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Bulk action bar (visible when students are selected) ───────── */}
            {anySelected && (
                <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-5 py-3">
                    <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                        {selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={sendRemindersToSelected}
                            disabled={sendingAll}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
                        >
                            {sendingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
                            Send Reminders
                        </button>
                        <button
                            onClick={generateReceiptForSelected}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                        >
                            <Receipt className="h-3.5 w-3.5" />
                            Generate Receipts
                        </button>
                    </div>
                </div>
            )}

            {/* ── Full-width student table ─────────────────────────────────── */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex justify-center py-14">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                ) : filteredRows.length === 0 ? (
                    <div className="py-14 text-center text-sm text-gray-400 dark:text-gray-500">
                        {!selectedClassId ? 'Select a class to view students.' : 'No students found.'}
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50">
                                <th className="pl-4 pr-2 py-3 w-10">
                                    {/* Select all checkbox */}
                                    <button onClick={toggleAll} className={allSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}>
                                        {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                    </button>
                                </th>
                                <th className="px-4 py-3">Student</th>
                                <th className="px-4 py-3">Roll No</th>
                                <th className="px-4 py-3 text-center">Bills</th>
                                <th className="px-4 py-3 text-right">Total Billed</th>
                                <th className="px-4 py-3 text-right">Pending Dues</th>
                                <th className="px-4 py-3 text-right">Status</th>
                                <th className="px-4 py-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredRows.map(row => {
                                const checked = selectedIds.has(row.id);
                                return (
                                    <tr
                                        key={row.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer ${checked ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                        onClick={() => openDetail(row)}
                                    >
                                        <td className="pl-4 pr-2 py-3.5" onClick={e => { e.stopPropagation(); toggleStudent(row.id); }}>
                                            <span className={checked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}>
                                                {checked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 font-medium text-gray-900 dark:text-white">{row.name}</td>
                                        <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">{row.rollNumber ?? '—'}</td>
                                        <td className="px-4 py-3.5 text-center text-gray-500 dark:text-gray-400">{row.billCount}</td>
                                        <td className="px-4 py-3.5 text-right font-medium text-gray-900 dark:text-white">
                                            {row.totalBilled > 0 ? `₹${row.totalBilled.toLocaleString('en-IN')}` : '—'}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            {row.totalDues > 0 ? (
                                                <span className="font-semibold text-orange-600 dark:text-orange-400">₹{row.totalDues.toLocaleString('en-IN')}</span>
                                            ) : (
                                                <span className="text-green-500 text-xs font-medium">Clear</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                                                ${row.totalDues > 0
                                                    ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                                                    : row.billCount > 0
                                                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                                                {row.totalDues > 0 ? 'Due' : row.billCount > 0 ? 'Paid' : 'No Bills'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            {row.totalDues > 0 && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); sendReminder(row.id); }}
                                                    disabled={sendingId === row.id}
                                                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 disabled:opacity-50"
                                                >
                                                    {sendingId === row.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bell className="h-3 w-3" />}
                                                    Remind
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Student detail drawer ────────────────────────────────────── */}
            {detailStudent && (
                <div className="fixed inset-0 z-40 flex justify-end">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeDetail} />

                    {/* Drawer */}
                    <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-white">{detailStudent.name}</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Roll {detailStudent.rollNumber ?? '—'} · {classes.find(c => c.id === selectedClassId)?.name}
                                </p>
                            </div>
                            <button onClick={closeDetail} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Summary banner */}
                        <div className="px-6 py-4 grid grid-cols-2 gap-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                    <IndianRupee className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Billed</p>
                                    <p className="font-bold text-gray-900 dark:text-white">₹{detailStudent.totalBilled.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className={`rounded-xl border p-3 flex items-center gap-2.5
                                ${detailStudent.totalDues > 0
                                    ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'
                                    : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center
                                    ${detailStudent.totalDues > 0 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                                    <AlertTriangle className={`h-4 w-4 ${detailStudent.totalDues > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Pending Dues</p>
                                    <p className={`font-bold ${detailStudent.totalDues > 0 ? 'text-orange-700 dark:text-orange-400' : 'text-green-700 dark:text-green-400'}`}>
                                        {detailStudent.totalDues > 0 ? `₹${detailStudent.totalDues.toLocaleString('en-IN')}` : 'All Clear ✓'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="px-6 py-3 flex gap-2 border-b border-gray-100 dark:border-gray-700">
                            {detailStudent.totalDues > 0 && (
                                <button
                                    onClick={() => sendReminder(detailStudent.id)}
                                    disabled={sendingId === detailStudent.id}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
                                >
                                    {sendingId === detailStudent.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
                                    Send Reminder
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    const url = `/students/${detailStudent.id}`;
                                    window.location.href = url;
                                }}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                View Profile
                            </button>
                        </div>

                        {/* Bill history */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="px-6 py-4 flex items-center gap-2">
                                <History className="h-4 w-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bill History</h3>
                                {detailBills.length > 0 && (
                                    <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                                        {detailBills.length} bills
                                    </span>
                                )}
                            </div>

                            {loadingDetail ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                </div>
                            ) : detailBills.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-10">No bill records found.</p>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {detailBills.map((bill, idx) => (
                                        <div key={`${bill.billNo}-${idx}`} className="px-6 py-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{bill.monthLabel}</p>
                                                    <p className="text-xs text-gray-400 font-mono mt-0.5">{bill.billNo}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">₹{Number(bill.grandTotal).toLocaleString('en-IN')}</p>
                                                    {bill.totalBackDues > 0 && (
                                                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                                            ₹{Number(bill.totalBackDues).toLocaleString('en-IN')} due
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Line items */}
                                            {bill.lineItems && bill.lineItems.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    {bill.lineItems.map((li, i) => (
                                                        <div key={i} className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                            <span className={li.isBackDue ? 'text-orange-500' : ''}>
                                                                {li.isBackDue ? '⚠ ' : ''}{li.categoryName}
                                                                {li.monthsUpto && li.isBackDue && ` (${li.monthsUpto})`}
                                                            </span>
                                                            <span>₹{Number(li.amount).toLocaleString('en-IN')}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
