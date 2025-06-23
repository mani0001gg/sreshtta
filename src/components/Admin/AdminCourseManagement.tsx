import React, { useState } from 'react';
import { BookOpen, Plus, Users, Clock, DollarSign, Edit3, Trash2, Search, User, TrendingUp, Calendar, Save, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Course } from '../../types';

const AdminCourseManagement: React.FC = () => {
  const { courses, staff, students, addCourse, updateCourse, removeCourse } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    admissionFee: 0,
    monthlyFee: 0,
    schedule: {
      monday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      tuesday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      wednesday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      thursday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      friday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '10:00' }
    },
    startDate: '',
    endDate: '',
    capacity: 0,
    tutorId: ''
  });

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const formatSchedule = (schedule: any) => {
    if (typeof schedule === 'string') return schedule;
    
    if (schedule && typeof schedule === 'object') {
      const enabledDays = Object.entries(schedule)
        .filter(([_, dayData]: [string, any]) => dayData && dayData.enabled)
        .map(([day, dayData]: [string, any]) => 
          `${day.charAt(0).toUpperCase() + day.slice(1)} ${dayData.startTime}-${dayData.endTime}`
        );
      
      return enabledDays.length > 0 ? enabledDays.join(', ') : 'No schedule set';
    }
    
    return 'No schedule set';
  };

  const parseScheduleFromString = (scheduleString: string) => {
    const defaultSchedule = {
      monday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      tuesday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      wednesday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      thursday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      friday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '10:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '10:00' }
    };

    if (!scheduleString || typeof scheduleString !== 'string') {
      return defaultSchedule;
    }

    // Parse schedule string like "Mon, Wed, Fri - 10:00 AM"
    try {
      const parts = scheduleString.split(' - ');
      if (parts.length === 2) {
        const daysStr = parts[0].toLowerCase();
        const timeStr = parts[1];
        
        // Convert time to 24-hour format
        let startTime = '09:00';
        let endTime = '10:00';
        
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
          const time = timeStr.replace(/AM|PM/g, '').trim();
          const hour = parseInt(time.split(':')[0]);
          const minute = time.split(':')[1] || '00';
          
          if (timeStr.includes('PM') && hour !== 12) {
            startTime = `${hour + 12}:${minute}`;
            endTime = `${hour + 13}:${minute}`;
          } else if (timeStr.includes('AM') && hour === 12) {
            startTime = `00:${minute}`;
            endTime = `01:${minute}`;
          } else {
            startTime = `${hour.toString().padStart(2, '0')}:${minute}`;
            endTime = `${(hour + 1).toString().padStart(2, '0')}:${minute}`;
          }
        }

        // Map day abbreviations to full names
        const dayMap: { [key: string]: string } = {
          'mon': 'monday',
          'tue': 'tuesday', 
          'wed': 'wednesday',
          'thu': 'thursday',
          'fri': 'friday',
          'sat': 'saturday',
          'sun': 'sunday'
        };

        // Enable days mentioned in the schedule
        Object.keys(dayMap).forEach(abbr => {
          if (daysStr.includes(abbr)) {
            const fullDay = dayMap[abbr];
            defaultSchedule[fullDay as keyof typeof defaultSchedule] = {
              enabled: true,
              startTime,
              endTime
            };
          }
        });
      }
    } catch (error) {
      console.error('Error parsing schedule:', error);
    }

    return defaultSchedule;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTutor = staff.find(s => s.id === formData.tutorId);
    
    const courseData = {
      ...formData,
      tutorName: selectedTutor?.name || '',
      enrolled: editingCourse?.enrolled || 0
    };

    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
        setEditingCourse(null);
        alert('Course updated successfully!');
      } else {
        await addCourse(courseData);
        alert('Course added successfully!');
      }

      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      admissionFee: 0,
      monthlyFee: 0,
      schedule: {
        monday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        tuesday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        wednesday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        thursday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        friday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        saturday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        sunday: { enabled: false, startTime: '09:00', endTime: '10:00' }
      },
      startDate: '',
      endDate: '',
      capacity: 0,
      tutorId: ''
    });
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    
    // Parse the schedule properly
    let scheduleData;
    if (typeof course.schedule === 'string') {
      scheduleData = parseScheduleFromString(course.schedule);
    } else if (course.schedule && typeof course.schedule === 'object') {
      scheduleData = course.schedule;
    } else {
      scheduleData = {
        monday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        tuesday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        wednesday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        thursday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        friday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        saturday: { enabled: false, startTime: '09:00', endTime: '10:00' },
        sunday: { enabled: false, startTime: '09:00', endTime: '10:00' }
      };
    }

    setFormData({
      name: course.name || '',
      description: course.description || '',
      admissionFee: course.admissionFee || 0,
      monthlyFee: course.monthlyFee || 0,
      schedule: scheduleData,
      startDate: course.startDate || '',
      endDate: course.endDate || '',
      capacity: course.capacity || 0,
      tutorId: course.tutorId || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await removeCourse(courseId);
        alert('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course. Please try again.');
      }
    }
  };

  const handleScheduleChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          [field]: value
        }
      }
    }));
  };

  const getCourseStats = (courseId: string) => {
    const enrolledStudents = students.filter(s => s.enrolledCourses.includes(courseId));
    const totalAttendance = enrolledStudents.reduce((sum, student) => {
      const courseAttendance = student.attendance.filter(a => a.courseId === courseId);
      return sum + courseAttendance.length;
    }, 0);
    
    const presentAttendance = enrolledStudents.reduce((sum, student) => {
      const courseAttendance = student.attendance.filter(a => a.courseId === courseId && a.status === 'present');
      return sum + courseAttendance.length;
    }, 0);

    const attendanceRate = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;
    const revenue = enrolledStudents.length * ((courses.find(c => c.id === courseId)?.admissionFee || 0) + 
                   (courses.find(c => c.id === courseId)?.monthlyFee || 0) * 6); // Assuming 6 months

    return {
      enrolledStudents: enrolledStudents.length,
      attendanceRate,
      revenue,
      totalClasses: totalAttendance
    };
  };

  const closeModal = () => {
    setShowAddForm(false);
    setEditingCourse(null);
    resetForm();
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Course Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all courses, assignments, and performance</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by name, description, or tutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.reduce((sum, course) => sum + course.enrolled, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(courses.reduce((sum, course) => {
                  const stats = getCourseStats(course.id);
                  return sum + stats.revenue;
                }, 0))}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Avg Capacity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.length > 0 ? Math.round(courses.reduce((sum, course) => sum + (course.enrolled / course.capacity * 100), 0) / courses.length) : 0}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filteredCourses.map((course) => {
          const stats = getCourseStats(course.id);
          const tutor = staff.find(s => s.id === course.tutorId);
          const enrollmentPercentage = (course.enrolled / course.capacity) * 100;
          
          return (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-200 dark:hover:border-purple-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{course.startDate} - {course.endDate}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(course)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Edit Course"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{course.description}</p>

              {/* Tutor Info */}
              <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="h-8 w-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{course.tutorName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{tutor?.department}</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 text-xs">
                    {formatSchedule(course.schedule)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Admission Fee:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {formatCurrency(course.admissionFee || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Monthly Fee:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {formatCurrency(course.monthlyFee || 0)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Enrollment:</span>
                  <span className={`font-medium ${
                    enrollmentPercentage >= 80 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {course.enrolled}/{course.capacity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Attendance Rate:</span>
                  <span className={`font-medium ${
                    stats.attendanceRate >= 80 ? 'text-green-600 dark:text-green-400' : 
                    stats.attendanceRate >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stats.attendanceRate.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Revenue:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(stats.revenue)}
                  </span>
                </div>

                {/* Enrollment Progress */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Capacity</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {enrollmentPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        enrollmentPercentage >= 80 ? 'bg-red-500' : 
                        enrollmentPercentage >= 60 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Course Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter course name"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter course description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign Tutor *</label>
                  <select
                    required
                    value={formData.tutorId}
                    onChange={(e) => setFormData(prev => ({ ...prev, tutorId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Tutor</option>
                    {staff.map(tutor => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.name} - {tutor.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Capacity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admission Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.admissionFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, admissionFee: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyFee: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="3000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Schedule Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Weekly Schedule</label>
                <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  {days.map((day) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={day}
                          checked={formData.schedule[day as keyof typeof formData.schedule]?.enabled || false}
                          onChange={(e) => handleScheduleChange(day, 'enabled', e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor={day} className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-20">
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </label>
                      </div>
                      
                      {formData.schedule[day as keyof typeof formData.schedule]?.enabled && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={formData.schedule[day as keyof typeof formData.schedule]?.startTime || '09:00'}
                            onChange={(e) => handleScheduleChange(day, 'startTime', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <span className="text-gray-500 dark:text-gray-400">to</span>
                          <input
                            type="time"
                            value={formData.schedule[day as keyof typeof formData.schedule]?.endTime || '10:00'}
                            onChange={(e) => handleScheduleChange(day, 'endTime', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

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
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManagement;