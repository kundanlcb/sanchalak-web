/**
 * Student Mock Handlers
 * Simulates backend API for student CRUD operations, search, and bulk import
 */

import { db } from '../db';
import type {
  Student,
  CreateStudentRequest,
  CreateStudentResponse,
  UpdateStudentRequest,
  UpdateStudentResponse,
  StudentListQuery,
  StudentListResponse,
  GetStudentRequest,
  GetStudentResponse,
  DeleteStudentRequest,
  DeleteStudentResponse,
  BulkImportStudentRequest,
  BulkImportStudentResponse,
  Address,
  ParentInfo,
} from '../../features/students/types/student.types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique numeric ID
function generateNumericID(): number {
  const existingIDs = db.students.map(s => s.id);
  const maxID = existingIDs.length > 0 ? Math.max(...existingIDs) : 1000;
  return maxID + 1;
}

// Generate unique admission number
function generateAdmissionNumber(): string {
  const year = new Date().getFullYear();
  const existingNumbers = db.students.map(s => s.admissionNumber);
  let counter = 1;

  while (true) {
    const paddedCounter = counter.toString().padStart(3, '0');
    const newNumber = `ADM${year}${paddedCounter}`;
    if (!existingNumbers.includes(newNumber)) {
      return newNumber;
    }
    counter++;
  }
}

/**
 * Mock handler: Get all students with filtering, search, and pagination
 */
export async function handleGetStudents(
  query: StudentListQuery
): Promise<StudentListResponse> {
  await delay(300);

  const {
    page = 1,
    limit = 50,
    search = '',
    classId,
    section,
    academicYear,
    status,
    gender,
    sortBy = 'rollNumber',
    sortOrder = 'asc',
  } = query;

  // Filter students
  let filtered = db.students.filter(student => {
    // Search filter (name, id, admissionNumber)
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        student.name.toLowerCase().includes(searchLower) ||
        student.id.toString().includes(searchLower) ||
        student.admissionNumber.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Class filter
    if (classId && student.classId !== classId) return false;

    // Section filter
    if (section && student.section !== section) return false;

    // Academic year filter
    if (academicYear && student.academicYear !== academicYear) return false;

    // Status filter
    if (status && student.status !== status) return false;

    // Gender filter
    if (gender && student.gender !== gender) return false;

    return true;
  });

  // Sort students
  filtered.sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'rollNo':
        aValue = a.rollNumber;
        bValue = b.rollNumber;
        break;
      case 'admissionDate':
        aValue = new Date(a.admissionDate || '').getTime();
        bValue = new Date(b.admissionDate || '').getTime();
        break;
      case 'dateOfBirth':
        aValue = new Date(a.dateOfBirth || '').getTime();
        bValue = new Date(b.dateOfBirth || '').getTime();
        break;
      default:
        aValue = a.rollNumber;
        bValue = b.rollNumber;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedStudents = filtered.slice(startIndex, endIndex);

  return {
    success: true,
    students: paginatedStudents,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Mock handler: Get single student by ID
 */
export async function handleGetStudent(
  request: GetStudentRequest
): Promise<GetStudentResponse> {
  await delay(200);

  const student = db.students.find(s => s.id === request.id);

  if (!student) {
    throw new Error(`Student with ID ${request.id} not found`);
  }

  return {
    success: true,
    student,
  };
}

/**
 * Mock handler: Create new student
 */
export async function handleCreateStudent(
  request: CreateStudentRequest
): Promise<CreateStudentResponse> {
  await delay(400);

  // Validation
  if (!request.name || request.name.trim().length < 2) {
    throw new Error('Student name must be at least 2 characters');
  }

  if (!request.mobileNumber || !/^\+91[0-9]{10}$/.test(request.mobileNumber)) {
    throw new Error('Invalid mobile number format. Use +91XXXXXXXXXX');
  }

  if (!request.classId) {
    throw new Error('Class ID is required');
  }

  // Check if roll number already exists in class/section
  const existingRollNumber = db.students.find(
    s =>
      s.classId === request.classId &&
      s.section === request.section &&
      s.rollNumber === request.rollNumber &&
      s.academicYear === request.academicYear
  );

  if (existingRollNumber) {
    throw new Error(
      `Roll number ${request.rollNumber} already exists in ${request.section} section`
    );
  }

  // Generate IDs
  const id = generateNumericID();
  const admissionNumber = generateAdmissionNumber();

  // Create new student
  const newStudent: Student = {
    id,
    admissionNumber,
    name: request.name,
    dateOfBirth: request.dateOfBirth,
    gender: request.gender,
    bloodGroup: request.bloodGroup,
    admissionDate: request.admissionDate,
    classId: request.classId,
    rollNumber: request.rollNumber,
    section: request.section,
    academicYear: request.academicYear,
    mobileNumber: request.mobileNumber,
    email: request.email,
    address: request.address,
    primaryParent: request.primaryParent,
    secondaryParent: request.secondaryParent,
    previousSchool: request.previousSchool,
    tcNumber: request.tcNumber,
    profilePhoto: request.profilePhoto,
    medicalConditions: request.medicalConditions || [],
    allergies: request.allergies || [],
    isActive: true,
    status: 'ACTIVE',
    createdBy: 'user-001', // Mock user
    createdDate: new Date().toISOString(),
  };

  db.students.push(newStudent);

  return {
    success: true,
    id,
    admissionNumber,
    message: `Student ${request.name} created successfully with ID ${id}`,
  };
}

/**
 * Mock handler: Update student
 */
export async function handleUpdateStudent(
  request: UpdateStudentRequest
): Promise<UpdateStudentResponse> {
  await delay(350);

  const studentIndex = db.students.findIndex(s => s.id === request.id);

  if (studentIndex === -1) {
    throw new Error(`Student with ID ${request.id} not found`);
  }

  const existingStudent = db.students[studentIndex];

  // Update student with provided fields
  const updatedStudent: Student = {
    ...existingStudent,
    ...(request.name && { name: request.name }),
    ...(request.dateOfBirth && { dateOfBirth: request.dateOfBirth }),
    ...(request.gender && { gender: request.gender }),
    ...(request.bloodGroup && { bloodGroup: request.bloodGroup }),
    ...(request.classId && { classId: request.classId }),
    ...(request.rollNumber && { rollNumber: request.rollNumber }),
    ...(request.section && { section: request.section }),
    ...(request.mobileNumber && { mobileNumber: request.mobileNumber }),
    ...(request.email && { email: request.email }),
    ...(request.address && {
      address: {
        ...existingStudent.address,
        ...(request.address.street && { street: request.address.street }),
        ...(request.address.city && { city: request.address.city }),
        ...(request.address.state && { state: request.address.state }),
        ...(request.address.pincode && { pincode: request.address.pincode }),
        ...(request.address.country && { country: request.address.country }),
      } as Address,
    }),
    ...(request.primaryParent && {
      primaryParent: {
        ...existingStudent.primaryParent,
        ...request.primaryParent,
      } as ParentInfo,
    }),
    ...(request.secondaryParent && existingStudent.secondaryParent && {
      secondaryParent: {
        ...existingStudent.secondaryParent,
        ...request.secondaryParent,
      } as ParentInfo,
    }),
    ...(request.profilePhoto && { profilePhoto: request.profilePhoto }),
    ...(request.medicalConditions && { medicalConditions: request.medicalConditions }),
    ...(request.allergies && { allergies: request.allergies }),
    ...(request.status && { status: request.status }),
    ...(request.isActive !== undefined && { isActive: request.isActive }),
    updatedBy: 'user-001', // Mock user
    updatedDate: new Date().toISOString(),
  };

  db.students[studentIndex] = updatedStudent;

  return {
    success: true,
    student: updatedStudent,
    message: `Student ${updatedStudent.name} updated successfully`,
  };
}

/**
 * Mock handler: Delete student (soft delete - mark as inactive)
 */
export async function handleDeleteStudent(
  request: DeleteStudentRequest
): Promise<DeleteStudentResponse> {
  await delay(250);

  const studentIndex = db.students.findIndex(s => s.id === request.id);

  if (studentIndex === -1) {
    throw new Error(`Student with ID ${request.id} not found`);
  }

  // Soft delete - mark as inactive
  db.students[studentIndex] = {
    ...db.students[studentIndex],
    isActive: false,
    status: 'INACTIVE',
    updatedBy: 'user-001',
    updatedDate: new Date().toISOString(),
  };

  return {
    success: true,
    message: `Student ${db.students[studentIndex].name} has been marked as inactive`,
  };
}

/**
 * Mock handler: Bulk import students
 */
export async function handleBulkImportStudents(
  request: BulkImportStudentRequest
): Promise<BulkImportStudentResponse> {
  await delay(500);

  let imported = 0;
  let failed = 0;
  const errors: Array<{ row: number; error: string }> = [];

  for (let i = 0; i < request.students.length; i++) {
    try {
      await handleCreateStudent(request.students[i]);
      imported++;
    } catch (error) {
      failed++;
      errors.push({
        row: i + 1,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return {
    success: true,
    message: `Imported ${imported} students successfully.`,
    imported,
    failed,
    errors,
  };
}
