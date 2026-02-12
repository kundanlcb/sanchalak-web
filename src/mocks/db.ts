import studentsData from './data/students.json';
import teachersData from './data/teachers.json';
import classesData from './data/classes.json';
import routinesData from './data/routines.json';
import feesData from './data/fees.json';
import feeStructuresData from './data/feeStructures.json';
import transactionsData from './data/transactions.json';

// Types
import type { Student } from '../features/students/types/student.types';
import type { Teacher, Class, Routine } from '../features/school-ops/types';
import type { FeeCategory, FeeStructure, PaymentTransaction } from '../features/finance/types';
import type { Attendance } from '../features/attendance/types/attendance.types';

const STORAGE_KEY_ATTENDANCE = 'MOCK_DB_ATTENDANCE';

const loadAttendance = (): Attendance[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn('Failed to load mock attendance from storage', e);
    return [];
  }
};

// Centralized Mock Database
export const db = {
  students: [...(studentsData as unknown as Student[])],
  teachers: [...(teachersData as unknown as Teacher[])],
  classes: [...(classesData as unknown as Class[])],
  routines: [...(routinesData as unknown as Routine[])],
  fees: [...(feesData as unknown as FeeCategory[])],
  feeStructures: [...(feeStructuresData as unknown as FeeStructure[])],
  transactions: [...(transactionsData as unknown as PaymentTransaction[])],
  attendance: loadAttendance() as Attendance[],
};

export const persistAttendance = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(db.attendance));
  } catch (e) {
    console.warn('Failed to save mock attendance', e);
  }
};

// Generic CRUD Helpers
export const updateItem = <T extends { id: string | number }>(
  collection: T[], 
  id: string | number, 
  updates: Partial<T>
): T | null => {
  // Use loose equality to match string IDs with number IDs if necessary
  // eslint-disable-next-line eqeqeq
  const index = collection.findIndex((item) => item.id == id);
  if (index === -1) return null;
  
  collection[index] = { ...collection[index], ...updates };
  return collection[index];
};

export const deleteItem = <T extends { id: string | number }>(
  collection: T[], 
  id: string | number
): boolean => {
  // eslint-disable-next-line eqeqeq
  const index = collection.findIndex((item) => item.id == id);
  if (index === -1) return false;
  
  collection.splice(index, 1);
  return true;
};
