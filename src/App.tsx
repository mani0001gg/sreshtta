import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import StudentDashboard from './components/Student/StudentDashboard';
import MyCourses from './components/Student/MyCourses';
import MyAttendance from './components/Student/MyAttendance';
import FeeStatus from './components/Student/FeeStatus';
import StaffDashboard from './components/Staff/StaffDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import StudentManagement from './components/Common/StudentManagement';
import AttendanceManager from './components/Staff/AttendanceManager';
import CourseManagement from './components/Staff/CourseManagement';
import GroupManagement from './components/Staff/GroupManagement';
import StaffAnalytics from './components/Staff/StaffAnalytics';
import StaffManagement from './components/Admin/StaffManagement';
import AdminCourseManagement from './components/Admin/AdminCourseManagement';
import FeeManagement from './components/Admin/FeeManagement';
import AdminAnalytics from './components/Admin/AdminAnalytics';
import Settings from './components/Admin/Settings';

const MainApp: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentUser.role) {
      case 'student':
        switch (activeTab) {
          case 'dashboard': return <StudentDashboard />;
          case 'courses': return <MyCourses />;
          case 'attendance': return <MyAttendance />;
          case 'fees': return <FeeStatus />;
          default: return <StudentDashboard />;
        }
      case 'staff':
        switch (activeTab) {
          case 'dashboard': return <StaffDashboard />;
          case 'students': return <StudentManagement />;
          case 'attendance': return <AttendanceManager />;
          case 'courses': return <CourseManagement />;
          case 'groups': return <GroupManagement />;
          case 'analytics': return <StaffAnalytics />;
          default: return <StaffDashboard />;
        }
      case 'admin':
        switch (activeTab) {
          case 'dashboard': return <AdminDashboard />;
          case 'students': return <StudentManagement />;
          case 'staff': return <StaffManagement />;
          case 'courses': return <AdminCourseManagement />;
          case 'fees': return <FeeManagement />;
          case 'analytics': return <AdminAnalytics />;
          case 'settings': return <Settings />;
          default: return <AdminDashboard />;
        }
      default:
        return <div className="p-6">Access Denied</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainApp />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;