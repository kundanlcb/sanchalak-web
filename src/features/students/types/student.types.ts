/**
 * Student Types
 * Type definitions for student profiles, creation, updates, and queries
 */

export interface Student {
  studentID: string; // Format: STU-2026-NNNNN
  name: string;
  dateOfBirth: string; // ISO date
  gender: Gender;
  bloodGroup?: BloodGroup;
  admissionDate: string; // ISO date
  admissionNumber: string;
  classID: string; // References Class.classID
  rollNumber: number;
  section: string; // A, B, C, etc.
  academicYear: string; // 2025-2026
  
  // Contact Information
  mobileNumber: string;
  email?: string;
  address: Address;
  
  // Parent/Guardian Information
  primaryParent: ParentInfo;
  secondaryParent?: ParentInfo;
  
  // Academic Information
  previousSchool?: string;
  tcNumber?: string; // Transfer Certificate number
  
  // Profile
  profilePhoto?: string; // URL or base64
  medicalConditions?: string[];
  allergies?: string[];
  
  // Status
  isActive: boolean;
  status: StudentStatus;
  
  // Metadata
  createdBy: string; // UserID
  createdDate: string; // ISO timestamp
  updatedBy?: string;
  updatedDate?: string;
}

export type Gender = 'Male' | 'Female' | 'Other';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type StudentStatus = 'Active' | 'Inactive' | 'Transferred' | 'Graduated' | 'Suspended';

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ParentInfo {
  parentID?: string; // References Parent.parentID if parent has app access
  name: string;
  relationship: Relationship;
  mobileNumber: string;
  email?: string;
  occupation?: string;
  annualIncome?: number;
  isPrimaryContact: boolean;
}

export type Relationship = 'Father' | 'Mother' | 'Guardian' | 'Other';

// Create Student Request
export interface CreateStudentRequest {
  name: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  admissionDate: string;
  classID: string;
  rollNumber: number;
  section: string;
  academicYear: string;
  
  mobileNumber: string;
  email?: string;
  address: Address;
  
  primaryParent: ParentInfo;
  secondaryParent?: ParentInfo;
  
  previousSchool?: string;
  tcNumber?: string;
  profilePhoto?: string;
  medicalConditions?: string[];
  allergies?: string[];
}

export interface CreateStudentResponse {
  success: boolean;
  studentID: string;
  admissionNumber: string;
  message: string;
}

// Update Student Request
export interface UpdateStudentRequest {
  studentID: string;
  name?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  classID?: string;
  rollNumber?: number;
  section?: string;
  
  mobileNumber?: string;
  email?: string;
  address?: Partial<Address>;
  
  primaryParent?: Partial<ParentInfo>;
  secondaryParent?: Partial<ParentInfo>;
  
  profilePhoto?: string;
  medicalConditions?: string[];
  allergies?: string[];
  status?: StudentStatus;
  isActive?: boolean;
}

export interface UpdateStudentResponse {
  success: boolean;
  student: Student;
  message: string;
}

// Student List Query
export interface StudentListQuery {
  page?: number;
  limit?: number; // Default 50
  search?: string; // Search by name, studentID, admissionNumber
  classID?: string;
  section?: string;
  academicYear?: string;
  status?: StudentStatus;
  gender?: Gender;
  sortBy?: 'name' | 'rollNumber' | 'admissionDate' | 'dateOfBirth';
  sortOrder?: 'asc' | 'desc';
}

export interface StudentListResponse {
  success: boolean;
  students: Student[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Get Single Student
export interface GetStudentRequest {
  studentID: string;
}

export interface GetStudentResponse {
  success: boolean;
  student: Student;
}

// Delete Student
export interface DeleteStudentRequest {
  studentID: string;
  reason?: string;
}

export interface DeleteStudentResponse {
  success: boolean;
  message: string;
}

// Bulk Import
export interface BulkImportStudentRequest {
  students: CreateStudentRequest[];
}

export interface BulkImportStudentResponse {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}
