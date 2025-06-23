import React, { useState } from 'react';
import { Users, Plus, Clock, Calendar, User, Edit3, Trash2, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Group } from '../../types';

const GroupManagement: React.FC = () => {
  const { groups, students, createGroup, updateGroup, removeGroup } = useData();
  const { currentUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    programName: '',
    batchTime: '',
    students: [] as string[]
  });

  // Filter groups created by current staff member
  const myGroups = groups.filter(group => group.createdBy === currentUser?.id);
  
  const filteredGroups = myGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.programName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const groupData = {
      ...formData,
      fees: 0, // Remove fees for staff
      createdBy: currentUser?.id || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (editingGroup) {
      updateGroup(editingGroup.id, groupData);
      setEditingGroup(null);
    } else {
      createGroup(groupData);
    }

    setFormData({
      name: '',
      programName: '',
      batchTime: '',
      students: []
    });
    setShowAddForm(false);
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      programName: group.programName,
      batchTime: group.batchTime,
      students: group.students
    });
    setShowAddForm(true);
  };

  const handleDelete = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      removeGroup(groupId);
    }
  };

  const handleStudentToggle = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.includes(studentId)
        ? prev.students.filter(id => id !== studentId)
        : [...prev.students, studentId]
    }));
  };

  const getGroupStudents = (studentIds: string[]) => {
    return students.filter(student => studentIds.includes(student.id));
  };

  const getAttendanceRate = (studentIds: string[]) => {
    const groupStudents = getGroupStudents(studentIds);
    if (groupStudents.length === 0) return 0;
    
    const totalRate = groupStudents.reduce((sum, student) => {
      const rate = student.attendance.length > 0 
        ? (student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100
        : 0;
      return sum + rate;
    }, 0);
    
    return totalRate / groupStudents.length;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Group Management</h1>
          <p className="text-gray-600">Create and manage student groups with custom programs</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Group
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredGroups.map((group) => {
          const groupStudents = getGroupStudents(group.students);
          const attendanceRate = getAttendanceRate(group.students);
          
          return (
            <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-500">{group.programName}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(group)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(group.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {group.batchTime}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Created: {group.createdAt}
                  </span>
                  <span className="text-blue-600 font-medium">
                    {groupStudents.length} students
                  </span>
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{attendanceRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">Avg Attendance</p>
                  </div>
                </div>

                {/* Students List */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Students in this group:</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {groupStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {student.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Group Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingGroup ? 'Edit Group' : 'Create New Group'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Name</label>
                  <input
                    type="text"
                    required
                    value={formData.programName}
                    onChange={(e) => setFormData(prev => ({ ...prev, programName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 9:00 AM - 12:00 PM"
                    value={formData.batchTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, batchTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Students</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {students.map((student) => (
                    <label key={student.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.students.includes(student.id)}
                        onChange={() => handleStudentToggle(student.id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingGroup(null);
                    setFormData({
                      name: '',
                      programName: '',
                      batchTime: '',
                      students: []
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
                  {editingGroup ? 'Update Group' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;