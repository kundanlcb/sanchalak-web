import React, { useState, useEffect, useMemo } from 'react';
import {
    Loader2, AlertTriangle, IndianRupee,
    Bell, Search, CheckSquare, Square,
    ChevronUp, ChevronDown, ChevronsUpDown,
    X, History, TrendingUp, ChevronLeft, ChevronRight,
    Receipt
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

type SortKey = 'name' | 'rollNumber' | 'totalBilled' | 'totalDues' | 'billCount';
type SortDir = 'asc' | 'desc';

interface Props { classes: ClassOption[]; }

const PAGE_SIZE = 10;

/* ── Sortable column header ──────────────────────────────────────────────── */
const SortTh: React.FC<{
    label: string; col: SortKey;
    sortKey: SortKey; sortDir: SortDir;
    onClick: (col: SortKey) => void;
    align?: 'left' | 'right' | 'center';
}> = ({ label, col, sortKey, sortDir, onClick, align = 'left' }) => (
    <th
        onClick={() => onClick(col)}
        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider select-none cursor-pointer group
            ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}
            text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors`}
    >
        <span className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
            {label}
            {sortKey === col
                ? sortDir === 'asc'
                    ? <ChevronUp className="h-3.5 w-3.5 text-blue-500" />
                    : <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
                : <ChevronsUpDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
            }
        </span>
    </th>
);

export const FeeLedgerTab: React.FC<Props> = ({ classes }) => {
    const { showToast } = useToast();

    // ── Data state ──────────────────────────────────────────────────────────
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [rawStudents, setRawStudents] = useState<{ id: number; name: string; rollNumber?: number }[]>([]);
    const [classHistory, setClassHistory] = useState<DemandBillPreviewItem[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [loadingBills, setLoadingBills] = useState(false);

    // ── UI state ────────────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [sortKey, setSortKey] = useState<SortKey>('rollNumber');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [page, setPage] = useState(1);
    const [sendingId, setSendingId] = useState<number | null>(null);
    const [sendingAll, setSendingAll] = useState(false);

    // ── Detail drawer ───────────────────────────────────────────────────────
    const [detailStudent, setDetailStudent] = useState<StudentRow | null>(null);
    const [detailBills, setDetailBills] = useState<DemandBillPreviewItem[]>([]);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Auto-select first class
    useEffect(() => {
        if (classes.length > 0 && selectedClassId === null) setSelectedClassId(classes[0].id);
    }, [classes, selectedClassId]);

    // Fetch when class changes
    useEffect(() => {
        if (!selectedClassId) return;
        setSelectedIds(new Set()); setDetailStudent(null); setPage(1);
        setLoadingStudents(true); setLoadingBills(true);
        getStudents({ classId: selectedClassId, limit: 200 })
            .then(r => setRawStudents(r.students.map(s => ({ id: s.id, name: s.name, rollNumber: s.rollNumber }))))
            .catch(() => setRawStudents([]))
            .finally(() => setLoadingStudents(false));
        demandBillService.getClassHistory(selectedClassId)
            .then(data => setClassHistory(data || []))
            .catch(() => setClassHistory([]))
            .finally(() => setLoadingBills(false));
    }, [selectedClassId]);

    // Build rows
    const studentRows: StudentRow[] = useMemo(() => rawStudents.map(s => {
        const bills = classHistory.filter(b => b.studentId === s.id);
        return {
            id: s.id, name: s.name, rollNumber: s.rollNumber,
            totalBilled: bills.reduce((sum, b) => sum + (b.grandTotal || 0), 0),
            totalDues: bills.reduce((sum, b) => sum + (b.totalBackDues || 0), 0),
            billCount: bills.length,
        };
    }), [rawStudents, classHistory]);

    // Filter + sort + paginate
    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase();
        const rows = studentRows.filter(r => r.name.toLowerCase().includes(q));
        rows.sort((a, b) => {
            const av = a[sortKey] ?? 0;
            const bv = b[sortKey] ?? 0;
            const cmp = typeof av === 'string'
                ? (av as string).localeCompare(bv as string)
                : (av as number) - (bv as number);
            return sortDir === 'asc' ? cmp : -cmp;
        });
        return rows;
    }, [studentRows, searchQuery, sortKey, sortDir]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Summary
    const classTotalDues = studentRows.reduce((s, r) => s + r.totalDues, 0);
    const classTotalBilled = studentRows.reduce((s, r) => s + r.totalBilled, 0);
    const studentsWithDues = studentRows.filter(r => r.totalDues > 0).length;

    // Selection
    const allPageSelected = pageRows.length > 0 && pageRows.every(r => selectedIds.has(r.id));

    const toggleStudent = (id: number) => {
        setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };

    const toggleAll = () => {
        if (allPageSelected) setSelectedIds(prev => { const n = new Set(prev); pageRows.forEach(r => n.delete(r.id)); return n; });
        else setSelectedIds(prev => { const n = new Set(prev); pageRows.forEach(r => n.add(r.id)); return n; });
    };

    // Sort
    const handleSort = (col: SortKey) => {
        if (sortKey === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(col); setSortDir('asc'); }
        setPage(1);
    };

    // Send reminder
    const sendReminder = async (studentId: number) => {
        setSendingId(studentId);
        try {
            await apiClient.post(`/api/notifications/payment-reminder/${studentId}`);
            showToast('Reminder sent', 'success');
        } catch { showToast('Failed to send reminder', 'error'); }
        finally { setSendingId(null); }
    };

    const sendRemindersToSelected = async () => {
        setSendingAll(true);
        const dueIds = [...selectedIds].filter(id => studentRows.find(r => r.id === id)?.totalDues ?? 0 > 0);
        if (!dueIds.length) { showToast('None selected have pending dues', 'info'); setSendingAll(false); return; }
        for (const id of dueIds) await sendReminder(id);
        setSendingAll(false);
    };

    // Detail
    const openDetail = async (row: StudentRow) => {
        setDetailStudent(row); setLoadingDetail(true); setDetailBills([]);
        try { setDetailBills(await demandBillService.getStudentHistory(row.id) || []); }
        catch { showToast('Failed to load history', 'error'); }
        finally { setLoadingDetail(false); }
    };

    const loading = loadingStudents || loadingBills;

    return (
        <div className="space-y-4 font-sans">

            {/* ── Filters row ─────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 items-end">
                {/* Class dropdown */}
                <div className="min-w-[200px] max-w-xs flex-shrink-0">
                    <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Class</label>
                    <div className="relative">
                        <select
                            value={selectedClassId ?? ''}
                            onChange={e => { setSelectedClassId(e.target.value ? Number(e.target.value) : null); setPage(1); }}
                            className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium px-4 py-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                        >
                            <option value="">All Classes</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                </div>

                {/* Search */}
                <div className="flex-1 min-w-[220px]">
                    <label className="block text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by student name…"
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Record count indicator */}
                {!loading && (
                    <div className="self-end pb-0.5">
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                            {filtered.length} student{filtered.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Summary cards ──────────────────────────────────────────── */}
            {!loading && studentRows.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Class Total Billed', value: `₹${classTotalBilled.toLocaleString('en-IN')}`, icon: IndianRupee, colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
                        { label: 'Collective Pending', value: `₹${classTotalDues.toLocaleString('en-IN')}`, icon: AlertTriangle, colorClass: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' },
                        { label: 'Students with Dues', value: `${studentsWithDues} / ${studentRows.length}`, icon: TrendingUp, colorClass: studentsWithDues > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
                    ].map(card => (
                        <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 px-5 py-4 flex items-center gap-4 shadow-sm">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${card.colorClass}`}>
                                <card.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{card.label}</p>
                                <p className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Bulk action bar ─────────────────────────────────────────── */}
            {selectedIds.size > 0 && (
                <div className="flex items-center justify-between bg-blue-600 rounded-xl px-5 py-3 shadow-md">
                    <p className="text-sm font-semibold text-white">
                        {selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected
                    </p>
                    <div className="flex gap-2">
                        <button onClick={sendRemindersToSelected} disabled={sendingAll}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold disabled:opacity-60 transition-colors">
                            {sendingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
                            Send Reminders
                        </button>
                        <button onClick={() => { }}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white text-blue-700 text-xs font-semibold hover:bg-blue-50 transition-colors">
                            <Receipt className="h-3.5 w-3.5" />
                            Generate Receipts
                        </button>
                    </div>
                </div>
            )}

            {/* ── Table ───────────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                ) : pageRows.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            {!selectedClassId ? 'Select a class to view students.' : 'No students match your search.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        <th className="pl-4 pr-2 py-3 w-10">
                                            <button onClick={toggleAll} className={`transition-colors ${allPageSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'}`}>
                                                {allPageSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                            </button>
                                        </th>
                                        <SortTh label="Student" col="name" sortKey={sortKey} sortDir={sortDir} onClick={handleSort} />
                                        <SortTh label="Roll No" col="rollNumber" sortKey={sortKey} sortDir={sortDir} onClick={handleSort} align="center" />
                                        <SortTh label="Bills" col="billCount" sortKey={sortKey} sortDir={sortDir} onClick={handleSort} align="center" />
                                        <SortTh label="Total Billed" col="totalBilled" sortKey={sortKey} sortDir={sortDir} onClick={handleSort} align="right" />
                                        <SortTh label="Pending Dues" col="totalDues" sortKey={sortKey} sortDir={sortDir} onClick={handleSort} align="right" />
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 w-20" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/60">
                                    {pageRows.map(row => {
                                        const checked = selectedIds.has(row.id);
                                        return (
                                            <tr
                                                key={row.id}
                                                onClick={() => openDetail(row)}
                                                className={`cursor-pointer transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-900/10 ${checked ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''}`}
                                            >
                                                <td className="pl-4 pr-2 py-3.5" onClick={e => { e.stopPropagation(); toggleStudent(row.id); }}>
                                                    <span className={checked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-300 dark:text-gray-600'}>
                                                        {checked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.name}</span>
                                                </td>
                                                <td className="px-4 py-3.5 text-center text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                                                    {row.rollNumber ?? '—'}
                                                </td>
                                                <td className="px-4 py-3.5 text-center">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">{row.billCount}</span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                                                        {row.totalBilled > 0 ? `₹${row.totalBilled.toLocaleString('en-IN')}` : '—'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right tabular-nums">
                                                    {row.totalDues > 0
                                                        ? <span className="text-sm font-bold text-orange-600 dark:text-orange-400">₹{row.totalDues.toLocaleString('en-IN')}</span>
                                                        : <span className="text-sm text-green-500 font-medium">—</span>
                                                    }
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold
                                                        ${row.totalDues > 0
                                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                                                            : row.billCount > 0
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                                        }`}>
                                                        {row.totalDues > 0 ? 'Due' : row.billCount > 0 ? 'Paid' : 'No Bills'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                                                    {row.totalDues > 0 && (
                                                        <button
                                                            onClick={() => sendReminder(row.id)}
                                                            disabled={sendingId === row.id}
                                                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 disabled:opacity-50 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
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
                        </div>

                        {/* ── Pagination ────────────────────────────────────── */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                        .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                                            if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('…');
                                            acc.push(p);
                                            return acc;
                                        }, [])
                                        .map((p, idx) =>
                                            p === '…'
                                                ? <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 text-xs">…</span>
                                                : <button
                                                    key={p}
                                                    onClick={() => setPage(p as number)}
                                                    className={`min-w-[30px] h-7 rounded-lg text-xs font-medium transition-colors
                                                        ${page === p
                                                            ? 'bg-blue-600 text-white shadow-sm'
                                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                                >
                                                    {p}
                                                </button>
                                        )}
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Student detail drawer ─────────────────────────────────── */}
            {detailStudent && (
                <div className="fixed inset-0 z-40 flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setDetailStudent(null); setDetailBills([]); }} />
                    <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{detailStudent.name}</h2>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    Roll {detailStudent.rollNumber ?? '—'} · {classes.find(c => c.id === selectedClassId)?.name ?? ''}
                                </p>
                            </div>
                            <button onClick={() => { setDetailStudent(null); setDetailBills([]); }}
                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-2 gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700">
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3.5 flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                    <IndianRupee className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Billed</p>
                                    <p className="text-base font-extrabold text-gray-900 dark:text-white">₹{detailStudent.totalBilled.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className={`rounded-xl border p-3.5 flex items-center gap-3
                                ${detailStudent.totalDues > 0
                                    ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900'
                                    : 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900'}`}>
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center
                                    ${detailStudent.totalDues > 0 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                                    <AlertTriangle className={`h-4 w-4 ${detailStudent.totalDues > 0 ? 'text-orange-500' : 'text-green-500'}`} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pending Dues</p>
                                    <p className={`text-base font-extrabold ${detailStudent.totalDues > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {detailStudent.totalDues > 0 ? `₹${detailStudent.totalDues.toLocaleString('en-IN')}` : 'All Clear ✓'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 px-6 py-3 border-b border-gray-100 dark:border-gray-700">
                            {detailStudent.totalDues > 0 && (
                                <button onClick={() => sendReminder(detailStudent.id)} disabled={sendingId === detailStudent.id}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-sm">
                                    {sendingId === detailStudent.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
                                    Send Reminder
                                </button>
                            )}
                            <button onClick={() => window.location.href = `/students/${detailStudent.id}`}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                View Full Profile
                            </button>
                        </div>

                        {/* Bill history */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="px-6 py-4 flex items-center gap-2 sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 z-10">
                                <History className="h-4 w-4 text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bill History</h3>
                                {detailBills.length > 0 && (
                                    <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2.5 py-0.5 rounded-full font-medium">
                                        {detailBills.length}
                                    </span>
                                )}
                            </div>

                            {loadingDetail ? (
                                <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-blue-500" /></div>
                            ) : detailBills.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-12">No bill records found.</p>
                            ) : (
                                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {detailBills.map((bill, idx) => (
                                        <div key={`${bill.billNo}-${idx}`} className="px-6 py-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{bill.monthLabel}</p>
                                                    <p className="text-[11px] font-mono text-gray-400 mt-0.5">{bill.billNo}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-extrabold text-gray-900 dark:text-white tabular-nums">₹{Number(bill.grandTotal).toLocaleString('en-IN')}</p>
                                                    {bill.totalBackDues > 0 && (
                                                        <p className="text-xs text-orange-500 font-semibold tabular-nums">
                                                            ₹{Number(bill.totalBackDues).toLocaleString('en-IN')} due
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {bill.lineItems?.length > 0 && (
                                                <div className="mt-2 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2 space-y-1">
                                                    {bill.lineItems.map((li, i) => (
                                                        <div key={i} className="flex justify-between text-xs tabular-nums">
                                                            <span className={`${li.isBackDue ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                                                {li.isBackDue && '⚠ '}{li.categoryName}{li.isBackDue && li.monthsUpto ? ` (${li.monthsUpto})` : ''}
                                                            </span>
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">₹{Number(li.amount).toLocaleString('en-IN')}</span>
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
