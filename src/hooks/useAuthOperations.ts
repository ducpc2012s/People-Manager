
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User, Role, Department } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface AuthOperationsResult {
  fetchUserDetails: (userId: string) => Promise<(User & { role?: Role; department?: Department }) | null>;
  refreshUserDetails: (userId: string) => Promise<(User & { role?: Role; department?: Department }) | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, isAdmin?: boolean) => Promise<{ user: SupabaseUser | null; error: Error | null }>;
}

export const useAuthOperations = (): AuthOperationsResult => {
  const { toast } = useToast();

  const fetchUserDetails = async (userId: string) => {
    try {
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
        console.error("Error fetching user details:", error);
        throw error;
      }

      if (data) {
        return {
          ...data,
          role: data.roles,
          department: data.departments
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  const refreshUserDetails = async (userId: string) => {
    return await fetchUserDetails(userId);
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in:", email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Đăng nhập thất bại",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Update last_login in the users table
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        try {
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', authData.user.id);
        } catch (updateError) {
          console.error("Error updating last login:", updateError);
          // Non-critical error, so we don't throw
        }
      }

      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại",
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, isAdmin = false) => {
    try {
      console.log("Signing up user:", email, "isAdmin:", isAdmin);
      
      // Đầu tiên, tạo người dùng trong hệ thống auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error("Sign up error:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("Auth user created:", data.user.id);
        // Get role_id based on isAdmin
        const roleId = isAdmin ? 1 : 3; // 1 is Administrator, 3 is Employee
        
        // Sau đó, tạo hồ sơ người dùng trong bảng users
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role_id: roleId,
            department_id: isAdmin ? 1 : 2, // Admin belongs to Management department
            status: 'active'
          });
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { user: null, error: profileError };
        }
        
        toast({
          title: "Đăng ký thành công",
          description: "Tài khoản của bạn đã được tạo thành công",
        });
        
        return { user: data.user, error: null };
      }
      
      return { user: null, error: new Error('User registration failed') };
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Đăng ký thất bại",
        description: error.message,
        variant: "destructive",
      });
      return { user: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      toast({
        title: "Đăng xuất thành công",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    fetchUserDetails,
    refreshUserDetails,
    signIn,
    signOut,
    signUp
  };
};
