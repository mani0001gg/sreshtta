import React, { useState } from 'react';
import { BookOpen, Clock, User, Calendar, MapPin, Star, Users, Bell, CalendarPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Student } from '../../types';

const MyCourses: React.FC = () => {
  const { currentUser } = useAuth();
  const { courses, students } = useData();
  const student = currentUser as Student;

  const enrolledCourses = courses.filter(course => 
    student.enrolledCourses.includes(course.id)
  );

  const getCourseAttendance = (courseId: string) => {
    const courseAttendance = student.attendance.filter(a => a.courseId === courseId);
    if (courseAttendance.length === 0) return 0;
    return (courseAttendance.filter(a => a.status === 'present').length / courseAttendance.length) * 100;
  };

  const getNextClass = (schedule: string) => {
    // Mock next class calculation
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date().getDay();
    const nextDay = days[today] || 'Monday';
    return `Next: ${nextDay} at ${schedule.split(' - ')[1] || '10:00 AM'}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const addToGoogleCalendar = (course: any) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Next day
    startDate.setHours(10, 0, 0, 0); // 10:00 AM
    
    const endDate = new Date(startDate);
    endDate.setHours(12, 0, 0, 0); // 12:00 PM
    
    const eventDetails = {
      text: `${course.name} - Class`,
      dates: `${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      details: `Course: ${course.name}\nInstructor: ${course.tutorName}\nSchedule: ${course.schedule}`,
      location: 'Sreshtta Art School',
      recur: 'RRULE:FREQ=WEEKLY'
    };
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&dates=${eventDetails.dates}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}&recur=${encodeURIComponent(eventDetails.recur)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Courses</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your enrolled courses and progress</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Courses Enrolled</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Contact the administration office to enroll in courses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => {
            const attendance = getCourseAttendance(course.id);
            const nextClass = getNextClass(course.schedule);
            
            return (
              <div 
                key={course.id} 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-purple-200 dark:hover:border-purple-600"
              >
                {/* Course Header */}
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                  <p className="text-purple-100 text-sm opacity-90">{course.description}</p>
                </div>

                {/* Course Details */}
                <div className="p-6 space-y-4">
                  {/* Instructor */}
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{course.tutorName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                    </div>
                  </div>

                  {/* Schedule & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{course.duration}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{course.schedule.split(' - ')[0]}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Schedule</p>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance</span>
                      <span className={`text-sm font-bold ${
                        attendance >= 80 ? 'text-green-600 dark:text-green-400' : 
                        attendance >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {attendance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          attendance >= 80 ? 'bg-green-500' : 
                          attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${attendance}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Next Class */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">{nextClass}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{course.schedule}</p>
                  </div>

                  {/* Google Calendar Reminder */}
                  <button
                    onClick={() => addToGoogleCalendar(course)}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2 text-sm font-medium"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    <span>Add to Google Calendar</span>
                  </button>

                  {/* Course Fee */}
                  <div className="flex items-center justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(course.fees)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;