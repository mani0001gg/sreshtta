import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          role: 'student' | 'staff' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          role: 'student' | 'staff' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          role?: 'student' | 'staff' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          student_id: string;
          enrolled_courses: string[];
          pending_fees: number;
          total_fees: number;
          group_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          student_id: string;
          enrolled_courses?: string[];
          pending_fees?: number;
          total_fees?: number;
          group_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          student_id?: string;
          enrolled_courses?: string[];
          pending_fees?: number;
          total_fees?: number;
          group_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          user_id: string;
          staff_id: string;
          assigned_courses: string[];
          department: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          staff_id: string;
          assigned_courses?: string[];
          department: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          staff_id?: string;
          assigned_courses?: string[];
          department?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          name: string;
          description: string;
          tutor_id: string;
          tutor_name: string;
          duration: string;
          fees: number;
          schedule: string;
          capacity: number;
          enrolled: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          tutor_id: string;
          tutor_name: string;
          duration: string;
          fees: number;
          schedule: string;
          capacity: number;
          enrolled?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          tutor_id?: string;
          tutor_name?: string;
          duration?: string;
          fees?: number;
          schedule?: string;
          capacity?: number;
          enrolled?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          date?: string;
          status?: 'present' | 'absent' | 'late';
          created_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          program_name: string;
          batch_time: string;
          fees: number;
          students: string[];
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          program_name: string;
          batch_time: string;
          fees: number;
          students?: string[];
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          program_name?: string;
          batch_time?: string;
          fees?: number;
          students?: string[];
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      fee_payments: {
        Row: {
          id: string;
          student_id: string;
          amount: number;
          date: string;
          method: 'cash' | 'card' | 'online' | 'upi';
          status: 'paid' | 'pending' | 'overdue';
          transaction_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          amount: number;
          date: string;
          method: 'cash' | 'card' | 'online' | 'upi';
          status?: 'paid' | 'pending' | 'overdue';
          transaction_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          amount?: number;
          date?: string;
          method?: 'cash' | 'card' | 'online' | 'upi';
          status?: 'paid' | 'pending' | 'overdue';
          transaction_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}