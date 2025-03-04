
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthOperations();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Pass true as the fourth parameter to signUp to indicate this is an admin user
      const { user, error } = await signUp(email, password, fullName, true);
      
      if (error) {
        throw error;
      }

      if (user) {
        toast({
          title: 'Thành công',
          description: 'Tài khoản admin đã được tạo. Vui lòng đăng nhập.',
        });
        navigate('/login');
      } else {
        toast({
          title: 'Lỗi',
          description: 'Không thể tạo tài khoản admin',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo tài khoản admin',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Tạo tài khoản Admin</h1>
          <p className="text-gray-500 mt-2">Tạo tài khoản admin đầu tiên cho hệ thống</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Tạo tài khoản Admin'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/login')}>
            Quay lại đăng nhập
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSignup;
