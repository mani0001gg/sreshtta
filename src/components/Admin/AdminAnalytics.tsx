import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, BookOpen, Clock, Filter, Download, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';

const AdminAnalytics: React.FC = () => {
  const { students, courses, staff, analytics } = useData();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [viewType, setViewType] = useState<'overview' | 'financial' | 'academic' | 'staff'>('overview');

  // Calculate comprehensive analytics
  const totalRevenue = students.reduce((sum, student) => sum + (student.totalFees - student.pendingFees), 0);
  const pendingRevenue = students.reduce((sum, student) => sum + student.pendingFees, 0);
  const totalEnrolled = courses.reduce((sum, course) => sum + course.enrolled, 0);
  const avgAttendance = students.length > 0 
    ? students.reduce((sum, student) => {
        const rate = student.attendance.length > 0 
          ? (student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100
          : 0;
        return sum + rate;
      }, 0) / students.length
    : 0;

  const collectionRate = (totalRevenue + pendingRevenue) > 0 ? (totalRevenue / (totalRevenue + pendingRevenue)) * 100 : 0;

  // Enhanced data for charts
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 150000, students: 45, courses: 8 },
    { month: 'Feb', revenue: 180000, students: 52, courses: 9 },
    { month: 'Mar', revenue: 165000, students: 48, courses: 8 },
    { month: 'Apr', revenue: 190000, students: 55, courses: 10 },
    { month: 'May', revenue: 175000, students: 50, courses: 9 },
    { month: 'Jun', revenue: 200000, students: 58, courses: 11 }
  ];

  const attendanceByDayData = [
    { day: 'Mon', attendance: 88, students: 45 },
    { day: 'Tue', attendance: 92, students: 48 },
    { day: 'Wed', attendance: 85, students: 42 },
    { day: 'Thu', attendance: 90, students: 47 },
    { day: 'Fri', attendance: 87, students: 44 },
    { day: 'Sat', attendance: 95, students: 35 },
    { day: 'Sun', attendance: 80, students: 30 }
  ];

  const coursePerformanceData = courses.map(course => {
    const enrolledStudents = students.filter(s => s.enrolledCourses.includes(course.id));
    const totalAttendance = enrolledStudents.reduce((sum, student) => {
      const courseAttendance = student.attendance.filter(a => a.courseId === course.id);
      return sum + courseAttendance.length;
    }, 0);
    
    const presentAttendance = enrolledStudents.reduce((sum, student) => {
      const courseAttendance = student.attendance.filter(a => a.courseId === course.id && a.status === 'present');
      return sum + courseAttendance.length;
    }, 0);

    const attendanceRate = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;
    const revenue = course.enrolled * (course.admissionFee + course.monthlyFee * 6); // Assuming 6 months
    const capacity = (course.enrolled / course.capacity) * 100;

    return {
      name: course.name.length > 15 ? course.name.substring(0, 15) + '...' : course.name,
      fullName: course.name,
      attendance: attendanceRate,
      revenue: revenue,
      enrolled: course.enrolled,
      capacity: capacity,
      tutor: course.tutorName
    };
  });

  const departmentData = [
    { name: 'Fine Arts', students: 25, revenue: 125000, color: '#8B5CF6' },
    { name: 'Digital Arts', students: 20, revenue: 100000, color: '#3B82F6' },
    { name: 'Contemporary Arts', students: 15, revenue: 75000, color: '#10B981' },
    { name: 'Photography', students: 12, revenue: 60000, color: '#F59E0B' },
    { name: 'Sculpture', students: 8, revenue: 40000, color: '#EF4444' }
  ];

  const feeStatusData = [
    { name: 'Paid', value: totalRevenue, color: '#10B981' },
    { name: 'Pending', value: pendingRevenue, color: '#F59E0B' }
  ];

  const staffPerformanceData = staff.map(member => {
    const assignedStudents = students.filter(s => 
      s.enrolledCourses.some(courseId => member.assignedCourses.includes(courseId))
    );
    
    const avgAttendance = assignedStudents.length > 0 
      ? assignedStudents.reduce((sum, student) => {
          const rate = student.attendance.length > 0 
            ? (student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100
            : 0;
          return sum + rate;
        }, 0) / assignedStudents.length
      : 0;

    const revenue = member.assignedCourses.reduce((sum, courseId) => {
      const course = courses.find(c => c.id === courseId);
      return sum + (course ? course.enrolled * (course.admissionFee + course.monthlyFee * 6) : 0);
    }, 0);

    return {
      name: member.name,
      students: assignedStudents.length,
      courses: member.assignedCourses.length,
      attendance: avgAttendance,
      revenue: revenue,
      department: member.department
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      label: 'Total Students',
      value: students.length.toString(),
      icon: Users,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Avg Attendance',
      value: `${avgAttendance.toFixed(1)}%`,
      icon: TrendingUp,
      color: avgAttendance >= 80 ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30' : 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
      bgColor: avgAttendance >= 80 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20',
      change: avgAttendance >= 80 ? '+5%' : '-2%',
      changeType: avgAttendance >= 80 ? 'positive' : 'negative'
    },
    {
      label: 'Active Courses',
      value: courses.length.toString(),
      icon: BookOpen,
      color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      change: '+3',
      changeType: 'positive'
    }
  ];

  const exportData = () => {
    alert('Analytics data exported successfully!');
  };

  const refreshData = () => {
    alert('Data refreshed successfully!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Advanced Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-2">
            {(['overview', 'financial', 'academic', 'staff'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setViewType(view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewType === view
                    ? 'bg-purple-600 text-white shadow-lg dark:bg-purple-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last {timeFilter}</span>
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

      {/* Dynamic Content Based on View Type */}
      {viewType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              Revenue Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-600" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} className="dark:fill-gray-300" />
                <YAxis tick={{ fontSize: 12 }} className="dark:fill-gray-300" />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']} 
                  contentStyle={{ 
                    backgroundColor: 'var(--tooltip-bg)', 
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Attendance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Weekly Attendance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceByDayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-600" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} className="dark:fill-gray-300" />
                <YAxis tick={{ fontSize: 12 }} className="dark:fill-gray-300" />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Attendance']} 
                  contentStyle={{ 
                    backgroundColor: 'var(--tooltip-bg)', 
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="attendance" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {viewType === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Fee Collection Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              Fee Collection Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'var(--tooltip-bg)', 
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {feeStatusData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}: {formatCurrency(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Department Revenue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-600" />
                <XAxis type="number" tick={{ fontSize: 12 }} className="dark:fill-gray-300" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} className="dark:fill-gray-300" />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'Revenue']} 
                  contentStyle={{ 
                    backgroundColor: 'var(--tooltip-bg)', 
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {viewType === 'academic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Course Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Course Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-600" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} className="dark:fill-gray-300" />
                <YAxis tick={{ fontSize: 12 }} className="dark:fill-gray-300" />
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    name === 'attendance' ? `${value.toFixed(1)}%` : value,
                    name === 'attendance' ? 'Attendance' : 'Enrolled'
                  ]}
                  labelFormatter={(label: any, payload: any) => {
                    const data = payload?.[0]?.payload;
                    return data ? data.fullName : label;
                  }}
                  contentStyle={{ 
                    backgroundColor: 'var(--tooltip-bg)', 
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="attendance" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Student Enrollment Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              Student Enrollment Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-600" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} className="dark:fill-gray-300" />
                <YAxis tick={{ fontSize: 12 }} className="dark:fill-gray-300" />
                <Tooltip 
                  formatter={(value: any) => [value, 'Students']} 
                  contentStyle={{ 
                    backgroundColor: 'var(--tooltip-bg)', 
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {viewType === 'staff' && (
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Staff Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Staff Performance Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffPerformanceData.map((member, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{member.department}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Students:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{member.students}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Courses:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{member.courses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Avg Attendance:</span>
                      <span className={`font-medium ${
                        member.attendance >= 80 ? 'text-green-600 dark:text-green-400' : 
                        member.attendance >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {member.attendance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(member.revenue)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Quick Insights</h3>
          <div className="space-y-2 text-sm">
            <p className="text-blue-700 dark:text-blue-300">• {students.filter(s => s.pendingFees > 0).length} students have pending fees</p>
            <p className="text-blue-700 dark:text-blue-300">• {courses.filter(c => c.enrolled >= c.capacity * 0.8).length} courses are near capacity</p>
            <p className="text-blue-700 dark:text-blue-300">• Average class size: {Math.round(totalEnrolled / courses.length)} students</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Performance Highlights</h3>
          <div className="space-y-2 text-sm">
            <p className="text-green-700 dark:text-green-300">• {Math.round(collectionRate)}% fee collection rate</p>
            <p className="text-green-700 dark:text-green-300">• {Math.round(avgAttendance)}% average attendance</p>
            <p className="text-green-700 dark:text-green-300">• {staff.length} active staff members</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Growth Metrics</h3>
          <div className="space-y-2 text-sm">
            <p className="text-purple-700 dark:text-purple-300">• 12% increase in enrollments</p>
            <p className="text-purple-700 dark:text-purple-300">• 8% revenue growth this month</p>
            <p className="text-purple-700 dark:text-purple-300">• 3 new courses launched</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --tooltip-bg: white;
          --tooltip-border: #e5e7eb;
        }
        
        .dark {
          --tooltip-bg: #374151;
          --tooltip-border: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default AdminAnalytics;