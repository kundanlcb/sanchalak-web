import React, { useState, useCallback } from 'react';
import { FileDown, Eye, Plus, Trash2, Loader2, User, Users } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { useToast } from '../../../components/common/ToastContext';
import { PdfPreviewModal } from './PdfPreviewModal';
import {
    demandBillService,
    type DemandBillLineItem,
    type DemandBillPreviewItem,
} from '../services/demandBillService';
import { getStudents } from '../../students/services/studentService';

interface Props {
    categories: Array<{ id: string | number; name: string }>;
    classes: Array<{ id: number; name: string }>;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

type Scope = 'class' | 'student';

export const GenerateBillsTab: React.FC<Props> = ({ categories, classes }) => {
    const { showToast } = useToast();

    const [scope, setScope] = useState<Scope>('class');
    const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [students, setStudents] = useState<{ id: number; name: string }[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [lineItems, setLineItems] = useState<DemandBillLineItem[]>([
        { categoryName: '', amount: 0 },
    ]);
    const [backDues, setBackDues] = useState<number>(0);

    const [previewingPdf, setPreviewingPdf] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [previewData, setPreviewData] = useState<DemandBillPreviewItem[] | null>(null);
    const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    const monthLabel = `${selectedMonth.toUpperCase()} ${selectedYear}`;

    // Load students when class changes (for single-student scope)
    const handleClassChange = async (classId: number | null) => {
        setSelectedClassId(classId);
        setSelectedStudentId(null);
        setStudents([]);
        if (!classId) return;
        try {
            const res = await getStudents({ classId, limit: 200 });
            setStudents(res.students.map(s => ({ id: s.id, name: s.name })));
        } catch {
            // ignore load error
        }
    };

    const updateLineItem = (index: number, field: keyof DemandBillLineItem, value: string | number) => {
        setLineItems(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item
        ));
    };

    const addLineItem = () => setLineItems(prev => [...prev, { categoryName: '', amount: 0 }]);
    const removeLineItem = (index: number) => setLineItems(prev => prev.filter((_, i) => i !== index));

    const buildRequest = useCallback(() => ({
        monthLabel,
        classId: scope === 'class' ? selectedClassId : null,
        studentId: scope === 'student' ? selectedStudentId : null,
        backDues: backDues || 0,
        lineItems: lineItems.filter(li => li.categoryName && li.amount > 0),
    }), [monthLabel, scope, selectedClassId, selectedStudentId, backDues, lineItems]);

    const validate = () => {
        const req = buildRequest();
        if (req.lineItems.length === 0) { showToast('Add at least one fee item', 'error'); return null; }
        if (scope === 'student' && !selectedStudentId) { showToast('Select a student', 'error'); return null; }
        return req;
    };

    /** Show in-browser PDF preview without saving to DB */
    const handlePreviewPdf = async () => {
        const req = validate();
        if (!req) return;
        setPreviewingPdf(true);
        setShowPdfModal(true);    // open modal immediately with loading state
        setPreviewBlob(null);
        try {
            const blob = await demandBillService.previewPdf(req);
            setPreviewBlob(blob);
            // Also fetch table data for summary below modal
            const data = await demandBillService.preview(req);
            setPreviewData(data);
        } catch {
            showToast('PDF preview failed — check server connection', 'error');
            setShowPdfModal(false);
        } finally {
            setPreviewingPdf(false);
        }
    };

    const handleDownloadPreview = () => {
        if (!previewBlob) return;
        const url = URL.createObjectURL(previewBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `preview-bills-${monthLabel}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    /** Generate + save to DB + download */
    const handleGenerate = async () => {
        const req = validate();
        if (!req) return;
        setGenerating(true);
        try {
            const blob = await demandBillService.generatePdf(req);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `demand-bills-${monthLabel}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('PDF generated & downloaded!', 'success');
        } catch {
            showToast('PDF generation failed', 'error');
        } finally {
            setGenerating(false);
        }
    };

    const totalAmount = lineItems.reduce((sum, li) => sum + (li.amount || 0), 0) + (backDues || 0);

    return (
        <>
            <div className="space-y-6">
                {/* Configuration Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-500 rounded-full" />
                        Bill Configuration
                    </h2>

                    {/* Scope toggle */}
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Generate For</label>
                        <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 w-fit">
                            <button
                                onClick={() => setScope('class')}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors ${scope === 'class'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <Users className="h-4 w-4" />
                                Entire Class
                            </button>
                            <button
                                onClick={() => setScope('student')}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors ${scope === 'student'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <User className="h-4 w-4" />
                                Single Student
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* Month */}
                        <Select
                            label="Month"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                        >
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </Select>

                        {/* Year */}
                        <Select
                            label="Year"
                            value={selectedYear}
                            onChange={e => setSelectedYear(Number(e.target.value))}
                        >
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </Select>

                        {/* Class */}
                        <Select
                            label={scope === 'class' ? 'Class (optional = All)' : 'Class'}
                            value={selectedClassId ?? ''}
                            onChange={e => handleClassChange(e.target.value ? Number(e.target.value) : null)}
                        >
                            {scope === 'class' && <option value="">All Classes</option>}
                            {scope === 'student' && <option value="">Select Class</option>}
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </Select>

                        {/* Student picker for single-student scope */}
                        {scope === 'student' ? (
                            <Select
                                label="Student"
                                value={selectedStudentId ?? ''}
                                onChange={e => setSelectedStudentId(e.target.value ? Number(e.target.value) : null)}
                                disabled={!selectedClassId}
                            >
                                <option value="">Select Student</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </Select>
                        ) : (
                            /* Back Dues (class scope) */
                            <Input
                                label="Back Dues (₹)"
                                type="number"
                                value={backDues}
                                onChange={e => setBackDues(Number(e.target.value))}
                                placeholder="0"
                            />
                        )}
                    </div>

                    {/* Back dues for student scope */}
                    {scope === 'student' && (
                        <div className="mb-4 w-48">
                            <Input
                                label="Back Dues (₹)"
                                type="number"
                                value={backDues}
                                onChange={e => setBackDues(Number(e.target.value))}
                                placeholder="0"
                            />
                        </div>
                    )}

                    {/* Fee Line Items */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Fee Items for {monthLabel}</h3>
                            <button
                                type="button"
                                onClick={addLineItem}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {lineItems.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <Select
                                            label={idx === 0 ? 'Category' : ''}
                                            value={item.categoryName}
                                            onChange={e => updateLineItem(idx, 'categoryName', e.target.value)}
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="w-36">
                                        <Input
                                            label={idx === 0 ? 'Amount (₹)' : ''}
                                            type="number"
                                            value={item.amount || ''}
                                            onChange={e => updateLineItem(idx, 'amount', e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                    {lineItems.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeLineItem(idx)}
                                            className="mb-1 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Total per student:</span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                            ₹{totalAmount.toLocaleString('en-IN')}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            onClick={handlePreviewPdf}
                            disabled={previewingPdf}
                        >
                            {previewingPdf ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading Preview…</>
                            ) : (
                                <><Eye className="w-4 h-4 mr-2" />Preview PDF</>
                            )}
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={generating}
                        >
                            {generating ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating…</>
                            ) : (
                                <><FileDown className="w-4 h-4 mr-2" />Generate & Download</>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Data Preview Table (after modal-based PDF preview) */}
                {previewData && previewData.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                Bill Summary — {previewData.length} student(s)
                            </h2>
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{monthLabel}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Back Dues</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Grand Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {previewData.map(bill => (
                                        <tr key={bill.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{bill.studentName}</td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{bill.className}</td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{bill.rollNo}</td>
                                            <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">₹{Number(bill.totalCurrentFees).toLocaleString('en-IN')}</td>
                                            <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">
                                                {Number(bill.totalBackDues) > 0 ? `₹${Number(bill.totalBackDues).toLocaleString('en-IN')}` : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">₹{Number(bill.grandTotal).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {previewData && previewData.length === 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-amber-700 dark:text-amber-400 text-sm">
                        No students found for the selected filter. Check enrollment data.
                    </div>
                )}
            </div>

            {/* PDF Preview Modal */}
            <PdfPreviewModal
                isOpen={showPdfModal}
                pdfBlob={previewBlob}
                isLoading={previewingPdf}
                title={`Bill Preview — ${monthLabel}`}
                onClose={() => setShowPdfModal(false)}
                onDownload={handleDownloadPreview}
                downloadFileName={`preview-bills-${monthLabel}.pdf`}
            />
        </>
    );
};
