import React, { useState } from 'react';
import { BookOpen, Plus, Users, Clock, Edit3, Trash2, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../types';

const CourseManagement: React.FC = () => {
  const { courses, staff, addCourse, updateCourse, removeCourse } = useData();
  const { currentUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    fees: 0,
    schedule: '',
    capacity: 0
  });

  // Filter courses assigned to current staff member
  const staffMember = staff.find(s => s.id === currentUser?.id);
  const assignedCourses = courses.filter(course => 
    staffMember?.assignedCourses.includes(course.id)
  );

  const filteredCourses = assignedCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseData = {
      ...formData,
      tutorId: currentUser?.id || '',
      tutorName: currentUser?.name || '',
      enrolled: editingCourse?.enrolled || 0
    };

    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
      setEditingCourse(null);
    } else {
      addCourse(courseData);
    }

    setFormData({
      name: '',
      description: '',
      duration: '',
      fees: 0,
      schedule: '',
      capacity: 0
    });
    setShowAddForm(false);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description,
      duration: course.duration,
      fees: course.fees,
      schedule: course.schedule,
      capacity: course.capacity
    });
    setShowAddForm(true);
  };

  const handleDelete = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      removeCourse(courseId);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Manage your assigned courses and curriculum</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center"
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
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.duration}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(course)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(course.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{course.description}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.schedule}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Capacity: {course.capacity}
                </span>
                <span className={`font-medium ${
                  course.enrolled >= course.capacity * 0.8 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {course.enrolled} enrolled
                </span>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Enrollment</span>
                  <span className="text-xs text-gray-500">
                    {Math.round((course.enrolled / course.capacity) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      course.enrolled >= course.capacity * 0.8 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((course.enrolled / course.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Course Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 8 weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Mon, Wed, Fri - 10:00 AM"
                    value={formData.schedule}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCourse(null);
                    setFormData({
                      name: '',
                      description: '',
                      duration: '',
                      fees: 0,
                      schedule: '',
                      capacity: 0
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
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

export default CourseManagement;