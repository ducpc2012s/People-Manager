
import { useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, User, Role, Department } from '@/lib/supabase';
import AuthContext, { AuthContextType } from '@/context/AuthContext';
import { useAuthOperations } from '@/hooks/useAuthOperations';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userDetails, setUserDetails] = useState<(User & { role?: Role; department?: Department }) | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { 
    fetchUserDetails,
    refreshUserDetails: refreshUserDetailsOp,
    signIn: signInOp,
    signOut: signOutOp,
  } = useAuthOperations();

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
        const details = await fetchUserDetails(session.user.id);
        setUserDetails(details);
      }
      
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const details = await fetchUserDetails(session.user.id);
          setUserDetails(details);
        } else {
          setUserDetails(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUserDetails = async () => {
    if (user) {
      const details = await refreshUserDetailsOp(user.id);
      setUserDetails(details);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInOp(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await signOutOp();
      setUserDetails(null);
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
