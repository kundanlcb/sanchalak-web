/**
 * StudentDetail Component
 * Full student profile page with tabs for Info, Documents, Attendance, Payment
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Bell, CheckCircle2, AlertTriangle, IndianRupee, Loader2 } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { ConfirmationDialog } from '../../../components/common/ConfirmationDialog';
import { Skeleton } from '../../../components/common/Skeleton';
import { useToast } from '../../../components/common/ToastContext';
import { getStudent, deleteStudent } from '../services/studentService';
import { getStudentDocuments } from '../services/documentService';
import { getAttendance } from '../../attendance/services/attendanceService';
import { demandBillService, type DemandBillPreviewItem } from '../../finance/services/demandBillService';
import { apiClient } from '../../../services/api/client';
import { AttendanceHistory } from '../../attendance/components/AttendanceHistory';
import type { Student } from '../types/student.types';
import type { Document } from '../types/document.types';
import type { Attendance } from '../../attendance/types/attendance.types';

export const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'attendance' | 'payment'>('info');

  // Payment tab state
  const [billHistory, setBillHistory] = useState<DemandBillPreviewItem[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!studentId) return;
    setIsDeleting(true);
    try {
      await deleteStudent(studentId);
      showToast('Student deleted successfully', 'success');
      navigate('/students');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete student', 'error');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return;

      try {
        setLoading(true);
        setError('');

        const [studentResponse, docsResponse, attendanceResponse] = await Promise.all([
          getStudent(studentId),
          getStudentDocuments(studentId),
          getAttendance({ studentId: studentId, limit: 100 })
        ]);

        setStudent(studentResponse?.student);
        setDocuments(docsResponse?.documents || []);
        setAttendanceHistory(attendanceResponse?.attendances || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load student details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  // Fetch payment history when the payment tab is activated
  const fetchPaymentHistory = useCallback(async () => {
    if (!studentId) return;
    setPaymentLoading(true);
    try {
      const bills = await demandBillService.getStudentHistory(studentId);
      setBillHistory(bills || []);
    } catch (err) {
      console.error('Failed to load payment history', err);
    } finally {
      setPaymentLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    if (activeTab === 'payment') {
      fetchPaymentHistory();
    }
  }, [activeTab, fetchPaymentHistory]);

  const handleSendPaymentNotification = async () => {
    setSendingNotification(true);
    try {
      await apiClient.post(`/api/notifications/payment-reminder/${studentId}`);
      showToast('Payment reminder sent successfully', 'success');
    } catch (err) {
      showToast('Failed to send notification', 'error');
    } finally {
      setSendingNotification(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        {/* Nav Skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>

        {/* Profile Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="px-4 sm:px-6 pb-6">
            <div className="relative -mt-12 mb-4">
              <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white dark:border-gray-800" />
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2 w-full sm:w-auto">
                  <Skeleton className="h-8 w-48 sm:w-64" />
                  <Skeleton className="h-5 w-32 sm:w-48" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
          <Skeleton className="h-8 w-24 shrink-0" />
          <Skeleton className="h-8 w-32 shrink-0" />
          <Skeleton className="h-8 w-28 shrink-0" />
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-800 dark:text-red-200">{error || 'Student not found'}</p>
        <Button onClick={() => navigate('/students')} className="mt-4">
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/students')} className="pl-0 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/students/${studentId}/edit`)}>
            <Edit className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Decorative Header */}
        <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700"></div>

        <div className="px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 relative">
            {/* Avatar - Premium Style */}
            <div className="-mt-16 mx-auto sm:mx-0 relative">
              <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-white dark:bg-gray-800 p-1.5 shadow-md border border-white/20">
                {student.profilePhoto ? (
                  <img
                    src={student.profilePhoto}
                    alt={student.name}
                    className="h-full w-full rounded-full object-cover shadow-inner"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center border border-blue-200/50 dark:border-blue-700/50">
                    <span className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                      {(student.name || student.firstName || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info - Refined Typography */}
            <div className="pt-4 sm:pt-10 flex-1 text-center sm:text-left min-w-0">
              <div className="mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
                  <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                    {student.name}
                  </h1>
                  <div className="flex justify-center sm:justify-start">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border transition-all shadow-sm ${student.status === 'ACTIVE'
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                      : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
                      }`}>
                      <span className={`h-2 w-2 rounded-full mr-2 ${student.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                      {student.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
                    ID: {student.id}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className="flex items-center">
                    Adm: {student.admissionNumber}
                  </span>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Class</p>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    Grade {student.classId || student.className || 'N/A'}-{student.section || 'A'}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Roll No</p>
                  <p className="font-medium text-gray-900 dark:text-white">{student.rollNumber}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Date of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Gender</p>
                  <p className="font-medium text-gray-900 dark:text-white">{student.gender}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'info'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'documents'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'attendance'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'payment'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            Payment
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mobile</p>
                  <p className="font-medium text-gray-900 dark:text-white truncate">{student.mobileNumber}</p>
                </div>
              </div>

              {student.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white truncate">{student.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {student.address?.street || 'N/A'}<br />
                    {student.address?.city || ''}, {student.address?.state || ''}<br />
                    {student.address?.pincode || ''}, {student.address?.country || ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Parent/Guardian Information
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Primary Contact
                </p>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {student.primaryParent?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {student.primaryParent?.relationship || ''}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {student.primaryParent?.mobileNumber || ''}
                  </p>
                  {student.primaryParent?.email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.primaryParent.email}
                    </p>
                  )}
                  {student.primaryParent?.occupation && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.primaryParent.occupation}
                    </p>
                  )}
                </div>
              </div>

              {student.secondaryParent && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Secondary Contact
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {student.secondaryParent.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.secondaryParent.relationship}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {student.secondaryParent.mobileNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Documents ({documents.length})
          </h3>

          {documents.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No documents uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.documentID}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg gap-4 sm:gap-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{doc.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {doc.documentType} • {(doc.fileSize / 1024).toFixed(0)} KB
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full shrink-0 ${doc.verificationStatus === 'Verified'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : doc.verificationStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                    >
                      {doc.verificationStatus}
                    </span>

                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'attendance' && (
        <AttendanceHistory
          records={attendanceHistory.map(a => ({
            date: a.date,
            status: a.status,
            remarks: a.remarks
          }))}
          className="w-full"
        />
      )}

      {activeTab === 'payment' && (() => {
        const totalPaid = billHistory.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
        // Pending is approximated as back-dues sum from all bills
        const totalPending = billHistory.reduce((sum, b) => sum + (b.totalBackDues || 0), 0);

        return (
          <div className="space-y-5">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Fee Paid</p>
                  <p className="text-2xl font-black text-green-700 dark:text-green-400 flex items-center gap-0.5">
                    <IndianRupee className="h-5 w-5" />
                    {totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Fee Pending (Back Dues)</p>
                  <p className="text-2xl font-black text-orange-700 dark:text-orange-400 flex items-center gap-0.5">
                    <IndianRupee className="h-5 w-5" />
                    {totalPending.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Notification action */}
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-5 py-4">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Send Payment Reminder</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Notify the parent via push notification about pending dues.</p>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleSendPaymentNotification}
                disabled={sendingNotification}
                className="flex items-center gap-2 shrink-0"
              >
                {sendingNotification ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
                {sendingNotification ? 'Sending...' : 'Send Reminder'}
              </Button>
            </div>

            {/* Bill History Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Fee Bill History</h3>
              </div>
              {paymentLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
                </div>
              ) : billHistory.length === 0 ? (
                <div className="py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No bill records found for this student.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50">
                        <th className="px-5 py-3">Bill No</th>
                        <th className="px-5 py-3">Month</th>
                        <th className="px-5 py-3">Current Fees</th>
                        <th className="px-5 py-3">Back Dues</th>
                        <th className="px-5 py-3">Grand Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {billHistory.map(bill => (
                        <tr key={bill.billNo} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{bill.billNo}</td>
                          <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{bill.monthLabel}</td>
                          <td className="px-5 py-3 text-gray-900 dark:text-white font-medium">₹{bill.totalCurrentFees?.toLocaleString('en-IN')}</td>
                          <td className="px-5 py-3">
                            {bill.totalBackDues > 0 ? (
                              <span className="text-orange-600 dark:text-orange-400 font-medium">₹{bill.totalBackDues.toLocaleString('en-IN')}</span>
                            ) : (
                              <span className="text-green-600 dark:text-green-400">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">₹{bill.grandTotal?.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete ${student.name}? This action cannot be undone and will remove all student data, documents, and attendance records.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteConfirm(false)}
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
