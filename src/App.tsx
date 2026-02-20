/**
 * Main App Component
 * Sets up routing, auth protection, layout, and provides context
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './features/auth/services/authContext';
import { useMutationToast } from './hooks/useMutationToast';
import { SidebarProvider } from './components/layout/SidebarContext';
import { ToastProvider } from './components/common/ToastContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { NetworkStatusBanner } from './components/NetworkStatusBanner';
import { Login } from './features/auth/components/Login';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { UnauthorizedPage } from './components/common/UnauthorizedPage';
import { NotFoundPage } from './components/common/NotFoundPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { StudentList } from './features/students/components/StudentList';
import { StudentDetail } from './features/students/components/StudentDetail';
import { StudentForm } from './features/students/components/StudentForm';
import { AttendancePage } from './features/attendance/components/AttendancePage';
import { NoticeBoard } from './features/notices/components/NoticeBoard';
import { NoticeForm } from './features/notices/components/NoticeForm';
import { NoticeDetail } from './features/notices/components/NoticeDetail';
import { AcademicSetupPage } from './features/school-ops/pages/AcademicSetupPage';
import { TeacherListPage } from './features/school-ops/pages/TeacherListPage';
import { TeacherDetail } from './features/school-ops/components/TeacherDetail';
import { RoutineManagementPage } from './features/school-ops/pages/RoutineManagementPage';
import { ExamConfigPage } from './features/academics/pages/ExamConfigPage';
import { MarksEntryPage } from './features/academics/pages/MarksEntryPage';
import { ReportGenerationPage } from './features/academics/pages/ReportGenerationPage';
import { HomeworkPage } from './features/homework/pages/HomeworkPage';
import { FeeManagementPage } from './features/finance/pages/FeeManagementPage';
import { FeePaymentPage } from './features/finance/pages/FeePaymentPage';
import { PayrollPage } from './features/payroll/pages/PayrollPage';
import { FinancialReportsPage } from './features/analytics/pages/FinancialReportsPage';
import { DashboardHome } from './features/dashboard/pages/DashboardHome';

// Placeholder pages (will be replaced in Phase 6+) - Dashboard removed



// Logout component
const Logout: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout().then(() => {
      window.location.href = '/login';
    });
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <p className="text-gray-600 dark:text-gray-400">Logging out...</p>
    </div>
  );
};

// Layout wrapper for authenticated pages
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="ml-0 lg:ml-64 flex-1 transition-all duration-300 animate-in w-full">
          <div className="container mx-auto px-4 sm:px-6 pt-5 pb-6 sm:py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  // Activate global mutation toast feedback (offline/sync/error)
  useMutationToast();

  return (
    <ErrorBoundary>
      <ToastProvider>
        <SidebarProvider>
          <BrowserRouter>
            <NetworkStatusBanner />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/logout" element={<Logout />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <DashboardHome />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Teacher', 'Staff']}>
                    <AuthenticatedLayout>
                      <StudentList />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/new"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                    <AuthenticatedLayout>
                      <StudentForm />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                    <AuthenticatedLayout>
                      <StudentForm />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/:id"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Teacher', 'Staff']}>
                    <AuthenticatedLayout>
                      <StudentDetail />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Teacher', 'Staff', 'Parent', 'Student']}>
                    <AuthenticatedLayout>
                      <AttendancePage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/academics/setup"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AuthenticatedLayout>
                      <AcademicSetupPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teachers"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AuthenticatedLayout>
                      <TeacherListPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teachers/:id"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AuthenticatedLayout>
                      <TeacherDetail />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/academics/routine"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AuthenticatedLayout>
                      <RoutineManagementPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/academics/exams"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AuthenticatedLayout>
                      <ExamConfigPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/academics/reports"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AuthenticatedLayout>
                      <ReportGenerationPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/marks"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Teacher']}>
                    <AuthenticatedLayout>
                      <MarksEntryPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/homework"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Teacher', 'Student', 'Parent']}>
                    <AuthenticatedLayout>
                      <HomeworkPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />

              {/* Finance Routes */}
              <Route
                path="/admin/finance/fees"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AuthenticatedLayout>
                      <FeeManagementPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/finance/pay"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Parent', 'Student']}>
                    <AuthenticatedLayout>
                      <FeePaymentPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/finance/payroll"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AuthenticatedLayout>
                      <PayrollPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/finance/reports"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AuthenticatedLayout>
                      <FinancialReportsPage />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />

              {/* Notice Routes */}
              <Route
                path="/notices"
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <NoticeBoard />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notices/new"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Teacher', 'Staff']}>
                    <AuthenticatedLayout>
                      <NoticeForm />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notices/:id"
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <NoticeDetail />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <div className="p-8 text-center text-gray-500">Settings coming soon...</div>
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;

