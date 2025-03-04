
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { isUserAdmin, checkPermission } from '@/services/roleService';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const adminStatus = await isUserAdmin(user.id);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Lỗi khi kiểm tra quyền admin:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const checkUserPermission = async (module: string, action: 'view' | 'create' | 'edit' | 'delete') => {
    if (!user) return false;
    if (isAdmin) return true; // Admin có tất cả các quyền
    
    return await checkPermission(user.id, module, action);
  };

  return { 
    isAdmin, 
    isLoading,
    checkPermission: checkUserPermission
  };
}
