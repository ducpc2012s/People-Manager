
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User, Role, Department } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: SupabaseUser | null;
  userDetails: (User & { role?: Role; department?: Department }) | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserDetails: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ user: SupabaseUser | null; error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userDetails, setUserDetails] = useState<(User & { role?: Role; department?: Department }) | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
        await fetchUserDetails(session.user.id);
      }
      
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserDetails(session.user.id);
        } else {
          setUserDetails(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      // Fetch user details and join with role and department
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

      if (data) {
        setUserDetails({
          ...data,
          role: data.roles,
          department: data.departments
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const refreshUserDetails = async () => {
    if (user) {
      await fetchUserDetails(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Đăng nhập thất bại",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại",
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      
      // Đăng ký tài khoản với Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Tạo thông tin người dùng trong bảng users
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role_id: 3, // Mặc định là nhân viên
            department_id: 2, // Mặc định là phòng thiết kế
            status: 'active'
          });
          
        if (profileError) {
          // Nếu có lỗi khi tạo profile, xóa tài khoản auth đã tạo
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
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUserDetails(null);
      toast({
        title: "Đăng xuất thành công",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userDetails, 
      loading, 
      signIn, 
      signOut, 
      refreshUserDetails,
      signUp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
