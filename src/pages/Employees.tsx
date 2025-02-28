
import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronsUpDown,
  Download,
  Filter,
  MoreHorizontal,
  PenLine,
  PlusCircle,
  Printer,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";

// Mock employee data
const employees = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@archipeople.com",
    role: "Kiến trúc sư",
    department: "Phòng thiết kế",
    status: "Đang làm việc",
    joinDate: "01/05/2020",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@archipeople.com",
    role: "Kỹ sư xây dựng",
    department: "Phòng thi công",
    status: "Đang làm việc",
    joinDate: "15/08/2021",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@archipeople.com",
    role: "Thiết kế nội thất",
    department: "Phòng thiết kế",
    status: "Đang làm việc",
    joinDate: "10/02/2022",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@archipeople.com",
    role: "Quản lý dự án",
    department: "Phòng dự án",
    status: "Đang làm việc",
    joinDate: "20/11/2019",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@archipeople.com",
    role: "Giám sát công trình",
    department: "Phòng thi công",
    status: "Đang làm việc",
    joinDate: "05/04/2021",
  },
  {
    id: 6,
    name: "Đỗ Thị F",
    email: "dothif@archipeople.com",
    role: "Kế toán",
    department: "Phòng tài chính",
    status: "Nghỉ phép",
    joinDate: "12/07/2020",
  },
  {
    id: 7,
    name: "Vũ Văn G",
    email: "vuvang@archipeople.com",
    role: "Kỹ sư MEP",
    department: "Phòng kỹ thuật",
    status: "Đang làm việc",
    joinDate: "18/09/2022",
  },
];

const Employees = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("all");

  const filteredEmployees =
    tab === "all"
      ? employees
      : tab === "active"
      ? employees.filter((e) => e.status === "Đang làm việc")
      : employees.filter((e) => e.status !== "Đang làm việc");

  return (
    <PageLayout>
      <PageHeader
        title="Quản lý nhân viên"
        subtitle="Quản lý thông tin nhân sự và nhân viên của công ty"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="ml-3 flex items-center gap-1">
                <UserPlus className="h-4 w-4 mr-1" /> Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[540px]">
              <DialogHeader>
                <DialogTitle>Thêm nhân viên mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin cá nhân và công việc của nhân viên mới. Nhấn
                  Lưu khi hoàn tất.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Họ và tên
                  </Label>
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@archipeople.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Vị trí
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn vị trí" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="architect">Kiến trúc sư</SelectItem>
                      <SelectItem value="engineer">Kỹ sư xây dựng</SelectItem>
                      <SelectItem value="interior">
                        Thiết kế nội thất
                      </SelectItem>
                      <SelectItem value="manager">Quản lý dự án</SelectItem>
                      <SelectItem value="supervisor">
                        Giám sát công trình
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Phòng ban
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design">Phòng thiết kế</SelectItem>
                      <SelectItem value="construction">
                        Phòng thi công
                      </SelectItem>
                      <SelectItem value="project">Phòng dự án</SelectItem>
                      <SelectItem value="finance">Phòng tài chính</SelectItem>
                      <SelectItem value="technical">Phòng kỹ thuật</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="joinDate" className="text-right">
                    Ngày vào làm
                  </Label>
                  <Input
                    id="joinDate"
                    type="date"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button type="submit" onClick={() => setOpen(false)}>
                  Lưu thông tin
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="shadow-sm animate-slide-in">
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Danh sách nhân viên</CardTitle>
              <CardDescription>
                Quản lý tất cả thông tin và hồ sơ nhân viên
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3.5 w-3.5 mr-1" /> Lọc
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Printer className="h-3.5 w-3.5 mr-1" /> In
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-1" /> Xuất
              </Button>
            </div>
          </div>
          <Tabs defaultValue="all" value={tab} onValueChange={setTab} className="mt-4">
            <TabsList>
              <TabsTrigger value="all" className="flex gap-1">
                <User className="h-4 w-4" /> Tất cả
                <Badge variant="secondary" className="ml-1">
                  {employees.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="flex gap-1">
                Đang làm việc
                <Badge variant="secondary" className="ml-1">
                  {
                    employees.filter((e) => e.status === "Đang làm việc").length
                  }
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="inactive" className="flex gap-1">
                Khác
                <Badge variant="secondary" className="ml-1">
                  {
                    employees.filter((e) => e.status !== "Đang làm việc").length
                  }
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-y">
            <div className="flex items-center justify-between py-2 px-4">
              <div className="flex items-center gap-2">
                <Select defaultValue="10">
                  <SelectTrigger className="h-8 w-auto">
                    <SelectValue placeholder="Hiển thị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 hàng</SelectItem>
                    <SelectItem value="20">20 hàng</SelectItem>
                    <SelectItem value="50">50 hàng</SelectItem>
                    <SelectItem value="100">100 hàng</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  Hiển thị 1-{filteredEmployees.length} trong {filteredEmployees.length} nhân viên
                </span>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày vào làm</TableHead>
                <TableHead className="w-[70px] text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{employee.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {employee.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "Đang làm việc"
                          ? "success"
                          : "secondary"
                      }
                      className={
                        employee.status === "Đang làm việc"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                          : ""
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Xem hồ sơ
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <PenLine className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between py-2 px-4 border-t">
            <div className="text-sm text-muted-foreground">
              Hiển thị 1-{filteredEmployees.length} trong {filteredEmployees.length} nhân viên
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                &lt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 min-w-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                &gt;
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Employees;
