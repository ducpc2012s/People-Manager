
import { supabase, Employee, User } from '@/lib/supabase';

export const fetchEmployees = async (): Promise<(Employee & { user?: User })[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      users:user_id(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(employee => ({
    ...employee,
    user: employee.users
  })) || [];
};

export const fetchEmployee = async (employeeId: number): Promise<(Employee & { user?: User }) | null> => {
  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      users:user_id(*)
    `)
    .eq('id', employeeId)
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    user: data.users
  };
};

export const createEmployee = async (employeeData: Partial<Employee>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert(employeeData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateEmployee = async (employeeId: number, employeeData: Partial<Employee>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .update(employeeData)
    .eq('id', employeeId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteEmployee = async (employeeId: number): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', employeeId);

  if (error) {
    throw error;
  }
};
