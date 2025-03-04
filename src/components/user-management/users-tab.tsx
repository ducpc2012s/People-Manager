
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, deleteUser } from "@/services/userService";
import { CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Filter, Loader2, MoreHorizontal, PenLine, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UsersTabProps {
  setOpenUserDialog: (open: boolean) => void;
}

export function UsersTab({ setOpenUserDialog }: UsersTabProps) {
  const [viewMode, setViewMode] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Mutations
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

  const handleDeleteUser = (userId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteUserMutation.mutate(userId);
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

  if (usersError) {
    return (
      <div className="p-4 bg-destructive/10 rounded-md">
        <h3 className="text-lg font-medium">Lỗi khi tải dữ liệu</h3>
        <p className="text-sm text-muted-foreground">
          {(usersError as Error)?.message || "Không thể kết nối đến cơ sở dữ liệu."}
        </p>
      </div>
    );
  }

  return (
    <CardContent className="p-4">
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
                        >
                          {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString("vi-VN")
                          : "Chưa đăng nhập"}
                      </TableCell>
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
                            <DropdownMenuItem>
                              <PenLine className="h-4 w-4 mr-2" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Xóa
                            </DropdownMenuItem>
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

// Import for Search icon
import { Search } from "lucide-react";
