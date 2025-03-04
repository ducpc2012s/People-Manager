
import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const { userDetails, refreshUserDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(userDetails?.full_name || "");
  const [email, setEmail] = useState(userDetails?.email || "");
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    app: false,
  });

  const handleProfileUpdate = async () => {
    if (!userDetails?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', userDetails.id);
      
      if (error) throw error;
      
      toast.success("Cập nhật thông tin thành công");
      refreshUserDetails(userDetails.id);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast.error("Cập nhật thông tin thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userDetails?.email || "", {
        redirectTo: `${window.location.origin}/settings`,
      });
      
      if (error) throw error;
      
      toast.success("Email đổi mật khẩu đã được gửi");
    } catch (error) {
      console.error('Lỗi khi gửi email đổi mật khẩu:', error);
      toast.error("Gửi email đổi mật khẩu thất bại");
    }
  };

  return (
    <PageLayout>
      <PageHeader
        title="Cài đặt"
        subtitle="Quản lý cài đặt tài khoản và ứng dụng"
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Tài khoản</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="appearance">Giao diện</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={email} 
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email không thể thay đổi
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleProfileUpdate} 
                disabled={loading || fullName === userDetails?.full_name}
              >
                {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
              <CardDescription>
                Cấu hình thông báo cho tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Thông báo qua email</Label>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo qua email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notifications.email} 
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="browser-notifications">Thông báo trên trình duyệt</Label>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị thông báo trên trình duyệt
                    </p>
                  </div>
                  <Switch 
                    id="browser-notifications" 
                    checked={notifications.browser}
                    onCheckedChange={(checked) => setNotifications({...notifications, browser: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-notifications">Thông báo trong ứng dụng</Label>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị thông báo trong ứng dụng
                    </p>
                  </div>
                  <Switch 
                    id="app-notifications" 
                    checked={notifications.app}
                    onCheckedChange={(checked) => setNotifications({...notifications, app: checked})}
                  />
                </div>
              </div>
              <Button>Lưu cài đặt thông báo</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Giao diện</CardTitle>
              <CardDescription>
                Tùy chỉnh giao diện ứng dụng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chế độ giao diện</Label>
                <div className="flex space-x-2">
                  <Button variant="outline">Sáng</Button>
                  <Button variant="outline">Tối</Button>
                  <Button variant="outline">Hệ thống</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kích thước font chữ</Label>
                <div className="flex space-x-2">
                  <Button variant="outline">Nhỏ</Button>
                  <Button variant="outline">Vừa</Button>
                  <Button variant="outline">Lớn</Button>
                </div>
              </div>
              <Button>Lưu cài đặt giao diện</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>
                Quản lý mật khẩu và bảo mật tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mật khẩu</Label>
                <div className="flex space-x-2">
                  <Button onClick={handleChangePassword}>Đổi mật khẩu</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Xác thực hai bước</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" disabled>Bật xác thực hai bước</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tính năng đang được phát triển
                </p>
              </div>
              <div className="space-y-2">
                <Label>Phiên đăng nhập</Label>
                <div className="flex space-x-2">
                  <Button variant="outline">Đăng xuất khỏi tất cả thiết bị</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Settings;
