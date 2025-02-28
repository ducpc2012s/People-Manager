
import { supabase, User, Role, Department, Permission } from '@/lib/supabase';

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
  // Đầu tiên tạo auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email!,
    password: password,
    email_confirm: true,
  });

  if (authError) {
    throw authError;
  }

  if (!authData.user) {
    throw new Error('Failed to create user');
  }

  // Sau đó tạo user profile
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
    // Rollback - xóa auth user nếu không tạo được profile
    await supabase.auth.admin.deleteUser(authData.user.id);
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
  // Xóa auth user
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (authError) {
    throw authError;
  }

  // Xóa user profile
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    throw error;
  }
};
