
import { supabase, Role, Permission } from '@/lib/supabase';

export const fetchRoles = async (): Promise<Role[]> => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('id');

  if (error) {
    throw error;
  }

  return data || [];
};

export const fetchRoleWithPermissions = async (roleId: number): Promise<{ role: Role, permissions: Permission[] }> => {
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('*')
    .eq('id', roleId)
    .single();

  if (roleError) {
    throw roleError;
  }

  const { data: permissions, error: permissionsError } = await supabase
    .from('permissions')
    .select('*')
    .eq('role_id', roleId);

  if (permissionsError) {
    throw permissionsError;
  }

  return { role, permissions: permissions || [] };
};

export const createRole = async (roleData: Partial<Role>): Promise<Role> => {
  const { data, error } = await supabase
    .from('roles')
    .insert(roleData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateRole = async (roleId: number, roleData: Partial<Role>): Promise<Role> => {
  const { data, error } = await supabase
    .from('roles')
    .update(roleData)
    .eq('id', roleId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteRole = async (roleId: number): Promise<void> => {
  // Xóa permissions trước
  const { error: permissionsError } = await supabase
    .from('permissions')
    .delete()
    .eq('role_id', roleId);

  if (permissionsError) {
    throw permissionsError;
  }

  // Sau đó xóa role
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', roleId);

  if (error) {
    throw error;
  }
};

export const setRolePermissions = async (roleId: number, permissions: Partial<Permission>[]): Promise<Permission[]> => {
  // Xóa permissions hiện tại
  const { error: deleteError } = await supabase
    .from('permissions')
    .delete()
    .eq('role_id', roleId);

  if (deleteError) {
    throw deleteError;
  }

  // Thêm permissions mới
  const permissionsWithRoleId = permissions.map(p => ({ ...p, role_id: roleId }));
  
  const { data, error } = await supabase
    .from('permissions')
    .insert(permissionsWithRoleId)
    .select();

  if (error) {
    throw error;
  }

  return data || [];
};
