import React, { useEffect, useState } from 'react';
import { Save, Upload, Loader2, School } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { useToast } from '../../../components/common/ToastContext';
import {
    documentTemplateService,
    type DocumentTemplateData,
} from '../../finance/services/documentTemplateService';

export const SchoolTemplatePage: React.FC = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [template, setTemplate] = useState<DocumentTemplateData>({});

    useEffect(() => {
        documentTemplateService.get()
            .then(setTemplate)
            .catch(() => showToast('Could not load template', 'error'))
            .finally(() => setLoading(false));
    }, []);

    const update = (field: keyof DocumentTemplateData, value: string) => {
        setTemplate(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const saved = await documentTemplateService.save(template);
            setTemplate(saved);
            showToast('School template saved successfully', 'success');
        } catch {
            showToast('Failed to save template', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading school template...
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <School className="w-6 h-6 text-blue-500" />
                        School Document Template
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Customize branding used on fee bills, admit cards, and marksheets
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                        <><Save className="w-4 h-4 mr-2" />Save Template</>
                    )}
                </Button>
            </div>

            {/* School Identity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-blue-500 rounded-full" />
                    School Identity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <Input
                            label="School Name"
                            value={template.schoolName ?? ''}
                            onChange={e => update('schoolName', e.target.value)}
                            placeholder="SHRI RAM PUBLIC SCHOOL"
                        />
                    </div>
                    <Input
                        label="Address Line 1"
                        value={template.addressLine1 ?? ''}
                        onChange={e => update('addressLine1', e.target.value)}
                        placeholder="123, Main Road"
                    />
                    <Input
                        label="Address Line 2 (District, State)"
                        value={template.addressLine2 ?? ''}
                        onChange={e => update('addressLine2', e.target.value)}
                        placeholder="Vaishali, Bihar - 844101"
                    />
                    <Input
                        label="Phone 1"
                        value={template.phone1 ?? ''}
                        onChange={e => update('phone1', e.target.value)}
                        placeholder="9876543210"
                    />
                    <Input
                        label="Phone 2 (Optional)"
                        value={template.phone2 ?? ''}
                        onChange={e => update('phone2', e.target.value)}
                        placeholder="0612-2345678"
                    />
                    <Input
                        label="Registration No."
                        value={template.regNo ?? ''}
                        onChange={e => update('regNo', e.target.value)}
                        placeholder="Bihar/2020/12345"
                    />
                    <Input
                        label="School Code"
                        value={template.schoolCode ?? ''}
                        onChange={e => update('schoolCode', e.target.value)}
                        placeholder="MDN001"
                    />
                    <Input
                        label="Primary Color (Hex)"
                        value={template.primaryColorHex ?? ''}
                        onChange={e => update('primaryColorHex', e.target.value)}
                        placeholder="#1A3A5C"
                    />
                    <div className="flex items-center gap-3">
                        {template.primaryColorHex && /^#[0-9A-Fa-f]{6}$/.test(template.primaryColorHex) && (
                            <div
                                className="w-10 h-10 rounded border border-gray-200 flex-shrink-0"
                                style={{ backgroundColor: template.primaryColorHex }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Logo */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-purple-500 rounded-full" />
                    School Logo
                </h2>
                <div className="flex items-start gap-6">
                    {template.logoUrl ? (
                        <img
                            src={template.logoUrl}
                            alt="School logo"
                            className="w-24 h-24 object-contain border border-gray-200 dark:border-gray-700 rounded-lg p-1"
                        />
                    ) : (
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-400">
                            <School className="w-8 h-8" />
                        </div>
                    )}
                    <div className="flex-1 space-y-3">
                        <Input
                            label="Logo URL"
                            value={template.logoUrl ?? ''}
                            onChange={e => update('logoUrl', e.target.value)}
                            placeholder="https://..."
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            Or upload directly to Azure Blob — presigned upload endpoint: POST /api/school/template/logo-url
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-green-500 rounded-full" />
                    Custom Footer Notes
                </h2>
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fee Receipt Footer
                        </label>
                        <textarea
                            rows={3}
                            value={template.feeReceiptFooterNote ?? ''}
                            onChange={e => update('feeReceiptFooterNote', e.target.value)}
                            placeholder="Please pay the fee before the due date. Late fee of ₹50/month will be charged."
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Admit Card Footer
                        </label>
                        <textarea
                            rows={3}
                            value={template.admitCardFooterNote ?? ''}
                            onChange={e => update('admitCardFooterNote', e.target.value)}
                            placeholder="Bring this admit card on all examination days. Mobile phones are strictly not allowed."
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Designation Labels */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-orange-500 rounded-full" />
                    Signature Block Designations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                        label="Controller of Examinations"
                        value={template.controllerDesignation ?? ''}
                        onChange={e => update('controllerDesignation', e.target.value)}
                        placeholder="Controller of Examinations"
                    />
                    <Input
                        label="Principal / Head"
                        value={template.principalDesignation ?? ''}
                        onChange={e => update('principalDesignation', e.target.value)}
                        placeholder="Principal"
                    />
                </div>
            </div>
        </div>
    );
};
