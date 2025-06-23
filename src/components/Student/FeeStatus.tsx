import React, { useState } from 'react';
import { CreditCard, DollarSign, Calendar, CheckCircle, AlertCircle, Download, Receipt, Clock, Smartphone, CalendarDays } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';

const FeeStatus: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses } = useData();
  const student = currentUser as Student;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);

  const enrolledCourses = courses.filter(course => 
    student.enrolledCourses.includes(course.id)
  );

  // Mock payment history with Indian context
  const paymentHistory = [
    {
      id: '1',
      date: '2024-01-15',
      amount: 10000,
      method: 'UPI',
      status: 'completed',
      description: 'Digital Painting Fundamentals - Course Fee',
      transactionId: 'UPI001234567'
    },
    {
      id: '2',
      date: '2024-01-10',
      amount: 5000,
      method: 'Bank Transfer',
      status: 'completed',
      description: 'Registration Fee',
      transactionId: 'NEFT001235'
    }
  ];

  // Monthly breakdown calculation
  const monthlyBreakdown = [
    { month: 'January 2024', amount: 4000, dueDate: '2024-01-31', status: 'paid' },
    { month: 'February 2024', amount: 4000, dueDate: '2024-02-29', status: 'paid' },
    { month: 'March 2024', amount: 4000, dueDate: '2024-03-31', status: 'pending' },
    { month: 'April 2024', amount: 4000, dueDate: '2024-04-30', status: 'upcoming' },
    { month: 'May 2024', amount: 4000, dueDate: '2024-05-31', status: 'upcoming' }
  ];

  const totalPaid = student.totalFees - student.pendingFees;
  const paymentProgress = (totalPaid / student.totalFees) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
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
    // Mock download functionality
    console.log(`Downloading receipt for payment ${paymentId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fee Status</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your course fees and payment history</p>
      </div>

      {/* Fee Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Fees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(student.totalFees)}</p>
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
      </div>

      {/* Payment Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Progress</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{paymentProgress.toFixed(1)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${paymentProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Paid: {formatCurrency(totalPaid)}</span>
          <span>Remaining: {formatCurrency(student.pendingFees)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Payment Breakdown */}
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
            <div className="space-y-4">
              {monthlyBreakdown.map((payment, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{payment.month}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Due: {new Date(payment.dueDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                    
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => handlePayNow(payment.amount)}
                        className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white py-1 px-3 rounded text-sm font-medium transition-colors"
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
            </div>
          )}
        </div>

        {/* Course Fees Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
            Course Fees Breakdown
          </h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{course.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{course.tutorName}</p>
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(course.fees)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{course.duration}</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                    Paid
                  </span>
                </div>
              </div>
            ))}
            
            {student.pendingFees > 0 && (
              <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-red-900 dark:text-red-300">Outstanding Balance</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">Payment required</p>
                  </div>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">{formatCurrency(student.pendingFees)}</span>
                </div>
                <button
                  onClick={() => handlePayNow()}
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                >
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment History */}
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
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{payment.description}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payment.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
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

      {/* Payment Due Alert */}
      {student.pendingFees > 0 && (
        <div className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-900 dark:text-red-300">Payment Required</h3>
              <p className="text-red-700 dark:text-red-400 mt-1">
                You have an outstanding balance of {formatCurrency(student.pendingFees)}. Please make a payment to avoid any disruption to your classes.
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