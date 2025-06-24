export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'staff' | 'admin';
  avatar?: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  enrolledCourses: string[];
  pendingFees: number;
  totalFees: number;
  attendance: AttendanceRecord[];
  groupId?: string;
}

export interface Staff extends User {
  role: 'staff';
  staffId: string;
  assignedCourses: string[];
  department: string;
}

export interface Admin extends User {
  role: 'admin';
}

export interface Course {
  id: string;
  name: string;
  description: string;
  tutorId: string;
  tutorName: string;
  department?: string;
  admissionFee?: number;
  monthlyFee?: number;
  schedule: any; // Can be string or object with day-wise schedule
  startDate?: string;
  capacity: number;
  enrolled: number;
}

export interface AttendanceRecord {
  date: string;
  courseId: string;
  status: 'present' | 'absent' | 'late';
}

export interface Group {
  id: string;
  name: string;
  programName: string;
  batchTime: string;
  fees: number;
  students: string[];
  createdBy: string;
  createdAt: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'online' | 'upi';
  status: 'paid' | 'pending' | 'overdue';
}

export interface Analytics {
  totalStudents: number;
  totalRevenue: number;
  averageAttendance: number;
  courseEnrollments: { [courseId: string]: number };
  attendanceByPeriod: { [period: string]: number };
  revenueByPeriod: { [period: string]: number };
}