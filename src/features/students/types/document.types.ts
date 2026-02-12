/**
 * Document Types
 * Type definitions for student/parent document uploads and verification
 */

export interface Document {
  documentID: string; // Format: DOC-2026-NNNNN
  documentType: DocumentType;
  title: string;
  description?: string;
  
  // File Information
  fileName: string;
  fileUrl: string; // URL to stored document
  fileSize: number; // In bytes
  mimeType: string; // application/pdf, image/jpeg, etc.
  
  // Associated Entities
  entityType: EntityType;
  entityID: string; // studentID or parentID
  
  // Verification
  verificationStatus: VerificationStatus;
  verifiedBy?: string; // UserID of verifier
  verifiedDate?: string;
  verificationNotes?: string;
  
  // Metadata
  uploadedBy: string; // UserID
  uploadedDate: string; // ISO timestamp
  updatedDate?: string;
  
  // Privacy
  isPublic: boolean; // If false, only authorized roles can view
  expiryDate?: string; // For documents that expire (e.g., medical certificates)
}

export type DocumentType =
  | 'Birth Certificate'
  | 'Transfer Certificate'
  | 'Aadhar Card'
  | 'Photo ID'
  | 'Address Proof'
  | 'Income Certificate'
  | 'Caste Certificate'
  | 'Medical Certificate'
  | 'Previous School Report'
  | 'Profile Photo'
  | 'Other';

export type EntityType = 'Student' | 'Parent' | 'Staff' | 'Teacher';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected' | 'Expired';

// Upload Document Request
export interface UploadDocumentRequest {
  documentType: DocumentType;
  title: string;
  description?: string;
  
  // File data (base64 or multipart form data)
  file: File | string; // File object in browser, base64 string in mock
  
  // Entity association
  entityType: EntityType;
  entityID: string;
  
  isPublic?: boolean;
  expiryDate?: string;
}

export interface UploadDocumentResponse {
  success: boolean;
  documentID: string;
  fileUrl: string;
  message: string;
}

// Get Documents Query
export interface GetDocumentsQuery {
  entityType?: EntityType;
  entityID?: string; // Get all documents for specific student/parent
  documentType?: DocumentType;
  verificationStatus?: VerificationStatus;
  page?: number;
  limit?: number;
}

export interface GetDocumentsResponse {
  success: boolean;
  documents: Document[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Get Single Document
export interface GetDocumentRequest {
  documentID: string;
}

export interface GetDocumentResponse {
  success: boolean;
  document: Document;
}

// Update Document
export interface UpdateDocumentRequest {
  documentID: string;
  title?: string;
  description?: string;
  documentType?: DocumentType;
  isPublic?: boolean;
  expiryDate?: string;
}

export interface UpdateDocumentResponse {
  success: boolean;
  document: Document;
  message: string;
}

// Delete Document
export interface DeleteDocumentRequest {
  documentID: string;
}

export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
}

// Verify Document
export interface VerifyDocumentRequest {
  documentID: string;
  verificationStatus: 'Verified' | 'Rejected';
  verificationNotes?: string;
}

export interface VerifyDocumentResponse {
  success: boolean;
  document: Document;
  message: string;
}

// Bulk Upload
export interface BulkUploadDocumentRequest {
  documents: {
    entityID: string;
    entityType: EntityType;
    documentType: DocumentType;
    file: File | string;
    title: string;
  }[];
}

export interface BulkUploadDocumentResponse {
  success: boolean;
  uploaded: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
  documentIDs: string[];
}

// File validation constants
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const DOCUMENT_TYPE_ICONS: Record<DocumentType, string> = {
  'Birth Certificate': '📜',
  'Transfer Certificate': '📝',
  'Aadhar Card': '🆔',
  'Photo ID': '📷',
  'Address Proof': '🏠',
  'Income Certificate': '💰',
  'Caste Certificate': '📋',
  'Medical Certificate': '🏥',
  'Previous School Report': '📊',
  'Profile Photo': '👤',
  'Other': '📄',
};
