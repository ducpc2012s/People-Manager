
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileClock,
  FileInput,
  Printer,
  Search,
  Upload,
  UserCheck,
  UserCog,
  UserX,
  XCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Mock data for attendance
const employeeAttendance = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    position: "Kiến trúc sư",
    status: "Đúng giờ",
    checkIn: "08:00 AM",
    checkOut: "05:30 PM",
    workHours: "8h 30m",
    date: "15/03/2024",
  },
  {
    id: 2,
    name: "Trần Thị B",
    position: "Kỹ sư xây dựng",
    status: "Đúng giờ",
    checkIn: "08:05 AM",
    checkOut: "05:25 PM",
    workHours: "8h 20m",
    date: "15/03/2024",
  },
  {
    id: 3,
    name: "Lê Văn C",
    position: "Thiết kế nội thất",
    status: "Đi trễ",
    checkIn: "09:20 AM",
    checkOut: "06:10 PM",
    workHours: "7h 50m",
    date: "15/03/2024",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    position: "Quản lý dự án",
    status: "Đúng giờ",
    checkIn: "07:55 AM",
    checkOut: "05:40 PM",
    workHours: "8h 45m",
    date: "15/03/2024",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    position: "Giám sát công trình",
    status: "Đúng giờ",
    checkIn: "08:10 AM",
    checkOut: "06:00 PM",
    workHours: "8h 50m",
    date: "15/03/2024",
  },
  {
    id: 6,
    name: "Đỗ Thị F",
    position: "Kế toán",
    status: "Vắng mặt",
    checkIn: "-",
    checkOut: "-",
    workHours: "0h",
    date: "15/03/2024",
  },
  {
    id: 7,
    name: "Vũ Văn G",
    position: "Kỹ sư MEP",
    status: "Về sớm",
    checkIn: "08:15 AM",
    checkOut: "03:40 PM",
    workHours: "6h 25m",
    date: "15/03/2024",
  },
];

// Calculate stats
const presentCount = employeeAttendance.filter(
  (emp) => emp.status === "Đúng giờ"
).length;
const lateCount = employeeAttendance.filter(
  (emp) => emp.status === "Đi trễ"
).length;
const earlyLeaveCount = employeeAttendance.filter(
  (emp) => emp.status === "Về sớm"
).length;
const absentCount = employeeAttendance.filter(
  (emp) => emp.status === "Vắng mặt"
).length;
const totalEmployees = employeeAttendance.length;
const attendanceRate = ((presentCount + lateCount + earlyLeaveCount) / totalEmployees) * 100;

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState("15/03/2024");
  const [tab, setTab] = useState("all");

  const filteredAttendance =
    tab === "all"
      ? employeeAttendance
      : tab === "present"
      ? employeeAttendance.filter((a) => a.status === "Đúng giờ")
      : tab === "late"
      ? employeeAttendance.filter((a) => a.status === "Đi trễ")
      : tab === "early"
      ? employeeAttendance.filter((a) => a.status === "Về sớm")
      : employeeAttendance.filter((a) => a.status === "Vắng mặt");

  return (
    <PageLayout>
      <PageHeader
        title="Chấm công & Điểm danh"
        subtitle="Quản lý thông tin chấm công và điểm danh hàng ngày"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Upload className="h-4 w-4 mr-1" /> Nhập file
            </Button>
            <Button className="flex items-center gap-1">
              <FileClock className="h-4 w-4 mr-1" /> Điểm danh thủ công
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-in">
        <Card className="card-hover shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Có mặt</p>
                <p className="text-3xl font-bold text-emerald-500">
                  {presentCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {((presentCount / totalEmployees) * 100).toFixed(0)}% nhân
                  viên
                </p>
              </div>
              <div className="rounded-full p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Đi trễ</p>
                <p className="text-3xl font-bold text-amber-500">{lateCount}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {((lateCount / totalEmployees) * 100).toFixed(0)}% nhân viên
                </p>
              </div>
              <div className="rounded-full p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-500">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Về sớm</p>
                <p className="text-3xl font-bold text-blue-500">
                  {earlyLeaveCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {((earlyLeaveCount / totalEmployees) * 100).toFixed(0)}% nhân
                  viên
                </p>
              </div>
              <div className="rounded-full p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                <UserCog className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vắng mặt</p>
                <p className="text-3xl font-bold text-rose-500">
                  {absentCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {((absentCount / totalEmployees) * 100).toFixed(0)}% nhân viên
                </p>
              </div>
              <div className="rounded-full p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500">
                <UserX className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 shadow-sm card-hover">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Điểm danh ngày {selectedDate}
                </CardTitle>
                <CardDescription>
                  Tổng số nhân viên điểm danh: {employeeAttendance.length}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Label htmlFor="date" className="mr-2">
                    Ngày:
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="w-40 h-9"
                    defaultValue="2024-03-15"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" value={tab} onValueChange={setTab} className="mt-4">
              <TabsList>
                <TabsTrigger value="all" className="flex gap-1">
                  Tất cả
                  <Badge variant="secondary" className="ml-1">
                    {employeeAttendance.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="present" className="flex gap-1">
                  Có mặt
                  <Badge variant="secondary" className="ml-1">
                    {presentCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="late" className="flex gap-1">
                  Đi trễ
                  <Badge variant="secondary" className="ml-1">
                    {lateCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="early" className="flex gap-1">
                  Về sớm
                  <Badge variant="secondary" className="ml-1">
                    {earlyLeaveCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="absent" className="flex gap-1">
                  Vắng mặt
                  <Badge variant="secondary" className="ml-1">
                    {absentCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0 overflow-auto">
            <div className="border-y">
              <div className="flex items-center justify-between py-2 px-4">
                <div className="flex items-center gap-2">
                  <Select defaultValue="10">
                    <SelectTrigger className="h-8 w-24">
                      <SelectValue placeholder="Hiển thị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 hàng</SelectItem>
                      <SelectItem value="20">20 hàng</SelectItem>
                      <SelectItem value="50">50 hàng</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    Hiển thị 1-{filteredAttendance.length} trong{" "}
                    {filteredAttendance.length} nhân viên
                  </span>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm nhân viên..."
                    className="h-9 w-60 pl-8"
                  />
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Giờ vào</TableHead>
                  <TableHead>Giờ ra</TableHead>
                  <TableHead>Thời gian làm việc</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {record.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{record.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {record.position}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "Đúng giờ"
                            ? "default"
                            : record.status === "Đi trễ" ||
                              record.status === "Về sớm"
                            ? "outline"
                            : "destructive"
                        }
                        className={
                          record.status === "Đúng giờ"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                            : record.status === "Đi trễ"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                            : record.status === "Về sớm"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                            : ""
                        }
                      >
                        {record.status === "Đúng giờ" && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {record.status === "Đi trễ" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {record.status === "Về sớm" && (
                          <FileInput className="h-3 w-3 mr-1" />
                        )}
                        {record.status === "Vắng mặt" && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.workHours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm card-hover">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileInput className="h-5 w-5" />
                Tổng quát chấm công
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tỷ lệ đi làm</span>
                    <span className="font-medium">
                      {attendanceRate.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={attendanceRate} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span>Đúng giờ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{presentCount}</span>
                      <span className="text-muted-foreground text-sm">
                        ({((presentCount / totalEmployees) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span>Đi trễ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{lateCount}</span>
                      <span className="text-muted-foreground text-sm">
                        ({((lateCount / totalEmployees) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span>Về sớm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{earlyLeaveCount}</span>
                      <span className="text-muted-foreground text-sm">
                        ({((earlyLeaveCount / totalEmployees) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                      <span>Vắng mặt</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{absentCount}</span>
                      <span className="text-muted-foreground text-sm">
                        ({((absentCount / totalEmployees) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm card-hover">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="h-5 w-5" />
                Điểm danh nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Mã nhân viên hoặc tên"
                    className="flex-1"
                  />
                  <Button size="sm" className="h-10 shrink-0 flex items-center gap-1">
                    <Check className="h-4 w-4 mr-1" /> Điểm danh
                  </Button>
                </div>

                <div className="border rounded-lg p-3 bg-accent/30">
                  <div className="text-sm mb-1 font-medium">Trạng thái điểm danh:</div>
                  <div className="flex items-center gap-2 border-b pb-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>NT</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">Nguyễn Thành</span>
                      <span className="text-xs text-muted-foreground">
                        Kiến trúc sư
                      </span>
                    </div>
                    <Badge className="ml-auto bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Đã điểm danh
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Giờ vào:</span>
                      <span className="font-medium ml-1">08:15 AM</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày:</span>
                      <span className="font-medium ml-1">15/03/2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Attendance;
