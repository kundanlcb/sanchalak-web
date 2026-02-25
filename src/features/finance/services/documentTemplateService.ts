/**
 * Document Template Service — API calls for school branding templates.
 */

import { apiClient } from '../../../services/api/client';

export interface DocumentTemplateData {
    id?: number;
    schoolName?: string;
    addressLine1?: string;
    addressLine2?: string;
    phone1?: string;
    phone2?: string;
    regNo?: string;
    schoolCode?: string;
    logoUrl?: string;
    primaryColorHex?: string;
    admitCardFooterNote?: string;
    feeReceiptFooterNote?: string;
    controllerDesignation?: string;
    principalDesignation?: string;
}

export const documentTemplateService = {
    get: async (): Promise<DocumentTemplateData> => {
        const res = await apiClient.get<DocumentTemplateData>('/api/school/template');
        return res.data;
    },

    save: async (data: DocumentTemplateData): Promise<DocumentTemplateData> => {
        const res = await apiClient.put<DocumentTemplateData>('/api/school/template', data);
        return res.data;
    },

    getLogoUploadUrl: async (fileName: string, contentType: string): Promise<string> => {
        const res = await apiClient.post<{ uploadUrl: string }>(
            `/api/school/template/logo-url?fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(contentType)}`
        );
        return res.data.uploadUrl;
    },
};
