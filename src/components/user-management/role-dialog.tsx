
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoleWithPermissions, createRole, updateRole, setRolePermissions } from "@/services/roleService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/lib/supabase";
import { ModulePermissionsGrid } from "./module-permissions-grid";

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRoleId: number | null;
  setSelectedRoleId: (id: number | null) => void;
}

export function RoleDialog({ open, onOpenChange, selectedRoleId, setSelectedRoleId }: RoleDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form states
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });

  const [modulePermissions, setModulePermissions] = useState<
    Record<string, { can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean }>
  >({});

  // Selected role with permissions
  const {
    data: selectedRoleData,
    isLoading: selectedRoleLoading,
  } = useQuery({
    queryKey: ["role", selectedRoleId],
    queryFn: () => fetchRoleWithPermissions(selectedRoleId!),
    enabled: !!selectedRoleId,
  });

  // Initialize permissions on first load or when selectedRoleId changes
  useEffect(() => {
    if (selectedRoleData) {
      setNewRole({
        name: selectedRoleData.role.name,
        description: selectedRoleData.role.description || "",
      });

      // Initialize permissions from the fetched data
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
    } else if (!selectedRoleId && open) {
      // Reset form for new role
      resetRoleForm();
    }
  }, [selectedRoleData, selectedRoleId, open]);

  // Mutations
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
      onOpenChange(false);
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
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật vai trò",
        variant: "destructive",
      });
    },
  });

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

  const handleSubmit = () => {
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

  const handleCloseDialog = () => {
    onOpenChange(false);
    setSelectedRoleId(null);
    resetRoleForm();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
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
            
            <ModulePermissionsGrid 
              modulePermissions={modulePermissions}
              setModulePermissions={setModulePermissions}
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog}>
            Hủy bỏ
          </Button>
          <Button 
            onClick={handleSubmit}
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
  );
}

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
