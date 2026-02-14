import { apiClient } from '../services/api/client';
import { 
  AcademicControllerApi,
  AnalyticsControllerApi,
  AttendanceControllerApi,
  AuthenticationApi,
  CalendarControllerApi,
  DashboardControllerApi,
  DocumentControllerApi,
  FinanceConfigControllerApi,
  FinanceOperationsControllerApi,
  HomeworkControllerApi,
  NoticeControllerApi,
  NotificationControllerApi,
  ProfileControllerApi,
  RoutineControllerApi,
  StudentControllerApi,
  TeacherControllerApi,
  TransportTrackingApi
} from './index';

// Instantiate APIs using the existing axios client (which handles auth/interceptors)
// Arguments: configuration (undefined), basePath (undefined - handled by client), axios (apiClient)

export const academicApi = new AcademicControllerApi(undefined, undefined, apiClient);
export const analyticsApi = new AnalyticsControllerApi(undefined, undefined, apiClient);
export const attendanceApi = new AttendanceControllerApi(undefined, undefined, apiClient);
export const authApi = new AuthenticationApi(undefined, undefined, apiClient);
export const calendarApi = new CalendarControllerApi(undefined, undefined, apiClient);
export const dashboardApi = new DashboardControllerApi(undefined, undefined, apiClient);
export const documentApi = new DocumentControllerApi(undefined, undefined, apiClient);
export const financeConfigApi = new FinanceConfigControllerApi(undefined, undefined, apiClient);
export const financeOpsApi = new FinanceOperationsControllerApi(undefined, undefined, apiClient);
export const homeworkApi = new HomeworkControllerApi(undefined, undefined, apiClient);
export const noticeApi = new NoticeControllerApi(undefined, undefined, apiClient);
export const notificationApi = new NotificationControllerApi(undefined, undefined, apiClient);
export const profileApi = new ProfileControllerApi(undefined, undefined, apiClient);
export const routineApi = new RoutineControllerApi(undefined, undefined, apiClient);
export const studentApi = new StudentControllerApi(undefined, undefined, apiClient);
export const teacherApi = new TeacherControllerApi(undefined, undefined, apiClient);
export const transportApi = new TransportTrackingApi(undefined, undefined, apiClient);
