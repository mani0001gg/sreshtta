import React from 'react';
import { Users, DollarSign, BookOpen, TrendingUp, Calendar, UserCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { students, staff, courses, analytics } = useData();

  const totalRevenue = students.reduce((sum, student) => sum + (student.totalFees - student.pendingFees), 0);
  const pendingRevenue = students.reduce((sum, student) => sum + student.pendingFees, 0);
  const totalEnrolled = courses.reduce((sum, course) => sum + course.enrolled, 0);

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
      color: 'text-blue-600 bg-blue-100',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Staff',
      value: staff.length.toString(),
      icon: UserCheck,
      color: 'text-green-600 bg-green-100',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-100',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Avg Attendance',
      value: `${analytics.averageAttendance}%`,
      icon: TrendingUp,
      color: 'text-orange-600 bg-orange-100',
      bgColor: 'bg-orange-50'
    }
  ];

  const attendanceData = Object.entries(analytics.attendanceByPeriod).map(([day, value]) => ({
    name: day,
    attendance: value
  }));

  const revenueData = Object.entries(analytics.revenueByPeriod).map(([month, value]) => ({
    name: month,
    revenue: value
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Complete overview of Sreshtta operations</p>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Weekly Attendance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            Course Overview
          </h2>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{course.name}</p>
                  <p className="text-sm text-gray-500">by {course.tutorName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">
                    {course.enrolled}/{course.capacity}
                  </p>
                  <p className="text-xs text-gray-500">enrolled</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Financial Overview
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">Total Collected</p>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-600 font-medium">Pending Collection</p>
              <p className="text-2xl font-bold text-yellow-700">{formatCurrency(pendingRevenue)}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Total Students</p>
              <p className="text-2xl font-bold text-blue-700">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            Recent Students
          </h2>
          <div className="space-y-3">
            {students.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    student.pendingFees > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {student.pendingFees > 0 ? `${formatCurrency(student.pendingFees)} due` : 'Paid'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;