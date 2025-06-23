import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, Staff, Admin } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    email: 'student@sreshtta.com',
    phone: '+91 9876543210',
    role: 'student',
    studentId: 'ST001',
    enrolledCourses: ['1', '2'],
    pendingFees: 5000,
    totalFees: 20000,
    attendance: [
      { date: '2024-01-15', courseId: '1', status: 'present' },
      { date: '2024-01-16', courseId: '2', status: 'present' },
      { date: '2024-01-17', courseId: '1', status: 'late' },
    ],
    groupId: '1'
  } as Student,
  {
    id: '2',
    name: 'Priya Patel',
    email: 'staff@sreshtta.com',
    phone: '+91 9876543211',
    role: 'staff',
    staffId: 'SF001',
    assignedCourses: ['1', '3'],
    department: 'Fine Arts'
  } as Staff,
  {
    id: '3',
    name: 'Rajesh Kumar',
    email: 'admin@sreshtta.com',
    phone: '+91 9876543212',
    role: 'admin'
  } as Admin
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};