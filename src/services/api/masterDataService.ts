/**
 * Master Data Service
 * API client functions for fetching master data (Gender, Blood Group, etc.)
 */

import apiClient from './client';

export interface MasterValue {
    code: string;
    label: string;
    sortOrder: number;
    isActive: boolean;
}

export interface MasterValueResponse {
    success: boolean;
    values: MasterValue[];
}

/**
 * Get values for a specific master domain
 * @param domainCode The domain code (e.g., 'GENDER', 'BLOOD_GROUP')
 */
export async function getMasterValues(domainCode: string): Promise<MasterValue[]> {
    try {
        const response = await apiClient.get<any>(`/platform/v1/masters/domains/${domainCode}/values`);

        // Handle standard API success response wrapper if present
        const data = response.data;
        if (data.success && Array.isArray(data.data)) {
            return data.data;
        }

        // Direct array fallback
        if (Array.isArray(data)) {
            return data;
        }

        // Direct object with values fallback
        if (data.values && Array.isArray(data.values)) {
            return data.values;
        }

        return [];
    } catch (error) {
        console.error(`Failed to fetch master values for ${domainCode}:`, error);
        return [];
    }
}

// Common Domain Constants
export const DOMAINS = {
    GENDER: 'GENDER',
    BLOOD_GROUP: 'BLOOD_GROUP',
    RELATION: 'RELATION',
    OCCUPATION: 'OCCUPATION',
    CATEGORY: 'CATEGORY',
    RELIGION: 'RELIGION',
};
