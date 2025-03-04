
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoles, deleteRole } from "@/services/roleService";
import { CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RolesTabProps {
  setOpenRoleDialog: (open: boolean) => void;
  setSelectedRoleId: (id: number | null) => void;
}

export function RolesTab({ setOpenRoleDialog, setSelectedRoleId }: RolesTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: roles = [],
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // Mutations
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

  const handleDeleteRole = (roleId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa vai trò này? Tất cả người dùng có vai trò này sẽ mất quyền.")) {
      deleteRoleMutation.mutate(roleId);
    }
  };

  const handleEditRole = (roleId: number) => {
    setSelectedRoleId(roleId);
    setOpenRoleDialog(true);
  };

  if (rolesError) {
    return (
      <div className="p-4 bg-destructive/10 rounded-md">
        <h3 className="text-lg font-medium">Lỗi khi tải dữ liệu</h3>
        <p className="text-sm text-muted-foreground">
          {(rolesError as Error)?.message || "Không thể kết nối đến cơ sở dữ liệu."}
        </p>
      </div>
    );
  }

  return (
    <CardContent className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg">Vai trò & Phân quyền</CardTitle>
          <CardDescription>
            Quản lý các vai trò và quyền truy cập trong hệ thống
          </CardDescription>
        </div>
      </div>

      <div className="mt-4">
        {rolesLoading ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên vai trò</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số người dùng</TableHead>
                  <TableHead className="w-[70px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      Không có vai trò nào
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              role.name === "Quản trị viên"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300"
                                : ""
                            }
                          >
                            {role.name}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{role.description || "Không có mô tả"}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditRole(role.id)}>
                              <PenLine className="h-4 w-4 mr-2" /> Chỉnh sửa
                            </DropdownMenuItem>
                            {role.name !== "Quản trị viên" && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteRole(role.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Xóa
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </CardContent>
  );
}
