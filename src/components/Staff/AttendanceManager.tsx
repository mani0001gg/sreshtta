import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';

const AttendanceManager: React.FC = () => {
  const { students, courses, updateAttendance } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const enrolledInCourse = selectedCourse ? student.enrolledCourses.includes(selectedCourse) : true;
    return matchesSearch && enrolledInCourse;
  });

  const handleAttendanceUpdate = (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }
    updateAttendance(studentId, selectedCourse, selectedDate, status);
  };

  const getAttendanceStatus = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;
    
    const record = student.attendance.find(a => 
      a.date === selectedDate && a.courseId === selectedCourse
    );
    return record?.status || null;
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mark Attendance</h1>
        <p className="text-gray-600">Track student attendance for courses</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      {selectedCourse && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Students - {courses.find(c => c.id === selectedCourse)?.name}
          </h2>

          <div className="space-y-4">
            {filteredStudents.map((student) => {
              const currentStatus = getAttendanceStatus(student.id);
              
              return (
                <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.studentId}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {currentStatus && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentStatus)}`}>
                        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                      </span>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAttendanceUpdate(student.id, 'present')}
                        className={`p-2 rounded-lg border transition-colors ${
                          currentStatus === 'present'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-white text-green-600 border-green-300 hover:bg-green-50'
                        }`}
                        title="Mark Present"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleAttendanceUpdate(student.id, 'late')}
                        className={`p-2 rounded-lg border transition-colors ${
                          currentStatus === 'late'
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            : 'bg-white text-yellow-600 border-yellow-300 hover:bg-yellow-50'
                        }`}
                        title="Mark Late"
                      >
                        <Clock className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleAttendanceUpdate(student.id, 'absent')}
                        className={`p-2 rounded-lg border transition-colors ${
                          currentStatus === 'absent'
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : 'bg-white text-red-600 border-red-300 hover:bg-red-50'
                        }`}
                        title="Mark Absent"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students found for the selected course</p>
            </div>
          )}
        </div>
      )}

      {!selectedCourse && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
          <p className="text-gray-500">Choose a course and date to start marking attendance</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceManager;