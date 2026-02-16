/**
 * Document Service
 * API client functions for document upload, download, and verification
 */

import apiClient from '../../../services/api/client';
import type {
  UploadDocumentRequest,
  UploadDocumentResponse,
  GetDocumentsQuery,
  GetDocumentsResponse,
  GetDocumentResponse,
  UpdateDocumentRequest,
  UpdateDocumentResponse,
  DeleteDocumentResponse,
  VerifyDocumentRequest,
  VerifyDocumentResponse,
  BulkUploadDocumentRequest,
  BulkUploadDocumentResponse,
} from '../types/document.types';

/**
 * Upload document
 */
export async function uploadDocument(
  request: UploadDocumentRequest
): Promise<UploadDocumentResponse> {
  // In real API, use FormData for file upload
  const formData = new FormData();
  formData.append('file', request.file as File);
  formData.append('documentType', request.documentType);
  formData.append('title', request.title);
  if (request.description) formData.append('description', request.description);
  formData.append('entityType', request.entityType);
  formData.append('entityID', request.entityID);
  if (request.isPublic !== undefined) formData.append('isPublic', String(request.isPublic));
  if (request.expiryDate) formData.append('expiryDate', request.expiryDate);

  const response = await apiClient.post<UploadDocumentResponse>('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Get documents with filters
 */
export async function getDocuments(query: GetDocumentsQuery): Promise<GetDocumentsResponse> {
  const response = await apiClient.get<GetDocumentsResponse>('/documents', {
    params: query,
  });
  return response.data;
}

/**
 * Get single document
 */
export async function getDocument(documentID: string): Promise<GetDocumentResponse> {
  const response = await apiClient.get<GetDocumentResponse>(`/documents/${documentID}`);
  return response.data;
}

/**
 * Update document metadata
 */
export async function updateDocument(
  request: UpdateDocumentRequest
): Promise<UpdateDocumentResponse> {
  const response = await apiClient.put<UpdateDocumentResponse>(
    `/documents/${request.documentID}`,
    request
  );
  return response.data;
}

/**
 * Delete document
 */
export async function deleteDocument(documentID: string): Promise<DeleteDocumentResponse> {
  const response = await apiClient.delete<DeleteDocumentResponse>(`/documents/${documentID}`);
  return response.data;
}

/**
 * Verify document (Admin/Staff only)
 */
export async function verifyDocument(
  request: VerifyDocumentRequest
): Promise<VerifyDocumentResponse> {
  const response = await apiClient.post<VerifyDocumentResponse>(
    `/documents/${request.documentID}/verify`,
    request
  );
  return response.data;
}

/**
 * Bulk upload documents
 */
export async function bulkUploadDocuments(
  request: BulkUploadDocumentRequest
): Promise<BulkUploadDocumentResponse> {
  const formData = new FormData();
  request.documents.forEach((doc, index) => {
    formData.append(`files[${index}]`, doc.file as File);
    formData.append(`metadata[${index}]`, JSON.stringify({
      documentType: doc.documentType,
      title: doc.title,
      entityType: doc.entityType,
      entityID: doc.entityID,
    }));
  });

  const response = await apiClient.post<BulkUploadDocumentResponse>(
    '/documents/bulk-upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

/**
 * Get documents for specific student
 */
export async function getStudentDocuments(studentID: string): Promise<GetDocumentsResponse> {
  return getDocuments({
    entityType: 'Student',
    entityID: studentID,
  });
}
