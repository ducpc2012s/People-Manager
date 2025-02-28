
import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Filter,
  Lock,
  MoreHorizontal,
  PenLine,
  PlusCircle,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  User,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

// Mock data for users
const usersData = [
  {
    id: 1,
    name: "Nguyễn Văn Admin",
    email: "admin@archipeople.com",
    role: "Quản trị viên",
    department: "Ban quản lý",
    status: "Hoạt động",
    lastLogin: "10 phút trước",
  },
  {
    id: 2,
    name: "Trần Thị Manager",
    email: "manager@archipeople.com",
    role: "Quản lý",
    department: "Phòng dự án",
    status: "Hoạt động",
    lastLogin: "1 giờ trước",
  },
  {
    id: 3,
    name: "Lê Văn HR",
    email: "hr@archipeople.com",
    role: "Nhân sự",
    department: "Phòng nhân sự",
    status: "Hoạt động",
    lastLogin: "2 giờ trước",
  },
  {
    id: 4,
    name: "Phạm Thị Accountant",
    email: "accountant@archipeople.com",
    role: "Kế toán",
    department: "Phòng tài chính",
    status: "Không hoạt động",
    lastLogin: "3 ngày trước",
  },
  {
    id: 5,
    name: "Hoàng Văn Employee",
    email: "employee@archipeople.com",
    role: "Nhân viên",
    department: "Phòng thiết kế",
    status: "Hoạt động",
    lastLogin: "30 phút trước",
  },
];

// Mock data for roles and permissions
const rolesData = [
  {
    id: 1,
    name: "Quản trị viên",
    description: "Quyền truy cập toàn bộ hệ thống",
    userCount: 1,
    createdAt: "01/01/2023",
  },
  {
    id: 2,
    name: "Quản lý",
    description: "Quản lý dự án, nhân viên và báo cáo",
    userCount: 3,
    createdAt: "01/01/2023",
  },
  {
    id: 3,
    name: "Nhân sự",
    description: "Quản lý thông tin nhân viên, chấm công",
    userCount: 2,
    createdAt: "01/01/2023",
  },
  {
    id: 4,
    name: "Kế toán",
    description: "Quản lý lương, chi phí dự án",
    userCount: 2,
    createdAt: "01/01/2023",
  },
  {
    id: 5,
    name: "Nhân viên",
    description: "Xem thông tin công việc cá nhân",
    userCount: 35,
    createdAt: "01/01/2023",
  },
];

// Mock data for modules/features
const modulesData = [
  { id: "dashboard", name: "Trang chủ" },
  { id: "employees", name: "Quản lý nhân viên" },
  { id: "attendance", name: "Chấm công" },
  { id: "leave", name: "Quản lý nghỉ phép" },
  { id: "payroll", name: "Quản lý lương" },
  { id: "recruitment", name: "Tuyển dụng" },
  { id: "projects", name: "Quản lý dự án" },
  { id: "constructions", name: "Quản lý công trình" },
  { id: "portfolio", name: "Hồ sơ năng lực" },
  { id: "reports", name: "Báo cáo" },
  { id: "settings", name: "Cài đặt" },
  { id: "users", name: "Quản lý người dùng" },
];

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("all");

  // Filter users based on selected view
  const filteredUsers =
    viewMode === "all"
      ? usersData
      : viewMode === "active"
      ? usersData.filter((user) => user.status === "Hoạt động")
      : usersData.filter((user) => user.status !== "Hoạt động");

  return (
    <PageLayout>
      <PageHeader
        title="Quản lý người dùng và phân quyền"
        subtitle="Thiết lập người dùng, vai trò và phân quyền trong hệ thống"
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "users" ? (
              <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4 mr-1" /> Thêm người dùng
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Thêm người dùng mới</DialogTitle>
                    <DialogDescription>
                      Tạo tài khoản người dùng mới và phân quyền truy cập hệ thống
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input id="fullName" placeholder="Nguyễn Văn A" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="email@archipeople.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Tên đăng nhập</Label>
                        <Input id="username" placeholder="username" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input id="password" type="password" placeholder="••••••••" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Phòng ban</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phòng ban" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="management">Ban quản lý</SelectItem>
                            <SelectItem value="design">Phòng thiết kế</SelectItem>
                            <SelectItem value="construction">Phòng thi công</SelectItem>
                            <SelectItem value="project">Phòng dự án</SelectItem>
                            <SelectItem value="finance">Phòng tài chính</SelectItem>
                            <SelectItem value="hr">Phòng nhân sự</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            {rolesData.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Trạng thái tài khoản</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="status" defaultChecked />
                        <Label htmlFor="status" className="text-sm font-normal">
                          Kích hoạt tài khoản này
                        </Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenUserDialog(false)}>
                      Hủy bỏ
                    </Button>
                    <Button onClick={() => setOpenUserDialog(false)}>
                      Tạo người dùng
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={openRoleDialog} onOpenChange={setOpenRoleDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 mr-1" /> Thêm vai trò
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px]">
                  <DialogHeader>
                    <DialogTitle>Thêm vai trò mới</DialogTitle>
                    <DialogDescription>
                      Thiết lập vai trò và phân quyền truy cập các tính năng hệ thống
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="roleName">Tên vai trò</Label>
                        <Input id="roleName" placeholder="Nhập tên vai trò" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roleDescription">Mô tả</Label>
                        <Input id="roleDescription" placeholder="Mô tả ngắn về vai trò" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Thiết lập quyền truy cập</Label>
                      <div className="border rounded-md p-4 space-y-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Chọn các module và quyền truy cập tương ứng
                        </p>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                          {modulesData.map((module) => (
                            <div key={module.id} className="space-y-2 border rounded-md p-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox id={`module-${module.id}`} />
                                <Label htmlFor={`module-${module.id}`} className="font-medium">
                                  {module.name}
                                </Label>
                              </div>
                              <div className="pl-6 space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`view-${module.id}`} />
                                  <Label htmlFor={`view-${module.id}`} className="text-sm font-normal">
                                    Xem
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`create-${module.id}`} />
                                  <Label htmlFor={`create-${module.id}`} className="text-sm font-normal">
                                    Thêm mới
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`edit-${module.id}`} />
                                  <Label htmlFor={`edit-${module.id}`} className="text-sm font-normal">
                                    Chỉnh sửa
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox id={`delete-${module.id}`} />
                                  <Label htmlFor={`delete-${module.id}`} className="text-sm font-normal">
                                    Xóa
                                  </Label>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenRoleDialog(false)}>
                      Hủy bỏ
                    </Button>
                    <Button onClick={() => setOpenRoleDialog(false)}>
                      Tạo vai trò
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      <Card className="shadow-sm animate-slide-in">
        <CardHeader className="p-4">
          <Tabs
            defaultValue="users"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="h-4 w-4 mr-1" />
                Quản lý người dùng
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-1">
                <Shield className="h-4 w-4 mr-1" />
                Vai trò & Phân quyền
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Danh sách người dùng</CardTitle>
                  <CardDescription>
                    Quản lý tất cả tài khoản người dùng trong hệ thống
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Tìm kiếm người dùng..."
                      className="h-9 w-60 pl-8"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-3.5 w-3.5 mr-1" /> Lọc
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <div className="bg-muted p-2 rounded-md flex space-x-2 w-fit mb-4">
                  <Button
                    variant={viewMode === "all" ? "default" : "ghost"}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode("all")}
                  >
                    Tất cả ({usersData.length})
                  </Button>
                  <Button
                    variant={viewMode === "active" ? "default" : "ghost"}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode("active")}
                  >
                    Hoạt động ({usersData.filter((u) => u.status === "Hoạt động").length})
                  </Button>
                  <Button
                    variant={viewMode === "inactive" ? "default" : "ghost"}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode("inactive")}
                  >
                    Không hoạt động ({usersData.filter((u) => u.status !== "Hoạt động").length})
                  </Button>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Vai trò</TableHead>
                        <TableHead>Phòng ban</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Đăng nhập gần nhất</TableHead>
                        <TableHead className="w-[70px] text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "Quản trị viên"
                                  ? "outline"
                                  : "secondary"
                              }
                              className={
                                user.role === "Quản trị viên"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300"
                                  : ""
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "Hoạt động"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                user.status === "Hoạt động"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                                  : "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <User className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <PenLine className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Đổi mật khẩu
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa tài khoản
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="roles" className="mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Vai trò và phân quyền</CardTitle>
                  <CardDescription>
                    Thiết lập vai trò và phân quyền truy cập hệ thống
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Tìm kiếm vai trò..."
                      className="h-9 w-60 pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rolesData.map((role) => (
                  <Card key={role.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 pb-3 bg-muted/50">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{role.name}</CardTitle>
                          <CardDescription>{role.description}</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedRole(role.name);
                              setOpenRoleDialog(true);
                            }}>
                              <PenLine className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              Quản lý người dùng
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa vai trò
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-3">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Người dùng:</span>
                          <span className="font-medium">{role.userCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Ngày tạo:</span>
                          <span>{role.createdAt}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => {
                          setSelectedRole(role.name);
                          setOpenRoleDialog(true);
                        }}>
                          <Shield className="h-3.5 w-3.5 mr-1" /> Xem phân quyền
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </PageLayout>
  );
};

export default UserManagement;
