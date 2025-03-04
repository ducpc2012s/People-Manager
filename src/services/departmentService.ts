
import { supabase, Department } from '@/lib/supabase';

export const fetchDepartments = async (): Promise<Department[]> => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }

  return data || [];
};

export const fetchDepartment = async (id: number): Promise<Department | null> => {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching department:', error);
    throw error;
  }

  return data;
};

export const createDepartment = async (departmentData: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> => {
  const { data, error } = await supabase
    .from('departments')
    .insert([departmentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating department:', error);
    throw error;
  }

  return data;
};

export const updateDepartment = async (id: number, departmentData: Partial<Department>): Promise<Department> => {
  const { data, error } = await supabase
    .from('departments')
    .update(departmentData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating department:', error);
    throw error;
  }

  return data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};
