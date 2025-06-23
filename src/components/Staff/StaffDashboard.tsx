import React from 'react';
import { Users, Calendar, BookOpen, TrendingUp, UserCheck, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Staff } from '../../types';

const StaffDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses, students, analytics } = useData();
  const staff = currentUser as Staff;

  const assignedCourses = courses.filter(course => 
    staff.assignedCourses.includes(course.id)
  );

  const myStudents = students.filter(student =>
    student.enrolledCourses.some(courseId => staff.assignedCourses.includes(courseId))
  );

  const totalEnrolled = assignedCourses.reduce((sum, course) => sum + course.enrolled, 0);
  const avgAttendance = myStudents.length > 0 
    ? myStudents.reduce((sum, student) => {
        const rate = student.attendance.length > 0 
          ? (student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100
          : 0;
        return sum + rate;
      }, 0) / myStudents.length
    : 0;

  const stats = [
    {
      label: 'Assigned Courses',
      value: assignedCourses.length.toString(),
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Students',
      value: myStudents.length.toString(),
      icon: Users,
      color: 'text-green-600 bg-green-100',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Enrolled',
      value: totalEnrolled.toString(),
      icon: UserCheck,
      color: 'text-purple-600 bg-purple-100',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Avg Attendance',
      value: `${avgAttendance.toFixed(1)}%`,
      icon: TrendingUp,
      color: avgAttendance >= 80 ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100',
      bgColor: avgAttendance >= 80 ? 'bg-green-50' : 'bg-yellow-50'
    }
  ];

  const pendingFeeStudents = myStudents.filter(student => student.pendingFees > 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {staff.name}
        </h1>
        <p className="text-gray-600">Staff Dashboard - {staff.department}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assigned Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            My Courses
          </h2>
          <div className="space-y-4">
            {assignedCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                  <span className="text-sm text-gray-500">{course.enrolled}/{course.capacity}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.schedule}
                  </span>
                  <span className="text-blue-600 font-medium">${course.fees}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            My Students
          </h2>
          <div className="space-y-3">
            {myStudents.slice(0, 5).map((student) => {
              const attendanceRate = student.attendance.length > 0
                ? (student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100
                : 0;
              
              return (
                <div key={student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      attendanceRate >= 80 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {attendanceRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">Attendance</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pending Fees Alert */}
      {pendingFeeStudents.length > 0 && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-yellow-600 mr-3" />
            <h3 className="text-lg font-medium text-yellow-900">Students with Pending Fees</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingFeeStudents.map((student) => (
              <div key={student.id} className="bg-white p-4 rounded-lg border border-yellow-200">
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-600">{student.email}</p>
                <p className="text-sm font-medium text-red-600 mt-1">
                  Pending: ${student.pendingFees}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;