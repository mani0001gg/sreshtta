import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Group, FeePayment, Analytics, Student, Staff } from '../types';
import { useDatabase } from '../hooks/useDatabase';

interface DataContextType {
  courses: Course[];
  groups: Group[];
  feePayments: FeePayment[];
  students: Student[];
  staff: Staff[];
  analytics: Analytics;
  loading: boolean;
  error: string | null;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (studentId: string, student: Student) => Promise<void>;
  addStaff: (staff: Omit<Staff, 'id'>) => Promise<void>;
  removeStaff: (staffId: string) => Promise<void>;
  updateAttendance: (studentId: string, courseId: string, date: string, status: 'present' | 'absent' | 'late') => Promise<void>;
  createGroup: (group: Omit<Group, 'id'>) => Promise<void>;
  updateGroup: (groupId: string, group: Omit<Group, 'id' | 'createdBy' | 'createdAt'>) => Promise<void>;
  removeGroup: (groupId: string) => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (courseId: string, course: Omit<Course, 'id' | 'enrolled'>) => Promise<void>;
  removeCourse: (courseId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data with Indian context
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Digital Painting Fundamentals',
    description: 'Learn the basics of digital art and painting techniques using industry-standard software',
    tutorId: '2',
    tutorName: 'Priya Patel',
    duration: '8 weeks',
    fees: 10000,
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    capacity: 20,
    enrolled: 15
  },
  {
    id: '2',
    name: 'Portrait Drawing Mastery',
    description: 'Master the art of portrait drawing with pencil, charcoal, and advanced techniques',
    tutorId: '2',
    tutorName: 'Priya Patel',
    duration: '6 weeks',
    fees: 8000,
    schedule: 'Tue, Thu - 2:00 PM',
    capacity: 15,
    enrolled: 12
  },
  {
    id: '3',
    name: 'Abstract Art Workshop',
    description: 'Explore creativity through abstract art techniques and experimental methods',
    tutorId: '4',
    tutorName: 'Kavya Reddy',
    duration: '4 weeks',
    fees: 6000,
    schedule: 'Sat - 11:00 AM',
    capacity: 25,
    enrolled: 20
  },
  {
    id: '4',
    name: 'Watercolor Landscapes',
    description: 'Create beautiful landscape paintings using watercolor techniques',
    tutorId: '2',
    tutorName: 'Priya Patel',
    duration: '5 weeks',
    fees: 7000,
    schedule: 'Sun - 9:00 AM',
    capacity: 18,
    enrolled: 14
  }
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Morning Beginners',
    programName: 'Foundation Art Program',
    batchTime: '9:00 AM - 12:00 PM',
    fees: 16000,
    students: ['1', '5'],
    createdBy: '2',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Advanced Evening',
    programName: 'Professional Art Development',
    batchTime: '6:00 PM - 9:00 PM',
    fees: 24000,
    students: ['6', '7'],
    createdBy: '2',
    createdAt: '2024-01-15'
  }
];

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    email: 'arjun@example.com',
    phone: '+91 9876543210',
    role: 'student',
    studentId: 'ST001',
    enrolledCourses: ['1', '2'],
    pendingFees: 5000,
    totalFees: 20000,
    attendance: [
      { date: '2024-01-15', courseId: '1', status: 'present' },
      { date: '2024-01-16', courseId: '2', status: 'present' },
      { date: '2024-01-17', courseId: '1', status: 'late' },
      { date: '2024-01-18', courseId: '2', status: 'present' },
      { date: '2024-01-19', courseId: '1', status: 'absent' },
    ],
    groupId: '1'
  },
  {
    id: '5',
    name: 'Sneha Gupta',
    email: 'sneha@example.com',
    phone: '+91 9876543213',
    role: 'student',
    studentId: 'ST002',
    enrolledCourses: ['1', '3'],
    pendingFees: 0,
    totalFees: 16000,
    attendance: [
      { date: '2024-01-15', courseId: '1', status: 'present' },
      { date: '2024-01-17', courseId: '3', status: 'absent' },
      { date: '2024-01-18', courseId: '1', status: 'present' },
      { date: '2024-01-20', courseId: '3', status: 'present' },
    ],
    groupId: '1'
  },
  {
    id: '6',
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    phone: '+91 9876543214',
    role: 'student',
    studentId: 'ST003',
    enrolledCourses: ['2', '4'],
    pendingFees: 3000,
    totalFees: 15000,
    attendance: [
      { date: '2024-01-16', courseId: '2', status: 'present' },
      { date: '2024-01-18', courseId: '2', status: 'present' },
      { date: '2024-01-21', courseId: '4', status: 'late' },
    ],
    groupId: '2'
  },
  {
    id: '7',
    name: 'Ananya Singh',
    email: 'ananya@example.com',
    phone: '+91 9876543215',
    role: 'student',
    studentId: 'ST004',
    enrolledCourses: ['3', '4'],
    pendingFees: 0,
    totalFees: 13000,
    attendance: [
      { date: '2024-01-17', courseId: '3', status: 'present' },
      { date: '2024-01-20', courseId: '3', status: 'present' },
      { date: '2024-01-21', courseId: '4', status: 'present' },
    ],
    groupId: '2'
  },
  {
    id: '8',
    name: 'Vikram Joshi',
    email: 'vikram@example.com',
    phone: '+91 9876543216',
    role: 'student',
    studentId: 'ST005',
    enrolledCourses: ['1'],
    pendingFees: 2000,
    totalFees: 10000,
    attendance: [
      { date: '2024-01-15', courseId: '1', status: 'present' },
      { date: '2024-01-17', courseId: '1', status: 'present' },
      { date: '2024-01-19', courseId: '1', status: 'present' },
    ]
  }
];

const mockStaff: Staff[] = [
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@sreshtta.com',
    phone: '+91 9876543211',
    role: 'staff',
    staffId: 'SF001',
    assignedCourses: ['1', '2', '4'],
    department: 'Fine Arts'
  },
  {
    id: '4',
    name: 'Kavya Reddy',
    email: 'kavya@sreshtta.com',
    phone: '+91 9876543217',
    role: 'staff',
    staffId: 'SF002',
    assignedCourses: ['3'],
    department: 'Contemporary Arts'
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [feePayments] = useState<FeePayment[]>([]);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  
  const db = useDatabase();

  const analytics: Analytics = {
    totalStudents: students.length,
    totalRevenue: students.reduce((sum, student) => sum + (student.totalFees - student.pendingFees), 0),
    averageAttendance: students.length > 0 
      ? students.reduce((sum, student) => {
          const rate = student.attendance.length > 0 
            ? (student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100
            : 0;
          return sum + rate;
        }, 0) / students.length
      : 0,
    courseEnrollments: courses.reduce((acc, course) => {
      acc[course.id] = course.enrolled;
      return acc;
    }, {} as { [courseId: string]: number }),
    attendanceByPeriod: {
      'Mon': 85, 'Tue': 90, 'Wed': 88, 'Thu': 92, 'Fri': 87, 'Sat': 95, 'Sun': 80
    },
    revenueByPeriod: {
      'Jan': 300000, 'Feb': 360000, 'Mar': 330000, 'Apr': 380000, 'May': 350000, 'Jun': 400000
    }
  };

  const refreshData = async () => {
    try {
      // Fetch data from database when connected
      const [dbStudents, dbStaff, dbCourses, dbGroups] = await Promise.all([
        db.getStudents(),
        db.getStaff(),
        db.getCourses(),
        db.getGroups()
      ]);

      // Update state with database data if available, otherwise use mock data
      if (dbStudents.length > 0) setStudents(dbStudents);
      if (dbStaff.length > 0) setStaff(dbStaff);
      if (dbCourses.length > 0) setCourses(dbCourses);
      if (dbGroups.length > 0) setGroups(dbGroups);
    } catch (error) {
      console.log('Using mock data - database not connected');
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      const result = await db.createStudent(studentData);
      if (result) {
        await refreshData();
      } else {
        // Fallback to local state
        const newStudent: Student = {
          ...studentData,
          id: Date.now().toString()
        };
        setStudents(prev => [...prev, newStudent]);
      }
    } catch (error) {
      // Fallback to local state
      const newStudent: Student = {
        ...studentData,
        id: Date.now().toString()
      };
      setStudents(prev => [...prev, newStudent]);
    }
  };

  const updateStudent = async (studentId: string, updatedStudent: Student) => {
    try {
      const result = await db.updateStudent(studentId, updatedStudent);
      if (result) {
        await refreshData();
      } else {
        setStudents(prev => prev.map(student => 
          student.id === studentId ? updatedStudent : student
        ));
      }
    } catch (error) {
      setStudents(prev => prev.map(student => 
        student.id === studentId ? updatedStudent : student
      ));
    }
  };

  const addStaff = async (staffData: Omit<Staff, 'id'>) => {
    try {
      const result = await db.createStaff(staffData);
      if (result) {
        await refreshData();
      } else {
        const newStaff: Staff = {
          ...staffData,
          id: Date.now().toString()
        };
        setStaff(prev => [...prev, newStaff]);
      }
    } catch (error) {
      const newStaff: Staff = {
        ...staffData,
        id: Date.now().toString()
      };
      setStaff(prev => [...prev, newStaff]);
    }
  };

  const removeStaff = async (staffId: string) => {
    try {
      const result = await db.deleteUser(staffId);
      if (result) {
        await refreshData();
      } else {
        setStaff(prev => prev.filter(s => s.id !== staffId));
      }
    } catch (error) {
      setStaff(prev => prev.filter(s => s.id !== staffId));
    }
  };

  const updateAttendance = async (studentId: string, courseId: string, date: string, status: 'present' | 'absent' | 'late') => {
    try {
      const result = await db.markAttendance({
        student_id: studentId,
        course_id: courseId,
        date,
        status
      });
      
      if (result) {
        await refreshData();
      } else {
        setStudents(prev => prev.map(student => {
          if (student.id === studentId) {
            const existingRecord = student.attendance.find(a => a.date === date && a.courseId === courseId);
            if (existingRecord) {
              existingRecord.status = status;
            } else {
              student.attendance.push({ date, courseId, status });
            }
          }
          return student;
        }));
      }
    } catch (error) {
      setStudents(prev => prev.map(student => {
        if (student.id === studentId) {
          const existingRecord = student.attendance.find(a => a.date === date && a.courseId === courseId);
          if (existingRecord) {
            existingRecord.status = status;
          } else {
            student.attendance.push({ date, courseId, status });
          }
        }
        return student;
      }));
    }
  };

  const createGroup = async (groupData: Omit<Group, 'id'>) => {
    try {
      const result = await db.createGroup(groupData);
      if (result) {
        await refreshData();
      } else {
        const newGroup: Group = {
          ...groupData,
          id: Date.now().toString()
        };
        setGroups(prev => [...prev, newGroup]);
      }
    } catch (error) {
      const newGroup: Group = {
        ...groupData,
        id: Date.now().toString()
      };
      setGroups(prev => [...prev, newGroup]);
    }
  };

  const updateGroup = async (groupId: string, groupData: Omit<Group, 'id' | 'createdBy' | 'createdAt'>) => {
    try {
      const result = await db.updateGroup(groupId, groupData);
      if (result) {
        await refreshData();
      } else {
        setGroups(prev => prev.map(group => 
          group.id === groupId 
            ? { ...group, ...groupData }
            : group
        ));
      }
    } catch (error) {
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, ...groupData }
          : group
      ));
    }
  };

  const removeGroup = async (groupId: string) => {
    try {
      const result = await db.deleteGroup(groupId);
      if (result) {
        await refreshData();
      } else {
        setGroups(prev => prev.filter(g => g.id !== groupId));
      }
    } catch (error) {
      setGroups(prev => prev.filter(g => g.id !== groupId));
    }
  };

  const addCourse = async (courseData: Omit<Course, 'id'>) => {
    try {
      const result = await db.createCourse({
        ...courseData,
        enrolled: 0
      });
      if (result) {
        await refreshData();
      } else {
        const newCourse: Course = {
          ...courseData,
          id: Date.now().toString(),
          enrolled: 0
        };
        setCourses(prev => [...prev, newCourse]);
      }
    } catch (error) {
      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
        enrolled: 0
      };
      setCourses(prev => [...prev, newCourse]);
    }
  };

  const updateCourse = async (courseId: string, courseData: Omit<Course, 'id' | 'enrolled'>) => {
    try {
      const result = await db.updateCourse(courseId, courseData);
      if (result) {
        await refreshData();
      } else {
        setCourses(prev => prev.map(course => 
          course.id === courseId 
            ? { ...course, ...courseData }
            : course
        ));
      }
    } catch (error) {
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, ...courseData }
          : course
      ));
    }
  };

  const removeCourse = async (courseId: string) => {
    try {
      const result = await db.deleteCourse(courseId);
      if (result) {
        await refreshData();
      } else {
        setCourses(prev => prev.filter(c => c.id !== courseId));
      }
    } catch (error) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
    }
  };

  const value = {
    courses,
    groups,
    feePayments,
    students,
    staff,
    analytics,
    loading: db.loading,
    error: db.error,
    addStudent,
    updateStudent,
    addStaff,
    removeStaff,
    updateAttendance,
    createGroup,
    updateGroup,
    removeGroup,
    addCourse,
    updateCourse,
    removeCourse,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};