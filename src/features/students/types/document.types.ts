/**
 * Document Types
 * Domain types that derive from generated API models where shapes overlap.
 * Components should ALWAYS import from here — never from src/api/ directly.
 */

// ============================================================================
// Re-exported API Types (for service layer use)
// ============================================================================

/** Generated DTOs — use these in services that call the API directly */
export type { StudentDocumentDto } from '../../../api/models/student-document-dto';
export type { CreateDocumentRequest as ApiCreateDocumentRequest } from '../../../api/models/create-document-request';

// ============================================================================
// Domain Types (used by components and stores)
// ============================================================================

export interface Document {
  documentID: string;
  documentType: DocumentType;
  title: string;
  description?: string;

  // File Information
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;

  // Associated Entities
  entityType: EntityType;
  entityID: string;

  // Verification
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedDate?: string;
  verificationNotes?: string;

  // Metadata
  uploadedBy: string;
  uploadedDate: string;
  updatedDate?: string;

  // Privacy
  isPublic: boolean;
  expiryDate?: string;
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

// ============================================================================
// Request/Response Types (domain layer)
// ============================================================================

export interface UploadDocumentRequest {
  documentType: DocumentType;
  title: string;
  description?: string;
  file: File | string;
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

export interface GetDocumentsQuery {
  entityType?: EntityType;
  entityID?: string;
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

export interface GetDocumentRequest {
  documentID: string;
}

export interface GetDocumentResponse {
  success: boolean;
  document: Document;
}

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

export interface DeleteDocumentRequest {
  documentID: string;
}

export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
}

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

// ============================================================================
// Constants (frontend-only)
// ============================================================================

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
