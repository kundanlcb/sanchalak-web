/**
 * Parent Types
 * Type definitions for parent/guardian profiles and registration
 */

import type { UserRole } from '../../../utils/permissions/checkPermission';

export interface Parent {
  parentID: string; // Format: PAR-2026-NNNNN
  name: string;
  email: string;
  mobileNumber: string;
  
  // Authentication (if parent has app access)
  userID?: string; // References User.userID in auth system
  role: UserRole; // Always 'Parent'
  isAppUser: boolean; // True if parent can login
  
  // Profile
  occupation?: string;
  annualIncome?: number;
  qualification?: string;
  profilePhoto?: string;
  
  // Linked Students
  studentIDs: string[]; // Array of Student.studentID
  
  // Contact Preferences
  preferredLanguage: 'English' | 'Hindi';
  notificationPreferences: NotificationPreferences;
  
  // Status
  isActive: boolean;
  verificationStatus: VerificationStatus;
  
  // Metadata
  createdDate: string;
  updatedDate?: string;
}

export interface NotificationPreferences {
  attendance: boolean;
  notices: boolean;
  exams: boolean;
  fees: boolean;
  sms: boolean;
  email: boolean;
  push: boolean;
}

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

// Create Parent Request
export interface CreateParentRequest {
  name: string;
  email: string;
  mobileNumber: string;
  occupation?: string;
  annualIncome?: number;
  qualification?: string;
  
  // Optional: If parent should have app access
  createAppAccess?: boolean;
  preferredLanguage?: 'English' | 'Hindi';
}

export interface CreateParentResponse {
  success: boolean;
  parentID: string;
  userID?: string; // Present if createAppAccess = true
  message: string;
  credentials?: {
    email: string;
    temporaryPassword: string;
  };
}

// Update Parent Request
export interface UpdateParentRequest {
  parentID: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  occupation?: string;
  annualIncome?: number;
  qualification?: string;
  profilePhoto?: string;
  
  notificationPreferences?: Partial<NotificationPreferences>;
  preferredLanguage?: 'English' | 'Hindi';
}

export interface UpdateParentResponse {
  success: boolean;
  parent: Parent;
  message: string;
}

// Link Student to Parent
export interface LinkStudentRequest {
  parentID: string;
  studentID: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
}

export interface LinkStudentResponse {
  success: boolean;
  message: string;
}

// Unlink Student from Parent
export interface UnlinkStudentRequest {
  parentID: string;
  studentID: string;
}

export interface UnlinkStudentResponse {
  success: boolean;
  message: string;
}

// Get Parent by ID
export interface GetParentRequest {
  parentID: string;
}

export interface GetParentResponse {
  success: boolean;
  parent: Parent;
}

// Get Parent by Mobile
export interface GetParentByMobileRequest {
  mobileNumber: string;
}

export interface GetParentByMobileResponse {
  success: boolean;
  parent: Parent | null;
}

// Parent List Query
export interface ParentListQuery {
  page?: number;
  limit?: number;
  search?: string; // Search by name, email, mobile
  isAppUser?: boolean;
  verificationStatus?: VerificationStatus;
  studentID?: string; // Filter parents of specific student
}

export interface ParentListResponse {
  success: boolean;
  parents: Parent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
