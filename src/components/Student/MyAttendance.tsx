import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Filter, TrendingUp, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';

const MyAttendance: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses } = useData();
  const student = currentUser as Student;
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  const enrolledCourses = courses.filter(course => 
    student.enrolledCourses.includes(course.id)
  );

  const filteredAttendance = student.attendance.filter(record => {
    const courseMatch = selectedCourse === 'all' || record.courseId === selectedCourse;
    const monthMatch = record.date.startsWith(selectedMonth);
    return courseMatch && monthMatch;
  });

  const getAttendanceStats = () => {
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(a => a.status === 'present').length;
    const late = filteredAttendance.filter(a => a.status === 'late').length;
    const absent = filteredAttendance.filter(a => a.status === 'absent').length;
    
    return {
      total,
      present,
      late,
      absent,
      percentage: total > 0 ? (present / total) * 100 : 0
    };
  };

  const getCourseAttendance = () => {
    return enrolledCourses.map(course => {
      const courseRecords = student.attendance.filter(a => a.courseId === course.id);
      const present = courseRecords.filter(a => a.status === 'present').length;
      const total = courseRecords.length;
      
      return {
        course,
        present,
        total,
        percentage: total > 0 ? (present / total) * 100 : 0
      };
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'late':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const stats = getAttendanceStats();
  const courseAttendance = getCourseAttendance();

  // Group attendance by date for calendar view
  const attendanceByDate = filteredAttendance.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {} as { [date: string]: typeof filteredAttendance });

  const sortedDates = Object.keys(attendanceByDate).sort().reverse();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Attendance</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your class attendance and performance</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Courses</option>
              {enrolledCourses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Present</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.present}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Late</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.late}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Attendance Rate</p>
              <p className={`text-2xl font-bold ${
                stats.percentage >= 80 ? 'text-green-600 dark:text-green-400' : 
                stats.percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stats.percentage.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${
              stats.percentage >= 80 ? 'bg-green-100 dark:bg-green-900/30' : 
              stats.percentage >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <TrendingUp className={`h-6 w-6 ${
                stats.percentage >= 80 ? 'text-green-600 dark:text-green-400' : 
                stats.percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course-wise Attendance */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Course Performance
            </h2>
            <div className="space-y-4">
              {courseAttendance.map(({ course, present, total, percentage }) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{course.name}</span>
                    <span className={`text-sm font-bold ${
                      percentage >= 80 ? 'text-green-600 dark:text-green-400' : 
                      percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{present}/{total} classes</span>
                    <span>{course.tutorName}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        percentage >= 80 ? 'bg-green-500' : 
                        percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Attendance Records
            </h2>
            
            {sortedDates.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Records Found</h3>
                <p className="text-gray-500 dark:text-gray-400">No attendance records for the selected period</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sortedDates.map(date => (
                  <div key={date} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {new Date(date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {attendanceByDate[date].length} class{attendanceByDate[date].length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {attendanceByDate[date].map((record, index) => {
                        const course = courses.find(c => c.id === record.courseId);
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(record.status)}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{course?.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{course?.tutorName}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(record.status)}`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Alert */}
      {stats.percentage < 75 && stats.total > 0 && (
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-300">Attendance Warning</h3>
              <p className="text-yellow-700 dark:text-yellow-400 mt-1">
                Your attendance rate is {stats.percentage.toFixed(1)}%. Maintain at least 75% attendance to avoid academic issues.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAttendance;