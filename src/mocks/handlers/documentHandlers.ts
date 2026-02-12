/**
 * Document Mock Handlers
 * Simulates backend API for document upload, download, verification
 */

import documentsData from '../data/documents.json';
import {
  MAX_FILE_SIZE,
  ALLOWED_DOCUMENT_TYPES,
} from '../../features/students/types/document.types';
import type {
  Document,
  UploadDocumentRequest,
  UploadDocumentResponse,
  GetDocumentsQuery,
  GetDocumentsResponse,
  GetDocumentRequest,
  GetDocumentResponse,
  UpdateDocumentRequest,
  UpdateDocumentResponse,
  DeleteDocumentRequest,
  DeleteDocumentResponse,
  VerifyDocumentRequest,
  VerifyDocumentResponse,
  BulkUploadDocumentRequest,
  BulkUploadDocumentResponse,
} from '../../features/students/types/document.types';

// In-memory storage for documents
let documents: Document[] = [...(documentsData as Document[])];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique document ID
function generateDocumentID(): string {
  const year = new Date().getFullYear();
  const existingIDs = documents.map(d => d.documentID);
  let counter = 1;
  
  while (true) {
    const paddedCounter = counter.toString().padStart(5, '0');
    const newID = `DOC-${year}-${paddedCounter}`;
    if (!existingIDs.includes(newID)) {
      return newID;
    }
    counter++;
  }
}

/**
 * Mock handler: Upload document
 */
export async function handleUploadDocument(
  request: UploadDocumentRequest
): Promise<UploadDocumentResponse> {
  await delay(500); // Simulate file upload delay
  
  // Validation
  if (!request.title || request.title.trim().length < 3) {
    throw new Error('Document title must be at least 3 characters');
  }
  
  // Validate file (if File object)
  if (request.file instanceof File) {
    if (request.file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
    
    if (!ALLOWED_DOCUMENT_TYPES.includes(request.file.type as typeof ALLOWED_DOCUMENT_TYPES[number])) {
      throw new Error(
        `Invalid file type. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`
      );
    }
  }
  
  // Generate document ID and URL
  const documentID = generateDocumentID();
  const fileUrl = `/documents/${documentID}_${request.title.replace(/\s+/g, '_')}`;
  
  // Create document record
  const newDocument: Document = {
    documentID,
    documentType: request.documentType,
    title: request.title,
    description: request.description,
    fileName: request.file instanceof File ? request.file.name : 'mock_file.pdf',
    fileUrl,
    fileSize: request.file instanceof File ? request.file.size : 500000,
    mimeType: request.file instanceof File ? request.file.type : 'application/pdf',
    entityType: request.entityType,
    entityID: request.entityID,
    verificationStatus: 'Pending',
    uploadedBy: 'user-001', // Mock user
    uploadedDate: new Date().toISOString(),
    isPublic: request.isPublic ?? false,
    expiryDate: request.expiryDate,
  };
  
  documents.push(newDocument);
  
  return {
    success: true,
    documentID,
    fileUrl,
    message: `Document "${request.title}" uploaded successfully`,
  };
}

/**
 * Mock handler: Get documents with filtering and pagination
 */
export async function handleGetDocuments(
  query: GetDocumentsQuery
): Promise<GetDocumentsResponse> {
  await delay(200);
  
  const {
    entityType,
    entityID,
    documentType,
    verificationStatus,
    page = 1,
    limit = 20,
  } = query;
  
  // Filter documents
  let filtered = documents.filter(doc => {
    if (entityType && doc.entityType !== entityType) return false;
    if (entityID && doc.entityID !== entityID) return false;
    if (documentType && doc.documentType !== documentType) return false;
    if (verificationStatus && doc.verificationStatus !== verificationStatus) return false;
    
    // Check if document is expired
    if (doc.expiryDate && new Date(doc.expiryDate) < new Date()) {
      doc.verificationStatus = 'Expired';
    }
    
    return true;
  });
  
  // Sort by upload date (newest first)
  filtered.sort(
    (a, b) => new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime()
  );
  
  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedDocs = filtered.slice(startIndex, endIndex);
  
  return {
    success: true,
    documents: paginatedDocs,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Mock handler: Get single document
 */
export async function handleGetDocument(
  request: GetDocumentRequest
): Promise<GetDocumentResponse> {
  await delay(150);
  
  const document = documents.find(d => d.documentID === request.documentID);
  
  if (!document) {
    throw new Error(`Document with ID ${request.documentID} not found`);
  }
  
  return {
    success: true,
    document,
  };
}

/**
 * Mock handler: Update document metadata
 */
export async function handleUpdateDocument(
  request: UpdateDocumentRequest
): Promise<UpdateDocumentResponse> {
  await delay(250);
  
  const docIndex = documents.findIndex(d => d.documentID === request.documentID);
  
  if (docIndex === -1) {
    throw new Error(`Document with ID ${request.documentID} not found`);
  }
  
  const existingDoc = documents[docIndex];
  
  // Update document
  const updatedDoc: Document = {
    ...existingDoc,
    ...(request.title && { title: request.title }),
    ...(request.description !== undefined && { description: request.description }),
    ...(request.documentType && { documentType: request.documentType }),
    ...(request.isPublic !== undefined && { isPublic: request.isPublic }),
    ...(request.expiryDate !== undefined && { expiryDate: request.expiryDate }),
    updatedDate: new Date().toISOString(),
  };
  
  documents[docIndex] = updatedDoc;
  
  return {
    success: true,
    document: updatedDoc,
    message: `Document "${updatedDoc.title}" updated successfully`,
  };
}

/**
 * Mock handler: Delete document
 */
export async function handleDeleteDocument(
  request: DeleteDocumentRequest
): Promise<DeleteDocumentResponse> {
  await delay(200);
  
  const docIndex = documents.findIndex(d => d.documentID === request.documentID);
  
  if (docIndex === -1) {
    throw new Error(`Document with ID ${request.documentID} not found`);
  }
  
  const deletedDoc = documents[docIndex];
  documents.splice(docIndex, 1);
  
  return {
    success: true,
    message: `Document "${deletedDoc.title}" deleted successfully`,
  };
}

/**
 * Mock handler: Verify document (Admin/Staff only)
 */
export async function handleVerifyDocument(
  request: VerifyDocumentRequest
): Promise<VerifyDocumentResponse> {
  await delay(300);
  
  const docIndex = documents.findIndex(d => d.documentID === request.documentID);
  
  if (docIndex === -1) {
    throw new Error(`Document with ID ${request.documentID} not found`);
  }
  
  const existingDoc = documents[docIndex];
  
  // Update verification status
  const verifiedDoc: Document = {
    ...existingDoc,
    verificationStatus: request.verificationStatus,
    verifiedBy: 'user-001', // Mock user
    verifiedDate: new Date().toISOString(),
    verificationNotes: request.verificationNotes,
  };
  
  documents[docIndex] = verifiedDoc;
  
  return {
    success: true,
    document: verifiedDoc,
    message: `Document ${request.verificationStatus === 'Verified' ? 'verified' : 'rejected'} successfully`,
  };
}

/**
 * Mock handler: Bulk upload documents
 */
export async function handleBulkUploadDocuments(
  request: BulkUploadDocumentRequest
): Promise<BulkUploadDocumentResponse> {
  await delay(800);
  
  let uploaded = 0;
  let failed = 0;
  const errors: Array<{ index: number; error: string }> = [];
  const documentIDs: string[] = [];
  
  for (let i = 0; i < request.documents.length; i++) {
    try {
      const result = await handleUploadDocument({
        entityID: request.documents[i].entityID,
        entityType: request.documents[i].entityType,
        documentType: request.documents[i].documentType,
        title: request.documents[i].title,
        file: request.documents[i].file,
      });
      uploaded++;
      documentIDs.push(result.documentID);
    } catch (error) {
      failed++;
      errors.push({
        index: i,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  
  return {
    success: true,
    uploaded,
    failed,
    errors,
    documentIDs,
  };
}
