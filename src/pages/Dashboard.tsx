import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Calendar,
  ChevronDown,
  CreditCard,
  Gauge,
  LineChart,
  ListChecks,
  Loader2,
  PieChart,
  Plus,
  Receipt,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  TrendingUp,
  User,
  User2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Mock data for dashboard statistics
const statisticsData = [
  {
    id: 1,
    title: "Tổng số nhân viên",
    value: "150",
    icon: Users,
    color: "emerald",
    trend: "+20%",
  },
  {
    id: 2,
    title: "Dự án đang thực hiện",
    value: "12",
    icon: ListChecks,
    color: "blue",
    trend: "+5%",
  },
  {
    id: 3,
    title: "Tổng số giờ làm việc",
    value: "2,500",
    icon: Gauge,
    color: "violet",
    trend: "-3%",
  },
  {
    id: 4,
    title: "Doanh thu dự kiến",
    value: "5 tỷ",
    icon: TrendingUp,
    color: "orange",
    trend: "+15%",
  },
];

// Mock data for recent activities
const recentActivitiesData = [
  {
    id: 1,
    user: "Nguyễn Văn A",
    activity: "đã tạo dự án mới",
    project: "Thiết kế nội thất văn phòng",
    time: "5 phút trước",
  },
  {
    id: 2,
    user: "Trần Thị B",
    activity: "đã cập nhật tiến độ dự án",
    project: "Xây dựng nhà máy sản xuất",
    time: "15 phút trước",
  },
  {
    id: 3,
    user: "Lê Văn C",
    activity: "đã hoàn thành công việc",
    project: "Thiết kế cảnh quan khu đô thị",
    time: "30 phút trước",
  },
  {
    id: 4,
    user: "Phạm Thị D",
    activity: "đã giao việc cho",
    project: "Thiết kế nội thất căn hộ mẫu",
    time: "1 giờ trước",
    assignedTo: "Nguyễn Văn A",
  },
  {
    id: 5,
    user: "Hoàng Văn E",
    activity: "đã tải lên tài liệu",
    project: "Xây dựng cầu vượt",
    time: "2 giờ trước",
  },
];

// Mock data for project progress
const projectProgressData = [
  {
    id: 1,
    name: "Thiết kế nội thất văn phòng",
    progress: 60,
    status: "Đang thực hiện",
    dueDate: "30/12/2023",
  },
  {
    id: 2,
    name: "Xây dựng nhà máy sản xuất",
    progress: 35,
    status: "Đang thực hiện",
    dueDate: "15/01/2024",
  },
  {
    id: 3,
    name: "Thiết kế cảnh quan khu đô thị",
    progress: 85,
    status: "Hoàn thành",
    dueDate: "10/12/2023",
  },
  {
    id: 4,
    name: "Thiết kế nội thất căn hộ mẫu",
    progress: 20,
    status: "Đang thực hiện",
    dueDate: "25/12/2023",
  },
  {
    id: 5,
    name: "Xây dựng cầu vượt",
    progress: 75,
    status: "Đang thực hiện",
    dueDate: "05/01/2024",
  },
];

// Mock data for employee attendance
const employeeAttendanceData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    position: "Kiến trúc sư",
    status: "Có mặt",
    checkIn: "08:00",
    checkOut: "17:00",
  },
  {
    id: 2,
    name: "Trần Thị B",
    position: "Kỹ sư xây dựng",
    status: "Có mặt",
    checkIn: "08:30",
    checkOut: "17:30",
  },
  {
    id: 3,
    name: "Lê Văn C",
    position: "Nhân viên thiết kế",
    status: "Vắng mặt",
    checkIn: "Không có",
    checkOut: "Không có",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    position: "Nhân viên kinh doanh",
    status: "Có mặt",
    checkIn: "09:00",
    checkOut: "18:00",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    position: "Nhân viên kế toán",
    status: "Có mặt",
    checkIn: "08:15",
    checkOut: "17:15",
  },
];

// Mock data for notifications
const notificationsData = [
  {
    id: 1,
    message: "Bạn có một cuộc họp vào lúc 10:00",
    time: "5 phút trước",
  },
  {
    id: 2,
    message: "Dự án Thiết kế nội thất văn phòng đã được cập nhật",
    time: "15 phút trước",
  },
  {
    id: 3,
    message: "Bạn có một công việc mới được giao",
    time: "30 phút trước",
  },
  {
    id: 4,
    message: "Nhân viên Nguyễn Văn A đã đăng ký nghỉ phép",
    time: "1 giờ trước",
  },
  {
    id: 5,
    message: "Hệ thống đã được cập nhật phiên bản mới",
    time: "2 giờ trước",
  },
];

// Mock data for alerts
const alertsData = [
  {
    id: 1,
    type: "destructive",
    message: "Hệ thống đang gặp sự cố, vui lòng kiểm tra lại",
    time: "5 phút trước",
  },
  {
    id: 2,
    type: "warning",
    message: "Dự án Thiết kế nội thất văn phòng sắp đến hạn",
    time: "15 phút trước",
  },
  {
    id: 3,
    type: "success",
    message: "Bạn đã hoàn thành công việc Thiết kế cảnh quan khu đô thị",
    time: "30 phút trước",
  },
];

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
      ];
    },
  });

  return (
    <PageLayout>
      <PageHeader
        title="Tổng quan"
        subtitle="Theo dõi hoạt động và hiệu suất làm việc của bạn"
        actions={
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    date?.toLocaleDateString()
                  ) : (
                    <span>Chọn ngày làm việc</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("2023-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhanh
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statisticsData.map((item) => (
          <Card key={item.id} className="shadow-sm animate-slide-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className={`h-4 w-4 text-${item.color}-500`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-1 inline-block" />
                {item.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="shadow-sm animate-slide-in">
          <CardHeader>
            <CardTitle>Tiến độ dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dự án</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectProgressData.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>
                      <Progress value={project.progress} />
                      <span className="text-xs text-muted-foreground">
                        {project.progress}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{project.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm animate-slide-in">
          <CardHeader>
            <CardTitle>Điểm danh nhân viên</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeAttendanceData.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm animate-slide-in">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-none p-0">
              {recentActivitiesData.map((activity) => (
                <li key={activity.id} className="py-2 border-b last:border-none">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.activity}{" "}
                  <span className="font-medium">{activity.project}</span>
                  {activity.assignedTo && (
                    <>
                      {" "}
                      cho <span className="font-medium">{activity.assignedTo}</span>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="shadow-sm animate-slide-in">
          <CardHeader>
            <CardTitle>Thông báo</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-none p-0">
              {notificationsData.map((notification) => (
                <li key={notification.id} className="py-2 border-b last:border-none">
                  {notification.message}
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm animate-slide-in">
          <CardHeader>
            <CardTitle>Cảnh báo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertsData.map((alert) => (
              <Alert variant="destructive" className="bg-amber-50 dark:bg-amber-900/20">
                {alert.type === "destructive" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
                <AlertDescription className="flex flex-col">
                  <span>{alert.message}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {alert.time}
                  </span>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
