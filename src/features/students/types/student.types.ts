/**
 * Student Types
 * Domain types that derive from generated API models where shapes overlap.
 * Components should ALWAYS import from here — never from src/api/ directly.
 */

// ============================================================================
// Re-exported API Types (for service layer use)
// ============================================================================

/** Generated DTOs — use these in services that call the API directly */
export type { Student as ApiStudentDto } from '../../../api/models/student';
export type { StudentRequest as ApiStudentRequest } from '../../../api/models/student-request';
export type { StudentResponse as ApiStudentResponse } from '../../../api/models/student-response';
export type { StudentProfileDto } from '../../../api/models/student-profile-dto';

// ============================================================================
// Domain Types (used by components and stores)
// ============================================================================

export interface Student {
  studentID: string;
  firstName?: string;
  lastName?: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: BloodGroup;
  admissionDate: string;
  admissionNumber: string;
  classID: string;
  rollNumber: number;
  section: string;
  academicYear: string;

  // Contact Information
  mobileNumber: string;
  email?: string;
  address: Address;

  // Parent/Guardian Information
  primaryParent: ParentInfo;
  secondaryParent?: ParentInfo;

  // Academic Information
  previousSchool?: string;
  tcNumber?: string;

  // Profile
  profilePhoto?: string;
  medicalConditions?: string[];
  allergies?: string[];

  // Status
  isActive: boolean;
  status: StudentStatus;

  // Metadata
  createdBy: string;
  createdDate: string;
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
  parentID?: string;
  name: string;
  relationship: Relationship;
  mobileNumber: string;
  email?: string;
  occupation?: string;
  annualIncome?: number;
  isPrimaryContact: boolean;
}

export type Relationship = 'Father' | 'Mother' | 'Guardian' | 'Other';

// ============================================================================
// Request/Response Types (domain layer)
// ============================================================================

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

export interface StudentListQuery {
  page?: number;
  limit?: number;
  search?: string;
  classID?: string;
  section?: string;
  academicYear?: string;
  status?: StudentStatus;
  gender?: Gender;
  sortBy?: 'name' | 'rollNo' | 'admissionDate' | 'dateOfBirth';
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

export interface GetStudentRequest {
  studentID: string;
}

export interface GetStudentResponse {
  success: boolean;
  student: Student;
}

export interface DeleteStudentRequest {
  studentID: string;
  reason?: string;
}

export interface DeleteStudentResponse {
  success: boolean;
  message: string;
}

export interface BulkImportStudentRequest {
  file: File;
}

export interface BulkImportStudentResponse {
  success: boolean;
  message: string;
}
