<lov-code>
import AdminCheck from '@/components/auth/AdminCheck';
import { useState, useEffect } from "react";
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
  Loader2,
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
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/services/userService";
import { fetchRoles, fetchRoleWithPermissions, createRole, updateRole, deleteRole, setRolePermissions } from "@/services/roleService";
import { Role, Department, Permission } from "@/lib/supabase";

// Define the complete user object
type ExtendedUser = {
  id: string;
  email: string;
  full_name: string;
  role_id: number;
  department_id: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  status: 'active' | 'inactive';
  role?: Role;
  department?: Department;
};

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
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form states
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: 0,
    department_id: 0,
    status: "active" as "active" | "inactive", // Chỉ định rõ kiểu dữ liệu
  });

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });

  const [modulePermissions, setModulePermissions] = useState<
    Record<string, { can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean }>
  >({});

  // Queries
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const {
    data: roles = [],
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // Selected role with permissions - sửa đổi cách xử lý onSuccess
  const {
    data: selectedRoleData,
    isLoading: selectedRoleLoading,
    error: selectedRoleError,
  } = useQuery({
    queryKey: ["role", selectedRoleId],
    queryFn: () => fetchRoleWithPermissions(selectedRoleId!),
    enabled: !!selectedRoleId,
  });

  // Xử lý useEffect thay cho onSuccess
  useEffect(() => {
    if (selectedRoleData) {
      setNewRole({
        name: selectedRoleData.role.name,
        description: selectedRoleData.role.description || "",
      });

      // Initialize permissions
      const permissionsMap: Record<string, { can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean }> = {};
      modulesData.forEach(module => {
        const existingPermission = selectedRoleData.permissions.find(p => p.module === module.id);
        permissionsMap[module.id] = {
          can_view: existingPermission?.can_view || false,
          can_create: existingPermission?.can_create || false,
          can_edit: existingPermission?.can_edit || false,
          can_delete: existingPermission?.can_delete || false,
        };
      });
      setModulePermissions(permissionsMap);
    }
  }, [selectedRoleData]);

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: (userData: { user: Partial<ExtendedUser>; password: string }) => 
      createUser(userData.user, userData.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Thành công",
        description: "Người dùng đã được tạo",
      });
      setOpenUserDialog(false);
      resetUserForm();
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo người dùng",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (userData: { id: string; user: Partial<ExtendedUser> }) => 
      updateUser(userData.id, userData.user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Thành công",
        description: "Thông tin người dùng đã được cập nhật",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật thông tin người dùng",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Thành công",
        description: "Người dùng đã được xóa",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa người dùng",
        variant: "destructive",
      });
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: async (data: { role: Partial<Role>; permissions: Record<string, any> }) => {
      // 1. Create role
      const role = await createRole(data.role);
      
      // 2. Create permissions
      const permissionsToCreate = Object.entries(data.permissions).map(([module, perms]) => ({
        role_id: role.id,
        module,
        ...perms,
      }));
      
      await setRolePermissions(role.id, permissionsToCreate);
      return role;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({
        title: "Thành công",
        description: "Vai trò mới đã được tạo",
      });
      setOpenRoleDialog(false);
      resetRoleForm();
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo vai trò mới",
        variant: "destructive",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async (data: { roleId: number; role: Partial<Role>; permissions: Record<string, any> }) => {
      // 1. Update role
      const role = await updateRole(data.roleId, data.role);
      
      // 2. Update permissions
      const permissionsToUpdate = Object.entries(data.permissions).map(([module, perms]) => ({
        role_id: role.id,
        module,
        ...perms,
      }));
      
      await setRolePermissions(role.id, permissionsToUpdate);
      return role;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", selectedRoleId] });
      toast({
        title: "Thành công",
        description: "Vai trò đã được cập nhật",
      });
      setOpenRoleDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật vai trò",
        variant: "destructive",
      });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: number) => deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast({
        title: "Thành công",
        description: "Vai trò đã được xóa",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa vai trò",
        variant: "destructive",
      });
    },
  });

  // Reset form functions
  const resetUserForm = () => {
    setNewUser({
      full_name: "",
      email: "",
      password: "",
      role_id: 0,
      department_id: 0,
      status: "active",
    });
  };

  const resetRoleForm = () => {
    setNewRole({
      name: "",
      description: "",
    });
    
    // Reset permissions
    const permissionsMap: Record<string, { can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean }> = {};
    modulesData.forEach(module => {
      permissionsMap[module.id] = {
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false,
      };
    });
    setModulePermissions(permissionsMap);
  };

  // Handle form submissions
  const handleUserSubmit = () => {
    if (newUser.full_name && newUser.email && newUser.password && newUser.role_id && newUser.department_id) {
      createUserMutation.mutate({
        user: {
          full_name: newUser.full_name,
          email: newUser.email,
          role_id: newUser.role_id,
          department_id: newUser.department_id,
          status: newUser.status,
        },
        password: newUser.password,
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin người dùng",
        variant: "destructive",
      });
    }
  };

  const handleRoleSubmit = () => {
    if (newRole.name) {
      if (selectedRoleId) {
        // Update existing role
        updateRoleMutation.mutate({
          roleId: selectedRoleId,
          role: newRole,
          permissions: modulePermissions,
        });
      } else {
        // Create new role
        createRoleMutation.mutate({
          role: newRole,
          permissions: modulePermissions,
        });
      }
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên vai trò",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleDeleteRole = (roleId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa vai trò này? Tất cả người dùng có vai trò này sẽ mất quyền.")) {
      deleteRoleMutation.mutate(roleId);
    }
  };

  // Filter users based on selected view and search term
  const filteredUsers = users
    .filter(user => 
      viewMode === "all" 
        ? true 
        : viewMode === "active" 
          ? user.status === "active" 
          : user.status === "inactive"
    )
    .filter(user => 
      searchTerm 
        ? user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  // Initialize permissions on first load
  useEffect(() => {
    if (!selectedRoleId) {
      const permissionsMap: Record<string, { can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean }> = {};
      modulesData.forEach(module => {
        permissionsMap[module.id] = {
          can_view: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
        };
      });
      setModulePermissions(permissionsMap);
    }
  }, [openRoleDialog, selectedRoleId]);

  if (usersError || rolesError) {
    return (
      <PageLayout>
        <div className="p-4 bg-destructive/10 rounded-md">
          <h3 className="text-lg font-medium">Lỗi khi tải dữ liệu</h3>
          <p className="text-sm text-muted-foreground">
            {(usersError as Error)?.message || (rolesError as Error)?.message || "Không thể kết nối đến cơ sở dữ liệu."}
          </p>
        </div>
      </PageLayout>
    );
  }

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
                        <Input 
                          id="fullName" 
                          placeholder="Nguyễn Văn A" 
                          value={newUser.full_name}
                          onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="email@archipeople.com" 
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Phòng ban</Label>
                        <Select 
                          value={newUser.department_id ? newUser.department_id.toString() : undefined}
                          onValueChange={(value) => setNewUser({ ...newUser, department_id: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phòng ban" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ban quản lý</SelectItem>
                            <SelectItem value="2">Phòng thiết kế</SelectItem>
                            <SelectItem value="3">Phòng thi công</SelectItem>
                            <SelectItem value="4">Phòng dự án</SelectItem>
                            <SelectItem value="5">Phòng tài chính</SelectItem>
                            <SelectItem value="6">Phòng nhân sự</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select
                          value={newUser.role_id ? newUser.role_id.toString() : undefined}
                          onValueChange={(value) => setNewUser({ ...newUser, role_id: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
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
                        <Checkbox 
                          id="status" 
                          checked={newUser.status === "active"}
                          onCheckedChange={(checked) => 
                            setNewUser({ ...newUser, status: checked ? "active" : "inactive" })
                          }
                        />
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
                    <Button 
                      onClick={handleUserSubmit}
                      disabled={createUserMutation.isPending}
                    >
                      {createUserMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang tạo...
                        </>
                      ) : (
                        "Tạo người dùng"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={openRoleDialog} onOpenChange={(open) => {
                setOpenRoleDialog(open);
                if (!open) {
                  setSelectedRoleId(null);
                  resetRoleForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 mr-1" /> Thêm vai trò
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px]">
                  <DialogHeader>
                    <DialogTitle>{selectedRoleId ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}</DialogTitle>
                    <DialogDescription>
                      Thiết lập vai trò và phân quyền truy cập các tính năng hệ thống
                    </DialogDescription>
                  </DialogHeader>
                  {selectedRoleLoading && selectedRoleId ? (
                    <div className="py-8 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="roleName">Tên vai trò</Label>
                          <Input 
                            id="roleName" 
                            placeholder="Nhập tên vai trò" 
                            value={newRole.name}
                            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roleDescription">Mô tả</Label>
                          <Input 
                            id="roleDescription" 
                            placeholder="Mô tả ngắn về vai trò"
                            value={newRole.description}
                            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                          />
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
                                  <Checkbox 
                                    id={`module-${module.id}`}
                                    checked={modulePermissions[module.id]?.can_view || false}
                                    onCheckedChange={(checked) => {
                                      setModulePermissions({
                                        ...modulePermissions,
                                        [module.id]: {
                                          ...modulePermissions[module.id],
                                          can_view: !!checked,
                                          can_create: !!checked ? modulePermissions[module.id]?.can_create || false : false,
                                          can_edit: !!checked ? modulePermissions[module.id]?.can_edit || false : false,
                                          can_delete: !!checked ? modulePermissions[module.id]?.can_delete || false : false,
                                        }
                                      });
                                    }}
                                  />
                                  <Label htmlFor={`module-${module.id}`} className="font-medium">
                                    {module.name}
                                  </Label>
                                </div>
                                <div className="pl-6 space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`view-${module.id}`}
                                      checked={modulePermissions[module.id]?.can_view || false}
                                      onCheckedChange={(checked) => {
                                        setModulePermissions({
                                          ...modulePermissions,
                                          [module.id]: {
                                            ...modulePermissions[module.id],
                                            can_view: !!checked,
                                            can_create: !!checked ? modulePermissions[module.id]?.can_create || false : false,
                                            can_edit: !!checked ? modulePermissions[module.id]?.can_edit || false : false,
                                            can_delete: !!checked ? modulePermissions[module.id]?.can_delete || false : false,
                                          }
                                        });
                                      }}
                                    />
                                    <Label htmlFor={`view-${module.id}`} className="text-sm font-normal">
                                      Xem
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`create-${module.id}`}
                                      checked={modulePermissions[module.id]?.can_create || false}
                                      disabled={!modulePermissions[module.id]?.can_view}
                                      onCheckedChange={(checked) => {
                                        setModulePermissions({
                                          ...modulePermissions,
                                          [module.id]: {
                                            ...modulePermissions[module.id],
                                            can_create: !!checked,
                                          }
                                        });
                                      }}
                                    />
                                    <Label htmlFor={`create-${module.id}`} className="text-sm font-normal">
                                      Thêm mới
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`edit-${module.id}`}
                                      checked={modulePermissions[module.id]?.can_edit || false}
                                      disabled={!modulePermissions[module.id]?.can_view}
                                      onCheckedChange={(checked) => {
                                        setModulePermissions({
                                          ...modulePermissions,
                                          [module.id]: {
                                            ...modulePermissions[module.id],
                                            can_edit: !!checked,
                                          }
                                        });
                                      }}
                                    />
                                    <Label htmlFor={`edit-${module.id}`} className="text-sm font-normal">
                                      Chỉnh sửa
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`delete-${module.id}`}
                                      checked={modulePermissions[module.id]?.can_delete || false}
                                      disabled={!modulePermissions[module.id]?.can_view}
                                      onCheckedChange={(checked) => {
                                        setModulePermissions({
                                          ...modulePermissions,
                                          [module.id]: {
                                            ...modulePermissions[module.id],
                                            can_delete: !!checked,
                                          }
                                        });
                                      }}
                                    />
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
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setOpenRoleDialog(false);
                      setSelectedRoleId(null);
                      resetRoleForm();
                    }}>
                      Hủy bỏ
                    </Button>
                    <Button 
                      onClick={handleRoleSubmit}
                      disabled={createRoleMutation.isPending || updateRoleMutation.isPending}
                    >
                      {(createRoleMutation.isPending || updateRoleMutation.isPending) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        selectedRoleId ? "Cập nhật vai trò" : "Tạo vai trò"
                      )}
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                    Tất cả ({users.length})
                  </Button>
                  <Button
                    variant={viewMode === "active" ? "default" : "ghost"}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode("active")}
                  >
                    Hoạt động ({users.filter((u) => u.status === "active").length})
                  </Button>
                  <Button
                    variant={viewMode === "inactive" ? "default" : "ghost"}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode("inactive")}
                  >
                    Không hoạt động ({users.filter((u) => u.status !== "active").length})
                  </Button>
                </div>

                {usersLoading ? (
                  <div className="py-8 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Người dùng</TableHead>
                          <TableHead>Vai trò</TableHead>
                          <TableHead>Phòng ban</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Đăng nhập gần nhất</TableHead>
                          <TableHead className="w-[70px] text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                              Không tìm thấy người dùng nào
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar_url || ""} />
                                    <AvatarFallback>
                                      {user.full_name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{user.full_name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {user.email}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    user.role?.name === "Quản trị viên"
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className={
                                    user.role?.name === "Quản trị viên"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300"
                                      : ""
                                  }
                                >
                                  {user.role?.name || "Không có"}
                                </Badge>
                              </TableCell>
                              <TableCell>{user.department?.name || "Không có"}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    user.status === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={
                               
