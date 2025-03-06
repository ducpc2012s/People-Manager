
import { createContext } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { User, Role, Department } from '@/lib/supabase';

export type AuthContextType = {
  session: Session | null;
  user: SupabaseUser | null;
  userDetails: (User & { role?: Role; department?: Department }) | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserDetails: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
