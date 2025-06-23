import React from 'react';
import { CreditCard, BookOpen, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses } = useData();
  const student = currentUser as Student;

  const enrolledCourses = courses.filter(course => 
    student.enrolledCourses.includes(course.id)
  );

  const attendanceRate = student.attendance.length > 0
    ? (student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100
    : 0;

  const stats = [
    {
      label: 'Pending Fees',
      value: `$${student.pendingFees}`,
      icon: CreditCard,
      color: student.pendingFees > 0 ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100',
      bgColor: student.pendingFees > 0 ? 'bg-red-50' : 'bg-green-50'
    },
    {
      label: 'Enrolled Courses',
      value: enrolledCourses.length.toString(),
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Attendance Rate',
      value: `${attendanceRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: attendanceRate >= 80 ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100',
      bgColor: attendanceRate >= 80 ? 'bg-green-50' : 'bg-yellow-50'
    },
    {
      label: 'Total Classes',
      value: student.attendance.length.toString(),
      icon: Calendar,
      color: 'text-purple-600 bg-purple-100',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {student.name}!
        </h1>
        <p className="text-gray-600">Here's your academic overview</p>
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
        {/* Enrolled Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            My Courses
          </h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                  <span className="text-sm text-gray-500">${course.fees}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.schedule}
                  </span>
                  <span className="text-blue-600 font-medium">Tutor: {course.tutorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Recent Attendance
          </h2>
          <div className="space-y-3">
            {student.attendance.slice(-5).reverse().map((record, index) => {
              const course = courses.find(c => c.id === record.courseId);
              const statusColors = {
                present: 'text-green-600 bg-green-100',
                absent: 'text-red-600 bg-red-100',
                late: 'text-yellow-600 bg-yellow-100'
              };
              const statusIcons = {
                present: CheckCircle,
                absent: Clock,
                late: Clock
              };
              const StatusIcon = statusIcons[record.status];

              return (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{course?.name}</p>
                    <p className="text-sm text-gray-500">{record.date}</p>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[record.status]}`}>
                    <StatusIcon className="h-4 w-4 mr-1" />
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fee Status Alert */}
      {student.pendingFees > 0 && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-900">Pending Fee Payment</h3>
              <p className="text-red-700 mt-1">
                You have ${student.pendingFees} in pending fees. Please contact the administration office to complete your payment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;