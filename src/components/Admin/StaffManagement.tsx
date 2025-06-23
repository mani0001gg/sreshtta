import React, { useState } from 'react';
import { Plus, Search, User, Mail, Phone, Edit3, Trash2, Save, X, UserCheck, BookOpen, Building } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Staff } from '../../types';

const StaffManagement: React.FC = () => {
  const { staff, courses, addStaff, removeStaff } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    staffId: '',
    department: '',
    assignedCourses: [] as string[]
  });

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStaff) {
      // Update logic would go here
      setEditingStaff(null);
    } else {
      addStaff({
        ...formData,
        role: 'staff' as const
      });
    }

    resetForm();
    setShowAddForm(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      staffId: '',
      department: '',
      assignedCourses: []
    });
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      staffId: staffMember.staffId,
      department: staffMember.department,
      assignedCourses: staffMember.assignedCourses
    });
    setShowAddForm(true);
  };

  const handleDelete = (staffId: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      removeStaff(staffId);
    }
  };

  const handleCourseToggle = (courseId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedCourses: prev.assignedCourses.includes(courseId)
        ? prev.assignedCourses.filter(id => id !== courseId)
        : [...prev.assignedCourses, courseId]
    }));
  };

  const closeModal = () => {
    setShowAddForm(false);
    setEditingStaff(null);
    resetForm();
  };

  const departments = ['Fine Arts', 'Contemporary Arts', 'Digital Arts', 'Sculpture', 'Photography'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
          <p className="text-gray-600">Manage teaching staff and course assignments</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Staff Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff by name, email, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredStaff.map((staffMember) => (
          <div key={staffMember.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{staffMember.name}</h3>
                  <p className="text-sm text-gray-500">{staffMember.staffId}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(staffMember)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Staff"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(staffMember.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Staff"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                {staffMember.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                {staffMember.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Building className="h-4 w-4 mr-2 text-gray-400" />
                {staffMember.department}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Assigned Courses</span>
                <span className="text-sm font-medium text-blue-600">
                  {staffMember.assignedCourses.length}
                </span>
              </div>
              <div className="space-y-1">
                {staffMember.assignedCourses.slice(0, 2).map(courseId => {
                  const course = courses.find(c => c.id === courseId);
                  return course ? (
                    <div key={courseId} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      {course.name}
                    </div>
                  ) : null;
                })}
                {staffMember.assignedCourses.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{staffMember.assignedCourses.length - 2} more
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Add/Edit Staff Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Enter staff member's full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.staffId}
                    onChange={(e) => setFormData(prev => ({ ...prev, staffId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="e.g., SF001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="staff@artschool.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Assign Courses</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {courses.map((course) => (
                    <label key={course.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer transition-colors bg-white shadow-sm">
                      <input
                        type="checkbox"
                        checked={formData.assignedCourses.includes(course.id)}
                        onChange={() => handleCourseToggle(course.id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{course.name}</p>
                        <p className="text-sm text-gray-500">{course.schedule}</p>
                        <p className="text-xs text-gray-400">{course.duration} • ${course.fees}</p>
                      </div>
                    </label>
                  ))}
                </div>
                
                {formData.assignedCourses.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    Selected {formData.assignedCourses.length} course{formData.assignedCourses.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;