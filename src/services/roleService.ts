
import { supabase, Role, Permission } from '@/lib/supabase';

export async function fetchRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('id');
    
  if (error) {
    throw error;
  }
  
  return data || [];
}

export async function fetchRole(roleId: number): Promise<Role | null> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', roleId)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  
  return data;
}

export async function createRole(roleData: Partial<Role>): Promise<Role> {
  const { data, error } = await supabase
    .from('roles')
    .insert(roleData)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return data;
}

export async function updateRole(roleId: number, roleData: Partial<Role>): Promise<Role> {
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
}

export async function deleteRole(roleId: number): Promise<void> {
  // Xóa tất cả quyền của vai trò trước
  const { error: permissionError } = await supabase
    .from('permissions')
    .delete()
    .eq('role_id', roleId);
  
  if (permissionError) {
    throw permissionError;
  }
  
  // Sau đó xóa vai trò
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', roleId);
  
  if (error) {
    throw error;
  }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('roles:role_id(*)')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Lỗi khi kiểm tra quyền admin:', error);
    return false;
  }
  
  // Kiểm tra xem data và data.roles có tồn tại và nó có phải là một đối tượng với thuộc tính name
  return data && data.roles && typeof data.roles === 'object' && data.roles.name === 'Quản trị viên';
}

export async function checkPermission(
  userId: string, 
  module: string, 
  action: 'view' | 'create' | 'edit' | 'delete'
): Promise<boolean> {
  // Đầu tiên kiểm tra xem người dùng có phải admin không
  const isAdmin = await isUserAdmin(userId);
  if (isAdmin) {
    return true; // Admin có tất cả các quyền
  }
  
  // Nếu không phải admin, kiểm tra quyền cụ thể
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('role_id')
    .eq('id', userId)
    .single();
    
  if (userError || !user) {
    return false;
  }
  
  const actionField = action === 'view' 
    ? 'can_view' 
    : action === 'create' 
      ? 'can_create' 
      : action === 'edit' 
        ? 'can_edit' 
        : 'can_delete';
  
  const { data: permission, error: permissionError } = await supabase
    .from('permissions')
    .select(actionField)
    .eq('role_id', user.role_id)
    .eq('module', module)
    .single();
    
  if (permissionError || !permission) {
    return false;
  }
  
  return permission[actionField] === true;
}

export async function fetchPermissions(roleId: number): Promise<Permission[]> {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .eq('role_id', roleId);
    
  if (error) {
    throw error;
  }
  
  return data || [];
}

export async function savePermissions(permissions: Partial<Permission>[]): Promise<void> {
  // Dùng upsert để cập nhật hoặc tạo mới quyền
  const { error } = await supabase
    .from('permissions')
    .upsert(permissions, { 
      onConflict: 'role_id,module',
      ignoreDuplicates: false
    });
    
  if (error) {
    throw error;
  }
}

export async function createAdminPermissions(): Promise<void> {
  const { data: adminRole, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'Quản trị viên')
    .single();
  
  if (roleError) {
    console.error("Lỗi khi tìm vai trò admin:", roleError);
    return;
  }
  
  const modules = [
    'dashboard',
    'employees',
    'attendance',
    'projects',
    'reports',
    'settings',
    'user_management'
  ];
  
  const permissions = modules.map(module => ({
    role_id: adminRole.id,
    module,
    can_view: true,
    can_create: true,
    can_edit: true,
    can_delete: true
  }));
  
  try {
    await savePermissions(permissions);
    console.log("Đã tạo quyền admin thành công");
  } catch (error) {
    console.error("Lỗi khi tạo quyền admin:", error);
  }
}
