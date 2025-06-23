import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Calendar, BookOpen, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const StaffAnalytics: React.FC = () => {
  const { students, courses, groups, analytics } = useData();
  const { currentUser } = useAuth();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  // Filter data for current staff member
  const assignedCourses = courses.filter(course => course.tutorId === currentUser?.id);
  
  const myStudents = students.filter(student =>
    student.enrolledCourses.some(courseId => assignedCourses.map(c => c.id).includes(courseId))
  );

  const myGroups = groups.filter(group => group.createdBy === currentUser?.id);

  // Calculate analytics
  const totalStudents = myStudents.length;
  const avgAttendance = myStudents.length > 0 
    ? myStudents.reduce((sum, student) => {
        const rate = student.attendance.length > 0 
          ? (student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100
          : 0;
        return sum + rate;
      }, 0) / myStudents.length
    : 0;

  // Attendance data by course
  const attendanceByCourse = assignedCourses.map(course => {
    const courseStudents = myStudents.filter(s => s.enrolledCourses.includes(course.id));
    const totalAttendance = courseStudents.reduce((sum, student) => {
      const courseAttendance = student.attendance.filter(a => a.courseId === course.id);
      const rate = courseAttendance.length > 0 
        ? (courseAttendance.filter(a => a.status === 'present').length / courseAttendance.length) * 100
        : 0;
      return sum + rate;
    }, 0);
    
    return {
      name: course.name.length > 15 ? course.name.substring(0, 15) + '...' : course.name,
      fullName: course.name,
      attendance: courseStudents.length > 0 ? totalAttendance / courseStudents.length : 0,
      students: courseStudents.length,
      capacity: course.capacity
    };
  });

  // Weekly attendance trend (mock data with some variation)
  const weeklyAttendance = [
    { day: 'Mon', attendance: Math.max(0, avgAttendance + Math.random() * 10 - 5) },
    { day: 'Tue', attendance: Math.max(0, avgAttendance + Math.random() * 10 - 5) },
    { day: 'Wed', attendance: Math.max(0, avgAttendance + Math.random() * 10 - 5) },
    { day: 'Thu', attendance: Math.max(0, avgAttendance + Math.random() * 10 - 5) },
    { day: 'Fri', attendance: Math.max(0, avgAttendance + Math.random() * 10 - 5) },
    { day: 'Sat', attendance: Math.max(0, avgAttendance + Math.random() * 10 - 5) },
    { day: 'Sun', attendance: Math.max(0, avgAttendance + Math.random() * 10 - 5) }
  ];

  // Student performance data
  const studentPerformance = myStudents.map(student => {
    const attendanceRate = student.attendance.length > 0
      ? (student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100
      : 0;
    
    return {
      id: student.id,
      name: student.name.split(' ')[0],
      fullName: student.name,
      attendance: attendanceRate,
      courses: student.enrolledCourses.length,
      totalClasses: student.attendance.length
    };
  }).sort((a, b) => b.attendance - a.attendance).slice(0, 10);

  // Filter students by course if selected
  const filteredStudents = selectedCourse === 'all' 
    ? studentPerformance 
    : studentPerformance.filter(student => 
        myStudents.find(s => s.id === student.id)?.enrolledCourses.includes(selectedCourse)
      );

  const stats = [
    {
      label: 'My Students',
      value: totalStudents.toString(),
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Avg Attendance',
      value: `${avgAttendance.toFixed(1)}%`,
      icon: TrendingUp,
      color: avgAttendance >= 80 ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100',
      bgColor: avgAttendance >= 80 ? 'bg-green-50' : 'bg-yellow-50',
      change: avgAttendance >= 80 ? '+5%' : '-2%',
      changeType: avgAttendance >= 80 ? 'positive' : 'negative'
    },
    {
      label: 'Active Courses',
      value: assignedCourses.length.toString(),
      icon: BookOpen,
      color: 'text-purple-600 bg-purple-100',
      bgColor: 'bg-purple-50',
      change: '+2',
      changeType: 'positive'
    },
    {
      label: 'Active Groups',
      value: myGroups.length.toString(),
      icon: BookOpen,
      color: 'text-purple-600 bg-purple-100',
      bgColor: 'bg-purple-50',
      change: '+3',
      changeType: 'positive'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your students and courses performance</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-2">
            {(['week', 'month', 'year'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === filter
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            <option value="all">All Courses</option>
            {assignedCourses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last {timeFilter}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Attendance by Course */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            Attendance by Course
          </h2>
          {attendanceByCourse.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceByCourse}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value.toFixed(1)}%`,
                    'Attendance'
                  ]}
                  labelFormatter={(label: any, payload: any) => {
                    const data = payload?.[0]?.payload;
                    return data ? data.fullName : label;
                  }}
                />
                <Bar dataKey="attendance" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No course data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Weekly Attendance Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Weekly Attendance Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Attendance']} />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Student Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-orange-600" />
            Student Performance
            {selectedCourse !== 'all' && (
              <span className="ml-2 text-sm text-gray-500">
                ({assignedCourses.find(c => c.id === selectedCourse)?.name})
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-medium">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.fullName}</p>
                    <p className="text-sm text-gray-500">
                      {student.courses} courses • {student.totalClasses} classes
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    student.attendance >= 80 ? 'text-green-600' : 
                    student.attendance >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {student.attendance.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
            {filteredStudents.length === 0 && (
              <div className="col-span-3 text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No students found for selected criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Performance Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Course Performance Summary
        </h2>
        {assignedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedCourses.map((course) => {
              const courseStudents = myStudents.filter(s => s.enrolledCourses.includes(course.id));
              const avgCourseAttendance = courseStudents.length > 0 
                ? courseStudents.reduce((sum, student) => {
                    const courseAttendance = student.attendance.filter(a => a.courseId === course.id);
                    const rate = courseAttendance.length > 0 
                      ? (courseAttendance.filter(a => a.status === 'present').length / courseAttendance.length) * 100
                      : 0;
                    return sum + rate;
                  }, 0) / courseStudents.length
                : 0;

              const enrollmentPercentage = (courseStudents.length / course.capacity) * 100;

              return (
                <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-4">{course.name}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Enrollment:</span>
                      <div className="text-right">
                        <span className="font-medium">{courseStudents.length}/{course.capacity}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              enrollmentPercentage >= 80 ? 'bg-green-500' : 
                              enrollmentPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Attendance:</span>
                      <span className={`font-medium ${
                        avgCourseAttendance >= 80 ? 'text-green-600' : 
                        avgCourseAttendance >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {avgCourseAttendance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Schedule:</span>
                      <span className="font-medium text-gray-700 text-xs">
                        {course.schedule}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses assigned</h3>
            <p className="text-gray-500">Contact your administrator to get courses assigned</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffAnalytics;