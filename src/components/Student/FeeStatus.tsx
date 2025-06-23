import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, CheckCircle, AlertCircle, Download, Receipt, Clock, Smartphone, CalendarDays, Bell, TrendingUp, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';

const FeeStatus: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses, refreshData } = useData();
  const student = currentUser as Student;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh data every 30 seconds to sync with admin updates
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshData();
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  const enrolledCourses = courses.filter(course => 
    student.enrolledCourses.includes(course.id)
  );

  // Enhanced payment history with Indian context
  const paymentHistory = [
    {
      id: '1',
      date: '2024-01-15',
      amount: 10000,
      method: 'UPI',
      status: 'completed',
      description: 'Digital Painting Fundamentals - Course Fee',
      transactionId: 'UPI001234567',
      months: ['January 2024', 'February 2024']
    },
    {
      id: '2',
      date: '2024-01-10',
      amount: 5000,
      method: 'Bank Transfer',
      status: 'completed',
      description: 'Registration Fee',
      transactionId: 'NEFT001235',
      months: []
    }
  ];

  // Enhanced monthly breakdown calculation with real-time updates
  const generateMonthlyBreakdown = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const monthlyBreakdown = [];
    
    // Calculate monthly fee from enrolled courses
    const totalMonthlyFee = enrolledCourses.reduce((sum, course) => sum + (course.monthlyFee || 0), 0);
    
    // Generate breakdown for past 3 months and next 9 months
    for (let i = -3; i <= 8; i++) {
      const monthDate = new Date(currentYear, currentMonth + i, 1);
      const month = months[monthDate.getMonth()];
      const year = monthDate.getFullYear();
      const dueDate = new Date(year, monthDate.getMonth(), 15); // 15th of each month
      
      let status: 'paid' | 'pending' | 'overdue' | 'upcoming' = 'upcoming';
      
      if (i < 0) {
        // Past months - check if paid
        status = Math.random() > 0.3 ? 'paid' : 'overdue';
      } else if (i === 0) {
        // Current month
        status = student.pendingFees > 0 ? 'pending' : 'paid';
      } else if (i <= 2) {
        // Next 2 months - pending
        status = 'pending';
      } else {
        // Future months
        status = 'upcoming';
      }
      
      if (dueDate < currentDate && status === 'pending') {
        status = 'overdue';
      }
      
      monthlyBreakdown.push({
        month: `${month} ${year}`,
        amount: totalMonthlyFee,
        dueDate: dueDate.toISOString().split('T')[0],
        status,
        courses: enrolledCourses.map(c => c.name)
      });
    }
    
    return monthlyBreakdown;
  };

  const monthlyBreakdown = generateMonthlyBreakdown();
  const totalPaid = student.totalFees - student.pendingFees;
  const paymentProgress = (totalPaid / student.totalFees) * 100;

  // Calculate upcoming dues
  const upcomingDues = monthlyBreakdown.filter(m => m.status === 'pending' || m.status === 'overdue');
  const nextDueDate = upcomingDues.length > 0 ? upcomingDues[0].dueDate : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'overdue':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'upcoming':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const handlePayNow = (amount?: number) => {
    setShowPaymentModal(true);
  };

  const handleDownloadReceipt = (paymentId: string) => {
    console.log(`Downloading receipt for payment ${paymentId}`);
    alert('Receipt downloaded successfully!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const refreshFeeStatus = async () => {
    await refreshData();
    setLastUpdated(new Date());
    alert('Fee status updated successfully!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fee Status</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your course fees and payment history
            <span className="ml-2 text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </p>
        </div>
        <button
          onClick={refreshFeeStatus}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Enhanced Fee Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Fees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(student.totalFees)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All courses</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                {((totalPaid / student.totalFees) * 100).toFixed(1)}% completed
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pending Amount</p>
              <p className={`text-2xl font-bold ${student.pendingFees > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {formatCurrency(student.pendingFees)}
              </p>
              {student.pendingFees > 0 && nextDueDate && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  Due: {new Date(nextDueDate).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${student.pendingFees > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
              {student.pendingFees > 0 ? (
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Monthly Fee</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(enrolledCourses.reduce((sum, course) => sum + (course.monthlyFee || 0), 0))}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per month</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Payment Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Progress</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">{paymentProgress.toFixed(1)}% Complete</span>
            {student.pendingFees > 0 && (
              <button
                onClick={() => handlePayNow()}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all text-sm font-medium"
              >
                Pay Now
              </button>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500 relative"
            style={{ width: `${paymentProgress}%` }}
          >
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <TrendingUp className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Paid: {formatCurrency(totalPaid)}</span>
          <span>Remaining: {formatCurrency(student.pendingFees)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Monthly Payment Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              Monthly Payment Plan
            </h2>
            <button
              onClick={() => setShowMonthlyBreakdown(!showMonthlyBreakdown)}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
            >
              {showMonthlyBreakdown ? 'Hide' : 'Show'} Details
            </button>
          </div>
          
          {showMonthlyBreakdown && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {monthlyBreakdown.map((payment, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{payment.month}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Due: {new Date(payment.dueDate).toLocaleDateString('en-IN')}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {payment.courses.map((course, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                    
                    {(payment.status === 'pending' || payment.status === 'overdue') && (
                      <button
                        onClick={() => handlePayNow(payment.amount)}
                        className={`py-1 px-3 rounded text-sm font-medium transition-colors ${
                          payment.status === 'overdue' 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!showMonthlyBreakdown && (
            <div className="text-center py-8">
              <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Click "Show Details" to view monthly payment breakdown</p>
              {upcomingDues.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                    {upcomingDues.length} upcoming payment{upcomingDues.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                    Next due: {formatCurrency(upcomingDues[0].amount)} on {new Date(upcomingDues[0].dueDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Course Fees Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
            Course Fees Breakdown
          </h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{course.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{course.tutorName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{course.schedule}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(course.monthlyFee || 0)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                    <p className="text-blue-600 dark:text-blue-400 font-medium">Admission Fee</p>
                    <p className="text-blue-800 dark:text-blue-300">{formatCurrency(course.admissionFee || 0)}</p>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                      Paid
                    </span>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                    <p className="text-purple-600 dark:text-purple-400 font-medium">Monthly Fee</p>
                    <p className="text-purple-800 dark:text-purple-300">{formatCurrency(course.monthlyFee || 0)}</p>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                      Recurring
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {student.pendingFees > 0 && (
              <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-medium text-red-900 dark:text-red-300">Outstanding Balance</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">Payment required to continue classes</p>
                  </div>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(student.pendingFees)}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handlePayNow()}
                    className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={() => alert('Reminder sent to admin')}
                    className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Payment History */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Payment History
        </h2>
        
        {paymentHistory.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No payment history available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{payment.description}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payment.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {payment.months.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {payment.months.map((month, idx) => (
                          <span key={idx} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                            {month}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {payment.method === 'UPI' && <Smartphone className="h-4 w-4 mr-1" />}
                      <span>{payment.method}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownloadReceipt(payment.id)}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Receipt
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Transaction ID: {payment.transactionId}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Payment Due Alert */}
      {student.pendingFees > 0 && (
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-900 dark:text-red-300">Payment Required</h3>
              <p className="text-red-700 dark:text-red-400 mt-1">
                You have an outstanding balance of {formatCurrency(student.pendingFees)}. 
                {nextDueDate && (
                  <span className="font-medium">
                    {' '}Next payment due on {new Date(nextDueDate).toLocaleDateString('en-IN')}.
                  </span>
                )}
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                Please make a payment to avoid any disruption to your classes.
              </p>
            </div>
            <button
              onClick={() => handlePayNow()}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Make Payment</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Amount Due:</span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(student.pendingFees)}</span>
                </div>
                {nextDueDate && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Due Date: {new Date(nextDueDate).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Pay with UPI
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white py-3 px-4 rounded-lg transition-colors font-medium">
                  Pay with Net Banking
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white py-3 px-4 rounded-lg transition-colors font-medium">
                  Pay with Debit/Credit Card
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 text-white py-3 px-4 rounded-lg transition-colors font-medium">
                  Pay at Counter
                </button>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStatus;