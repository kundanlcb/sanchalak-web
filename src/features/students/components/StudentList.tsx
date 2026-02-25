/**
 * StudentList Component
 * Displays list of students with search, filter, and pagination
 * Uses TanStack Table for efficient rendering of large datasets
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, Upload, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Skeleton } from '../../../components/common/Skeleton';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { useToast } from '../../../components/common/ToastContext';
import { getStudents, deleteStudent, bulkImportStudents, approveStudent, getDrafts } from '../services/studentService';
import type { Student, StudentListQuery } from '../types/student.types';

export const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'DRAFT'>('ACTIVE');
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<any[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const downloadRef = React.useRef<HTMLAnchorElement>(null);

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be selected again if needed
    event.target.value = '';

    try {
      setImporting(true);
      const response = await bulkImportStudents({ file, students: [] });
      if (response.success) {
        showToast(response.message || 'Students imported successfully', 'success');
        fetchStudents();
      } else {
        showToast('Failed to import students', 'error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import students';
      showToast(errorMessage, 'error');
    } finally {
      setImporting(false);
    }
  };

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 50;

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');

      if (activeTab === 'DRAFT') {
        const response = await getDrafts();
        if (response.success) {
          // Map staging records to a compatible student-like shape for the table
          const mappedDrafts = response.drafts.map(d => ({
            id: d.id,
            name: (d.firstName || '') + (d.lastName ? ' ' + d.lastName : ''),
            email: d.email,
            admissionNumber: d.admissionNo || 'N/A',
            classId: d.classId || 0, // Assuming classId is a number, default to 0 or handle string
            section: d.section || '', // Assuming section is a string, default to empty
            rollNumber: d.rollNo || 'N/A',
            status: 'DRAFT',
            mobileNumber: d.phone,
            processed: d.processed,
            errorMessage: d.errorMessage
          }));
          setDrafts(mappedDrafts);
          setTotalItems(mappedDrafts.length);
          setTotalPages(1); // Drafts are not paginated from API, so treat as single page
        }
      } else {
        const query: StudentListQuery = {
          page: currentPage,
          limit,
          search: searchTerm,
          status: activeTab,
          sortBy: 'rollNo',
          sortOrder: 'asc',
        };

        const response = await getStudents(query);
        if (response.success) {
          setStudents(response.students);
          setTotalItems(response.total);
          setTotalPages(response.totalPages);
        }
      }
    } catch (err) {
      setError('Failed to fetch students. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteStudent(deleteId);
      showToast('Student deleted successfully', 'success');
      fetchStudents(); // Refresh list
    } catch (err) {
      showToast('Failed to delete student', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, activeTab]);

  const handleApprove = async (id: number) => {
    try {
      setApprovingId(id);
      await approveStudent(id);
      showToast('Student onboarded successfully', 'success');
      fetchStudents();
    } catch (err) {
      showToast('Failed to onboard student', 'error');
    } finally {
      setApprovingId(null);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
          <div className="flex items-center gap-2 mt-1 sm:mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage student profiles
            </p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {totalItems} total
            </span>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={handleImport}
          />
          <a
            href="/assets/student_import_template.csv"
            download
            className="hidden"
            ref={downloadRef}
          >
            Template
          </a>

          {/* Mobile Actions Menu */}
          <div className="sm:hidden flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={triggerImport}
              className="flex-1 justify-center"
              disabled={importing}
              title="Import Students"
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadRef.current?.click()}
              className="flex-1 justify-center"
              title="Download Template"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={() => navigate('/students/new')} className="flex-1 justify-center">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex gap-3">
            <Button
              variant="outline"
              onClick={triggerImport}
              disabled={importing}
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? 'Importing...' : 'Import'}
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadRef.current?.click()}
              title="Download CSV Template"
            >
              <Download className="w-4 h-4 mr-2" />
              Template
            </Button>
            <Button onClick={() => navigate('/students/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ACTIVE'
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          onClick={() => { setActiveTab('ACTIVE'); setCurrentPage(1); }}
        >
          Active Students
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'DRAFT'
            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          onClick={() => { setActiveTab('DRAFT'); setCurrentPage(1); }}
        >
          Drafts (Imported)
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name, ID, or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Students Table */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th data-testid="header-id" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th data-testid="header-name" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th data-testid="header-class" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Class
                  </th>
                  <th data-testid="header-roll" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th data-testid="header-contact" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th data-testid="header-status" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th data-testid="header-actions" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                        <div className="ml-4 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (activeTab === 'ACTIVE' ? students : drafts).length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              {searchTerm ? 'No students found matching your search' : 'No students added yet'}
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first student'}
            </p>
            {!searchTerm && activeTab === 'ACTIVE' && (
              <Button onClick={() => navigate('/students/new')} className="mt-6">
                <Plus className="w-4 h-4 mr-2" />
                Add First Student
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th data-testid="header-id" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th data-testid="header-name" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th data-testid="header-class" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Class
                  </th>
                  <th data-testid="header-roll" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th data-testid="header-contact" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th data-testid="header-status" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th data-testid="header-actions" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {(activeTab === 'ACTIVE' ? students : drafts).map((student) => (
                  <tr
                    key={student.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${activeTab === 'ACTIVE' ? 'cursor-pointer' : ''}`}
                    onClick={() => activeTab === 'ACTIVE' && navigate(`/students/${student.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {student.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 relative">
                          {student.profilePhoto ? (
                            <img
                              src={student.profilePhoto}
                              alt={student.name}
                              className="h-10 w-10 rounded-xl object-cover shadow-sm border border-gray-100 dark:border-gray-700"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center border border-blue-200/50 dark:border-blue-700/50">
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {(student.name || student.firstName || '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-800 ${student.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name || student.firstName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.admissionNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      Grade {student.classId}-{student.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {student.mobileNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : student.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        {student.status === 'DRAFT' && !student.processed && (
                          <div className="flex flex-col items-end gap-1">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(student.id);
                              }}
                              disabled={approvingId === student.id}
                            >
                              {approvingId === student.id ? 'Onboarding...' : 'Onboard'}
                            </Button>
                            {student.errorMessage && (
                              <span className="text-[10px] text-red-500 max-w-[150px] truncate" title={student.errorMessage}>
                                {student.errorMessage}
                              </span>
                            )}
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/students/${student.id}/edit`);
                          }}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(student.id);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} students
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        size="sm"
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!deleteId}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
        type="danger"
      />
    </div>
  );
};
