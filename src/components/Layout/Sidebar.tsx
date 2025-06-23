import React from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings,
  UserPlus,
  UserCheck,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { currentUser } = useAuth();

  const getMenuItems = () => {
    switch (currentUser?.role) {
      case 'student':
        return [
          { id: 'dashboard', icon: Home, label: 'Dashboard' },
          { id: 'courses', icon: BookOpen, label: 'My Courses' },
          { id: 'attendance', icon: Calendar, label: 'Attendance' },
          { id: 'fees', icon: CreditCard, label: 'Fee Status' },
        ];
      case 'staff':
        return [
          { id: 'dashboard', icon: Home, label: 'Dashboard' },
          { id: 'students', icon: Users, label: 'Students' },
          { id: 'attendance', icon: UserCheck, label: 'Mark Attendance' },
          { id: 'courses', icon: BookOpen, label: 'Courses' },
          { id: 'groups', icon: UserPlus, label: 'Groups' },
          { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        ];
      case 'admin':
        return [
          { id: 'dashboard', icon: Home, label: 'Dashboard' },
          { id: 'students', icon: Users, label: 'Students' },
          { id: 'staff', icon: UserCheck, label: 'Staff Management' },
          { id: 'courses', icon: BookOpen, label: 'Courses' },
          { id: 'fees', icon: DollarSign, label: 'Fee Management' },
          { id: 'analytics', icon: BarChart3, label: 'Analytics' },
          { id: 'settings', icon: Settings, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white dark:bg-gray-800 w-64 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen transition-colors">
      <nav className="mt-8">
        <div className="px-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;