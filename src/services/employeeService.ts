
import { supabase, Employee } from '@/lib/supabase';

export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      user:user_id (
        id, 
        email, 
        full_name, 
        role_id, 
        department_id,
        avatar_url,
        department:department_id (
          id, 
          name
        )
      )
    `)
    .order('join_date', { ascending: false });

  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }

  return data || [];
};

export const fetchEmployee = async (id: number): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      user:user_id (
        id, 
        email, 
        full_name, 
        role_id, 
        department_id,
        avatar_url,
        department:department_id (
          id, 
          name
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }

  return data;
};

export const createEmployee = async (
  employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>
): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert([employeeData])
    .select()
    .single();

  if (error) {
    console.error('Error creating employee:', error);
    throw error;
  }

  return data;
};

export const updateEmployee = async (
  id: number,
  employeeData: Partial<Employee>
): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .update(employeeData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating employee:', error);
    throw error;
  }

  return data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

export const searchEmployees = async (query: string): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      user:user_id (
        id, 
        email, 
        full_name, 
        role_id, 
        department_id,
        avatar_url,
        department:department_id (
          id, 
          name
        )
      )
    `)
    .or(`
      employee_code.ilike.%${query}%,
      phone_number.ilike.%${query}%,
      position.ilike.%${query}%,
      user.full_name.ilike.%${query}%,
      user.email.ilike.%${query}%
    `)
    .order('join_date', { ascending: false });

  if (error) {
    console.error('Error searching employees:', error);
    throw error;
  }

  return data || [];
};

export const fetchEmployeesByDepartment = async (departmentId: number): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      user:user_id (
        id, 
        email, 
        full_name, 
        role_id, 
        department_id, 
        avatar_url
      )
    `)
    .eq('user.department_id', departmentId)
    .order('join_date', { ascending: false });

  if (error) {
    console.error('Error fetching employees by department:', error);
    throw error;
  }

  return data || [];
};
