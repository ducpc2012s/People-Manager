
import { supabase, User, Role, Department } from '@/lib/supabase';

export const fetchUsers = async (): Promise<(User & { role?: Role, department?: Department })[]> => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      roles:role_id(id, name, description),
      departments:department_id(id, name, description)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const fetchUser = async (userId: string): Promise<(User & { role?: Role, department?: Department }) | null> => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      roles:role_id(id, name, description),
      departments:department_id(id, name, description)
    `)
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const createUser = async (userData: Partial<User>, password: string): Promise<User> => {
  // First, create the auth user using signUp instead of admin.createUser
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email!,
    password: password,
    options: {
      data: {
        full_name: userData.full_name,
      },
    }
  });

  if (authError) {
    throw authError;
  }

  if (!authData.user) {
    throw new Error('Failed to create user');
  }

  // Then create user profile
  const { data, error } = await supabase
    .from('users')
    .insert({
      ...userData,
      id: authData.user.id,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    // We cannot delete the auth user since we don't have admin rights
    // Just throw the error for now
    throw error;
  }

  return data;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  // We can't delete auth users without admin rights
  // Just delete the user profile for now
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    throw error;
  }
};
