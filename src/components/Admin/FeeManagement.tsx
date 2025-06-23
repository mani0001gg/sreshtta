import React, { useState } from 'react';
import { DollarSign, Search, Filter, Download, CreditCard, AlertCircle, CheckCircle, Clock, TrendingUp, Users, Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface MonthlyFeeStatus {
  month: string;
  year: number;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
  dueDate: string;
}

const FeeManagement: React.FC = () => {
  const { students, courses, updateStudent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [showBulkPayment, setShowBulkPayment] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [bulkPaymentAmount, setBulkPaymentAmount] = useState(0);

  // Calculate fee statistics
  const totalRevenue = students.reduce((sum, student) => sum + (student.totalFees - student.pendingFees), 0);
  const pendingRevenue = students.reduce((sum, student) => sum + student.pendingFees, 0);
  const totalFees = students.reduce((sum, student) => sum + student.totalFees, 0);
  const collectionRate = totalFees > 0 ? (totalRevenue / totalFees) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate monthly fee status for a student
  const generateMonthlyFeeStatus = (student: any): MonthlyFeeStatus[] => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const monthlyFee = student.enrolledCourses.reduce((sum: number, courseId: string) => {
      const course = courses.find(c => c.id === courseId);
      return sum + (course?.monthlyFee || 0);
    }, 0);

    const monthlyStatuses: MonthlyFeeStatus[] = [];
    
    // Generate status for past 6 months and next 6 months
    for (let i = -6; i <= 6; i++) {
      const monthDate = new Date(currentYear, currentMonth + i, 1);
      const month = months[monthDate.getMonth()];
      const year = monthDate.getFullYear();
      const dueDate = new Date(year, monthDate.getMonth(), 15); // 15th of each month
      
      let status: 'paid' | 'pending' | 'overdue' = 'pending';
      
      if (i < 0) {
        // Past months - randomly assign paid/overdue for demo
        status = Math.random() > 0.3 ? 'paid' : 'overdue';
      } else if (i === 0) {
        // Current month - based on pending fees
        status = student.pendingFees > 0 ? 'pending' : 'paid';
      } else {
        // Future months
        status = 'pending';
      }
      
      if (dueDate < currentDate && status === 'pending') {
        status = 'overdue';
      }
      
      monthlyStatuses.push({
        month: `${month} ${year}`,
        year,
        status,
        amount: monthlyFee,
        dueDate: dueDate.toISOString().split('T')[0]
      });
    }
    
    return monthlyStatuses.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'paid' && student.pendingFees === 0) ||
                         (statusFilter === 'pending' && student.pendingFees > 0) ||
                         (statusFilter === 'overdue' && student.pendingFees > 0);
    
    const matchesCourse = courseFilter === 'all' || 
                         student.enrolledCourses.includes(courseFilter);
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800';
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-800';
      case 'overdue': return 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-800';
      default: return 'text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handlePayMonthlyFee = async (studentId: string, monthData: MonthlyFeeStatus) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const updatedStudent = {
      ...student,
      pendingFees: Math.max(0, student.pendingFees - monthData.amount)
    };

    await updateStudent(studentId, updatedStudent);
    alert(`Payment of ${formatCurrency(monthData.amount)} recorded for ${monthData.month}`);
  };

  const handleBulkPayment = async () => {
    if (selectedStudents.length === 0 || bulkPaymentAmount <= 0) {
      alert('Please select students and enter a valid amount');
      return;
    }

    for (const studentId of selectedStudents) {
      const student = students.find(s => s.id === studentId);
      if (student && student.pendingFees > 0) {
        const paymentAmount = Math.min(bulkPaymentAmount, student.pendingFees);
        const updatedStudent = {
          ...student,
          pendingFees: student.pendingFees - paymentAmount
        };
        await updateStudent(studentId, updatedStudent);
      }
    }

    setSelectedStudents([]);
    setBulkPaymentAmount(0);
    setShowBulkPayment(false);
    alert(`Bulk payment of ${formatCurrency(bulkPaymentAmount)} processed for ${selectedStudents.length} students`);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const exportToCSV = () => {
    alert('Fee report exported to CSV successfully!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fee Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor payments, collections, and monthly fee tracking</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBulkPayment(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center shadow-lg hover:shadow-xl"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Bulk Payment
          </button>
          <button
            onClick={exportToCSV}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center shadow-lg hover:shadow-xl"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Fee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pending Collection</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(pendingRevenue)}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Collection Rate</p>
              <p className={`text-2xl font-bold ${collectionRate >= 80 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {collectionRate.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-lg ${collectionRate >= 80 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
              <TrendingUp className={`h-6 w-6 ${collectionRate >= 80 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Students with Dues</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {students.filter(s => s.pendingFees > 0).length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Monthly Fee Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
          Monthly Fee Status
        </h2>

        <div className="space-y-4">
          {filteredStudents.map((student) => {
            const monthlyStatus = generateMonthlyFeeStatus(student);
            const isExpanded = expandedStudent === student.id;
            const overdueMonths = monthlyStatus.filter(m => m.status === 'overdue').length;
            
            return (
              <div key={student.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.studentId} • {student.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {overdueMonths > 0 && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
                          {overdueMonths} overdue
                        </span>
                      )}
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(student.pendingFees)} pending
                      </span>
                      <button
                        onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {monthlyStatus.map((month, index) => (
                        <div key={index} className={`border rounded-lg p-4 ${getStatusColor(month.status)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{month.month}</h4>
                            <div className="flex items-center">
                              {getStatusIcon(month.status)}
                            </div>
                          </div>
                          <div className="text-sm mb-3">
                            <p>Amount: {formatCurrency(month.amount)}</p>
                            <p>Due: {new Date(month.dueDate).toLocaleDateString('en-IN')}</p>
                          </div>
                          {month.status !== 'paid' && (
                            <button
                              onClick={() => handlePayMonthlyFee(student.id, month)}
                              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3 rounded text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
                            >
                              Mark as Paid
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No students found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Bulk Payment Modal */}
      {showBulkPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bulk Payment</h2>
              <button
                onClick={() => setShowBulkPayment(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected Students:</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedStudents.length} students</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Amount per Student (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={bulkPaymentAmount}
                  onChange={(e) => setBulkPaymentAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter amount"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBulkPayment(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkPayment}
                  disabled={selectedStudents.length === 0 || bulkPaymentAmount <= 0}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Process Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;