
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegister) {
        // Sử dụng hàm signUp từ AuthContext
        const { user, error } = await signUp(email, password, fullName);
        
        if (error) {
          throw error;
        }

        if (user) {
          toast({
            title: "Đăng ký thành công",
            description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
          });
          setIsRegister(false);
        }
      } else {
        // Đăng nhập
        await signIn(email, password);
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Lỗi:", error);
      toast({
        title: isRegister ? "Đăng ký thất bại" : "Đăng nhập thất bại",
        description: error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Building className="h-10 w-10 text-primary" />
            <span className="font-bold text-3xl">ArchiPeople</span>
          </div>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isRegister ? "Đăng ký tài khoản" : "Đăng nhập"}
            </CardTitle>
            <CardDescription>
              {isRegister 
                ? "Điền thông tin để tạo tài khoản mới" 
                : "Nhập thông tin đăng nhập của bạn để truy cập hệ thống"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="Nguyễn Văn A" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isRegister}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@archipeople.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  {!isRegister && (
                    <Button type="button" variant="link" className="px-0 font-normal h-auto">
                      Quên mật khẩu?
                    </Button>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="********" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRegister ? "Đang đăng ký..." : "Đang đăng nhập..."}
                  </>
                ) : (
                  isRegister ? "Đăng ký" : "Đăng nhập"
                )}
              </Button>
              <Button 
                type="button" 
                variant="link" 
                className="w-full" 
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister 
                  ? "Đã có tài khoản? Đăng nhập" 
                  : "Chưa có tài khoản? Đăng ký"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
