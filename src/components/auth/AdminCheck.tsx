
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

interface AdminCheckProps {
  children: ReactNode;
  redirectTo?: string;
}

const AdminCheck = ({ children, redirectTo = '/dashboard' }: AdminCheckProps) => {
  const { isAdmin, isLoading } = useAdmin();
  const { user, loading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading && !isLoading) {
      setChecked(true);
    }
  }, [loading, isLoading]);

  if (loading || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (checked && !isAdmin) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

export default AdminCheck;
