
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
    console.error("Error fetching users:", error);
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
    console.error("Error fetching user:", error);
    throw error;
  }

  return data;
};

export const createUser = async (userData: Partial<User>, password: string): Promise<User> => {
  console.log("Creating user with data:", userData);
  
  // First, create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email!,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: userData.full_name,
    }
  });

  if (authError) {
    console.error("Error creating auth user:", authError);
    
    // Fallback to regular signUp if admin API is not available
    const { data: fallbackData, error: fallbackError } = await supabase.auth.signUp({
      email: userData.email!,
      password: password,
      options: {
        data: {
          full_name: userData.full_name,
        }
      }
    });
    
    if (fallbackError) {
      console.error("Error in fallback auth signup:", fallbackError);
      throw fallbackError;
    }
    
    if (!fallbackData.user) {
      console.error("No user returned from fallback auth signup");
      throw new Error('Không thể tạo người dùng trong hệ thống xác thực');
    }
    
    authData.user = fallbackData.user;
  }

  if (!authData.user) {
    console.error("No user returned from auth signup");
    throw new Error('Không thể tạo người dùng trong hệ thống xác thực');
  }

  console.log("Auth user created:", authData.user.id);

  // Then create user profile in the users table
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
        role_id: userData.role_id,
        department_id: userData.department_id,
        status: userData.status || 'active',
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }

    console.log("User profile created:", data);
    return data;
  } catch (error) {
    console.error("Exception creating user profile:", error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    throw error;
  }

  return data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  // First, we try to delete the auth user if we have admin rights
  try {
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.error("Error deleting auth user (admin method):", authError);
      // Continue to delete the user profile even if auth deletion fails
    }
  } catch (error) {
    console.error("Cannot delete auth user (admin method):", error);
    // Continue to delete the user profile even if auth deletion fails
  }

  // Delete the user profile
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
};
