
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

export const fetchRoleByName = async (roleName: string): Promise<Role | null> => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('name', roleName)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('users')
    .select('roles:role_id(*)')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return data?.roles?.name === 'Quản trị viên';
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

export const createAdminPermissions = async (): Promise<void> => {
  // Tìm role admin
  const adminRole = await fetchRoleByName('Quản trị viên');
  
  if (!adminRole) {
    console.error('Không tìm thấy vai trò Quản trị viên');
    return;
  }
  
  // Danh sách các module trong hệ thống
  const modules = [
    'dashboard', 'employees', 'attendance', 'leave', 'payroll', 'recruitment', 
    'projects', 'constructions', 'portfolio', 'reports', 'settings', 'users'
  ];
  
  // Tạo permissions với đầy đủ quyền cho tất cả modules
  const adminPermissions = modules.map(module => ({
    role_id: adminRole.id,
    module,
    can_view: true,
    can_create: true,
    can_edit: true,
    can_delete: true
  }));
  
  // Cập nhật permissions cho admin
  try {
    await setRolePermissions(adminRole.id, adminPermissions);
    console.log('Đã cập nhật quyền cho admin thành công');
  } catch (error) {
    console.error('Lỗi khi cập nhật quyền cho admin:', error);
  }
};

// Hàm kiểm tra quyền truy cập của người dùng đối với một module cụ thể
export const checkPermission = async (
  userId: string, 
  module: string, 
  action: 'view' | 'create' | 'edit' | 'delete'
): Promise<boolean> => {
  try {
    // Lấy thông tin user kèm role
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role_id')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      console.error('Lỗi khi lấy thông tin người dùng:', userError);
      return false;
    }
    
    // Lấy permission tương ứng
    const { data: permission, error: permissionError } = await supabase
      .from('permissions')
      .select('*')
      .eq('role_id', user.role_id)
      .eq('module', module)
      .maybeSingle();
    
    if (permissionError) {
      console.error('Lỗi khi kiểm tra quyền:', permissionError);
      return false;
    }
    
    // Kiểm tra quyền thực hiện hành động
    if (!permission) return false;
    
    switch (action) {
      case 'view': return permission.can_view;
      case 'create': return permission.can_create;
      case 'edit': return permission.can_edit;
      case 'delete': return permission.can_delete;
      default: return false;
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra quyền:', error);
    return false;
  }
};
