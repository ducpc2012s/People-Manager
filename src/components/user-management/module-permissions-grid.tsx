
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ModulePermission {
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

interface ModulePermissionsGridProps {
  modulePermissions: Record<string, ModulePermission>;
  setModulePermissions: (permissions: Record<string, ModulePermission>) => void;
}

interface ModuleData {
  id: string;
  name: string;
}

export function ModulePermissionsGrid({ 
  modulePermissions, 
  setModulePermissions 
}: ModulePermissionsGridProps) {
  // Data for modules/features
  const modulesData: ModuleData[] = [
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

  const handlePermissionChange = (module: string, permission: keyof ModulePermission, checked: boolean) => {
    if (permission === 'can_view' && !checked) {
      // If turning off can_view, turn off all other permissions
      setModulePermissions({
        ...modulePermissions,
        [module]: {
          can_view: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
        }
      });
    } else {
      // For other permissions or enabling can_view
      setModulePermissions({
        ...modulePermissions,
        [module]: {
          ...modulePermissions[module],
          [permission]: checked,
          // If enabling any other permission, ensure can_view is also enabled
          ...(permission !== 'can_view' && checked ? { can_view: true } : {})
        }
      });
    }
  };

  return (
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
                    handlePermissionChange(module.id, 'can_view', !!checked);
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
                      handlePermissionChange(module.id, 'can_view', !!checked);
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
                      handlePermissionChange(module.id, 'can_create', !!checked);
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
                      handlePermissionChange(module.id, 'can_edit', !!checked);
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
                      handlePermissionChange(module.id, 'can_delete', !!checked);
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
  );
}
