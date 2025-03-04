
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  ClipboardCheck,
  Calendar,
  DollarSign,
  Building,
  BarChart3,
  Settings,
  LogOut,
  Briefcase,
  FileText,
  UserCog,
  LayoutDashboard,
} from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { toast } from "sonner";

export function MainSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { userDetails, signOut } = useAuth();

  // Chỉ hiển thị những trang đã được triển khai
  const menuItems = [
    { icon: LayoutDashboard, label: "Tổng quan", path: "/dashboard", implemented: true },
    { icon: Users, label: "Nhân viên", path: "/employees", implemented: true },
    { icon: ClipboardCheck, label: "Chấm công", path: "/attendance", implemented: true },
    { icon: Briefcase, label: "Dự án", path: "/projects", implemented: true },
    { icon: UserCog, label: "Người dùng", path: "/user-management", implemented: true },
    { icon: Settings, label: "Cài đặt", path: "/settings", implemented: false },
  ];

  // Lọc ra những menu đã được triển khai
  const availableMenuItems = menuItems.filter(item => item.implemented);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      toast.error("Đăng xuất thất bại, vui lòng thử lại");
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sidebar className={`border-r shadow-sm transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      <SidebarHeader className="border-b py-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            {!collapsed && (
              <span className="font-semibold text-lg">ArchiPeople</span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className="h-8 w-8 p-0"
          >
            {collapsed ? "→" : "←"}
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <SidebarMenu>
          {availableMenuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 py-2 px-4 ${
                    location.pathname === item.path
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-accent/50"
                  } rounded-md transition-colors`}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t py-4">
        <div className="px-4 space-y-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userDetails?.avatar_url || ""} />
                <AvatarFallback>
                  {userDetails?.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate max-w-[140px]">{userDetails?.full_name || "Người dùng"}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                  {userDetails?.email || ""}
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={handleSignOut}
              title="Đăng xuất"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
