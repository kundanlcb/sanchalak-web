import { bulkMarkAttendance } from '../services/attendanceService';
import type { BulkMarkAttendanceRequest, AttendanceStatus } from '../types/attendance.types';

/**
 * Simulates high concurrency load for attendance marking
 * @param requestCount Number of concurrent requests to simulate (default: 500)
 */
export const runConcurrencyTest = async (requestCount: number = 500) => {
  console.log(`🚀 Starting Concurrency Test: ${requestCount} teachers submitting simultaneously...`);
  
  const startTime = performance.now();
  const requests: Promise<any>[] = [];
  
  // Generate requests
  for (let i = 0; i < requestCount; i++) {
    const classID = `CLS-2026-${String(i % 20).padStart(5, '0')}`; // Distribute across 20 classes
    const studentCount = 30; // 30 students per class
    
    const attendances = Array.from({ length: studentCount }, (_, j) => ({
      studentID: `STU-2026-${String((i * 100) + j).padStart(5, '0')}`,
      classID,
      date: new Date().toISOString().split('T')[0],
      status: 'Present' as AttendanceStatus,
    }));

    const payload: BulkMarkAttendanceRequest = {
      classID,
      date: new Date().toISOString().split('T')[0],
      attendances,
      markedBy: `teacher-${i}`,
    };

    requests.push(bulkMarkAttendance(payload).catch(err => ({ error: err.message })));
  }

  // Execute all
  const results = await Promise.all(requests);
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  const successes = results.filter(r => r.success).length;
  const failures = results.filter(r => !r.success).length; // Note: Mock might throw or return success:false
  
  console.log(`
📊 CONCURRENCY TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Requests: ${requestCount} (Total students: ${requestCount * 30})
Time Taken: ${duration.toFixed(2)}ms
Throughput: ${(requestCount / (duration / 1000)).toFixed(2)} req/sec

✅ Success: ${successes}
❌ Failed:  ${failures}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);

  return {
    duration,
    successes,
    failures,
    throughput: requestCount / (duration / 1000)
  };
};
