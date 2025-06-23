import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Student, Staff, Course, Group, AttendanceRecord } from '../types';

export const useDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Users
  const getUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Students
  const getStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          users (*)
        `);
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, studentData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Staff
  const getStaff = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          users (*)
        `);
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createStaff = async (staffData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .insert([staffData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStaff = async (id: string, staffData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .update(staffData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Courses
  const getCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id: string, courseData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Attendance
  const getAttendance = async (studentId?: string, courseId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('attendance').select('*');
      
      if (studentId) query = query.eq('student_id', studentId);
      if (courseId) query = query.eq('course_id', courseId);
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (attendanceData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendance')
        .upsert([attendanceData], {
          onConflict: 'student_id,course_id,date'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Groups
  const getGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups')
        .insert([groupData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (id: string, groupData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups')
        .update(groupData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fee Payments
  const getFeePayments = async (studentId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('fee_payments').select('*');
      
      if (studentId) query = query.eq('student_id', studentId);
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createFeePayment = async (paymentData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fee_payments')
        .insert([paymentData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    // Users
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    // Students
    getStudents,
    createStudent,
    updateStudent,
    // Staff
    getStaff,
    createStaff,
    updateStaff,
    // Courses
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    // Attendance
    getAttendance,
    markAttendance,
    // Groups
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    // Fee Payments
    getFeePayments,
    createFeePayment,
  };
};