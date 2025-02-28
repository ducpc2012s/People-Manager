
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
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
  UserPlus,
  LogOut,
  Briefcase,
  FileText,
  Lock,
} from "lucide-react";
import { ModeToggle } from "../mode-toggle";

export function MainSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: Users, label: "Nhân viên", path: "/employees" },
    { icon: ClipboardCheck, label: "Chấm công", path: "/attendance" },
    { icon: Calendar, label: "Ngày nghỉ", path: "/leave" },
    { icon: DollarSign, label: "Lương", path: "/payroll" },
    { icon: UserPlus, label: "Tuyển dụng", path: "/recruitment" },
    { icon: Briefcase, label: "Dự án", path: "/projects" },
    { icon: Building, label: "Công trình", path: "/constructions" },
    { icon: FileText, label: "Hồ sơ năng lực", path: "/portfolio" },
    { icon: BarChart3, label: "Báo cáo", path: "/reports" },
    { icon: Settings, label: "Cài đặt", path: "/settings" },
  ];

  return (
    <Sidebar
      className="border-r shadow-sm"
      data-state={collapsed ? "collapsed" : "expanded"}
      onCollapsedChange={setCollapsed}
    >
      <SidebarHeader className="border-b py-4">
        <div className="flex items-center gap-2 px-4">
          <Building className="h-6 w-6 text-primary" />
          {!collapsed && (
            <span className="font-semibold text-lg">ArchiPeople</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 py-2 ${
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
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin</span>
                <span className="text-xs text-muted-foreground">
                  admin@archipeople.com
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <ModeToggle />
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
