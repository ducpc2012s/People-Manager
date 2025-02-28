
import { createClient } from '@supabase/supabase-js'

// Kiểm tra biến môi trường hoặc sử dụng giá trị mặc định để tránh lỗi
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Tạo client Supabase với thông báo lỗi rõ ràng nếu thiếu thông tin
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error("Thiếu thông tin kết nối Supabase. Vui lòng cung cấp VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong file .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Định nghĩa các kiểu dữ liệu từ Database
export type User = {
  id: string;
  email: string;
  full_name: string;
  role_id: number;
  department_id: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  status: 'active' | 'inactive';
}

export type Role = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type Department = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type Permission = {
  id: number;
  role_id: number;
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  created_at: string;
  updated_at: string;
}

export type Employee = {
  id: number;
  user_id: string;
  employee_code: string;
  phone_number?: string;
  address?: string;
  position: string;
  join_date: string;
  salary?: number;
  created_at: string;
  updated_at: string;
}

export type Attendance = {
  id: number;
  employee_id: number;
  date: string;
  check_in: string;
  check_out?: string;
  status: 'present' | 'late' | 'early_leave' | 'absent';
  work_hours?: number;
  note?: string;
  created_at: string;
  updated_at: string;
}

export type Project = {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  budget?: number;
  client?: string;
  created_at: string;
  updated_at: string;
}

export type ProjectMember = {
  id: number;
  project_id: number;
  employee_id: number;
  role: string;
  created_at: string;
  updated_at: string;
}
