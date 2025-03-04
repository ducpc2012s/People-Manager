import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoles } from "@/services/roleService";
import { createUser } from "@/services/userService";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDialog({ open, onOpenChange }: UserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: 0,
    department_id: 0,
    status: "active" as "active" | "inactive",
  });

  // Fetch roles for the select dropdown
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // Mutation for creating a user
  const createUserMutation = useMutation({
    mutationFn: (userData: { user: Partial<typeof newUser>; password: string }) => 
      createUser(userData.user, userData.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Thành công",
        description: "Người dùng đã được tạo. Email xác nhận đã được gửi.",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      let errorMessage = error.message || "Không thể tạo người dùng";
      
      if (error.code === "23505" || errorMessage.includes("unique constraint")) {
        errorMessage = "Email này đã được sử dụng. Vui lòng sử dụng email khác.";
      } else if (errorMessage.includes("User already registered")) {
        errorMessage = "Người dùng đã tồn tại với email này.";
      } else if (errorMessage.includes("Password should be at least")) {
        errorMessage = "Mật khẩu phải có ít nhất 6 ký tự.";
      }
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("Error creating user:", error);
    },
  });

  const resetForm = () => {
    setNewUser({
      full_name: "",
      email: "",
      password: "",
      role_id: 0,
      department_id: 0,
      status: "active",
    });
  };

  const handleSubmit = () => {
    if (!newUser.full_name) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập họ tên người dùng",
        variant: "destructive",
      });
      return;
    }
    
    if (!newUser.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập email",
        variant: "destructive",
      });
      return;
    }
    
    if (!newUser.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mật khẩu",
        variant: "destructive",
      });
      return;
    }
    
    if (!newUser.role_id) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn vai trò",
        variant: "destructive",
      });
      return;
    }
    
    if (!newUser.department_id) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn phòng ban",
        variant: "destructive",
      });
      return;
    }
    
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button 
            onClick={handleSubmit}
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
  );
}
