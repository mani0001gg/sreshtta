import React, { useState } from 'react';
import { Plus, Search, User, Mail, Phone, Calendar, Edit3, Trash2, Save, X, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

const StudentManagement: React.FC = () => {
  const { students, courses, addStudent, updateStudent } = useData();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<Student | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91 ',
    studentId: '',
    enrolledCourses: [] as string[],
    pendingFees: 0,
    totalFees: 0
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total fees based on selected courses for staff
    let calculatedTotalFees = formData.totalFees;
    let calculatedPendingFees = formData.pendingFees;
    
    if (currentUser?.role === 'staff') {
      calculatedTotalFees = formData.enrolledCourses.reduce((sum, courseId) => {
        const course = courses.find(c => c.id === courseId);
        return sum + (course ? (course.admissionFee || 0) + (course.monthlyFee || 0) * 6 : 0);
      }, 0);
      calculatedPendingFees = calculatedTotalFees; // All fees pending for new students
    }
    
    if (editingStudent) {
      const updatedStudent: Student = {
        ...editingStudent,
        ...formData,
        totalFees: calculatedTotalFees,
        pendingFees: calculatedPendingFees,
        role: 'student' as const
      };
      await updateStudent(editingStudent.id, updatedStudent);
      setEditingStudent(null);
    } else {
      await addStudent({
        ...formData,
        totalFees: calculatedTotalFees,
        pendingFees: calculatedPendingFees,
        role: 'student' as const,
        attendance: []
      });
    }

    resetForm();
    setShowAddForm(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '+91 ',
      studentId: '',
      enrolledCourses: [],
      pendingFees: 0,
      totalFees: 0
    });
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      studentId: student.studentId,
      enrolledCourses: student.enrolledCourses,
      pendingFees: student.pendingFees,
      totalFees: student.totalFees
    });
    setShowAddForm(true);
  };

  const handlePayment = async (student: Student) => {
    if (paymentAmount <= 0 || paymentAmount > student.pendingFees) {
      alert('Please enter a valid payment amount');
      return;
    }

    const updatedStudent: Student = {
      ...student,
      pendingFees: student.pendingFees - paymentAmount
    };

    await updateStudent(student.id, updatedStudent);
    setShowPaymentModal(null);
    setPaymentAmount(0);
    alert(`Payment of ₹${paymentAmount} recorded successfully!`);
  };

  const handleCourseToggle = (courseId: string) => {
    setFormData(prev => ({
      ...prev,
      enrolledCourses: prev.enrolledCourses.includes(courseId)
        ? prev.enrolledCourses.filter(id => id !== courseId)
        : [...prev.enrolledCourses, courseId]
    }));
  };

  const closeModal = () => {
    setShowAddForm(false);
    setEditingStudent(null);
    resetForm();
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage student enrollment and information</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredStudents.map((student) => {
          const attendanceRate = student.attendance.length > 0
            ? (student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100
            : 0;

          return (
            <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-200 dark:hover:border-purple-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{student.studentId}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(student)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Edit Student"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  {currentUser?.role === 'admin' && student.pendingFees > 0 && (
                    <button 
                      onClick={() => setShowPaymentModal(student)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                      title="Record Payment"
                    >
                      <CreditCard className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  {student.email}
                </div>
                {currentUser?.role === 'admin' && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {student.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {student.enrolledCourses.length} courses enrolled
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance</span>
                  <span className={`text-sm font-medium ${
                    attendanceRate >= 80 ? 'text-green-600 dark:text-green-400' : attendanceRate >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {attendanceRate.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      attendanceRate >= 80 ? 'bg-green-500' : attendanceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Fee Status - Only for Admin */}
              {currentUser?.role === 'admin' && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Fee Status</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      student.pendingFees > 0 
                        ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30' 
                        : 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30'
                    }`}>
                      {student.pendingFees > 0 ? `${formatCurrency(student.pendingFees)} due` : 'Paid'}
                    </span>
                  </div>
                  {student.pendingFees > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total: {formatCurrency(student.totalFees)} | Paid: {formatCurrency(student.totalFees - student.pendingFees)}
                    </div>
                  )}
                </div>
              )}

              {/* Fee Status for Staff - Only show status, not amount */}
              {currentUser?.role === 'staff' && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Fee Status</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      student.pendingFees > 0 
                        ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30' 
                        : 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30'
                    }`}>
                      {student.pendingFees > 0 ? 'Pending' : 'Paid'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Record Payment</h2>
              <button
                onClick={() => setShowPaymentModal(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{showPaymentModal.name}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Total Fees:</span>
                    <span>{formatCurrency(showPaymentModal.totalFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Amount:</span>
                    <span>{formatCurrency(showPaymentModal.totalFees - showPaymentModal.pendingFees)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-red-600 dark:text-red-400">
                    <span>Pending Amount:</span>
                    <span>{formatCurrency(showPaymentModal.pendingFees)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  max={showPaymentModal.pendingFees}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter payment amount"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Maximum: {formatCurrency(showPaymentModal.pendingFees)}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePayment(showPaymentModal)}
                  disabled={paymentAmount <= 0 || paymentAmount > showPaymentModal.pendingFees}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter student's full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., ST001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="+91 9876543210"
                  />
                </div>
                
                {/* Fee fields only for Admin */}
                {currentUser?.role === 'admin' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Fees (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.totalFees}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalFees: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="20000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pending Fees (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        max={formData.totalFees}
                        value={formData.pendingFees}
                        onChange={(e) => setFormData(prev => ({ ...prev, pendingFees: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="5000"
                      />
                    </div>
                  </>
                )}
              </div>

              <CourseSelection 
                courses={courses}
                selectedCourses={formData.enrolledCourses}
                onCourseToggle={handleCourseToggle}
                showFees={currentUser?.role === 'admin'}
              />

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Course Selection Component with Search
interface CourseSelectionProps {
  courses: any[];
  selectedCourses: string[];
  onCourseToggle: (courseId: string) => void;
  showFees?: boolean;
}

const CourseSelection: React.FC<CourseSelectionProps> = ({ courses, selectedCourses, onCourseToggle, showFees = true }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.tutorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Courses</label>
      
      {/* Search for courses */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
        {filteredCourses.map((course) => (
          <label key={course.id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-600 cursor-pointer transition-colors bg-white dark:bg-gray-700 shadow-sm">
            <input
              type="checkbox"
              checked={selectedCourses.includes(course.id)}
              onChange={() => onCourseToggle(course.id)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{course.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">by {course.tutorName}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {course.schedule} {showFees && `• Admission: ${formatCurrency(course.admissionFee || 0)} • Monthly: ${formatCurrency(course.monthlyFee || 0)}`}
              </p>
            </div>
          </label>
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-2 text-center py-8">
            <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No courses found</p>
          </div>
        )}
      </div>
      
      {selectedCourses.length > 0 && (
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Selected {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default StudentManagement;