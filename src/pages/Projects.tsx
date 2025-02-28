
import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  Building,
  Calendar,
  Check,
  Clock,
  LayoutGrid,
  List,
  MoreHorizontal,
  PenLine,
  PlusCircle,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Mock projects data
const projectsData = [
  {
    id: 1,
    name: "Khu nhà phố Riverside",
    client: "Công ty TNHH Phát triển Đô thị ABC",
    status: "Đang thi công",
    progress: 75,
    dueDate: "15/05/2024",
    startDate: "10/11/2023",
    manager: "Nguyễn Văn A",
    location: "Quận 7, TP.HCM",
    budget: "25.000.000.000 VND",
    priority: "Cao",
    team: [
      { name: "Nguyễn Văn A", role: "Quản lý dự án" },
      { name: "Trần Thị B", role: "Kỹ sư xây dựng" },
      { name: "Lê Văn C", role: "Thiết kế nội thất" },
      { name: "Phạm Thị D", role: "Kiến trúc sư" },
    ],
    description:
      "Dự án khu nhà phố cao cấp với 32 căn liền kề, thiết kế hiện đại, tích hợp không gian xanh và tiện ích công cộng.",
  },
  {
    id: 2,
    name: "Biệt thự nghỉ dưỡng Serenity",
    client: "Tập đoàn Bất động sản XYZ",
    status: "Thiết kế",
    progress: 30,
    dueDate: "22/06/2024",
    startDate: "05/02/2024",
    manager: "Trần Thị B",
    location: "Bà Rịa - Vũng Tàu",
    budget: "18.000.000.000 VND",
    priority: "Trung bình",
    team: [
      { name: "Trần Thị B", role: "Quản lý dự án" },
      { name: "Phạm Thị D", role: "Kiến trúc sư" },
      { name: "Hoàng Văn E", role: "Kỹ sư kết cấu" },
    ],
    description:
      "Biệt thự nghỉ dưỡng ven biển với thiết kế sang trọng, view hướng biển, kết hợp kiến trúc hiện đại và yếu tố thiên nhiên.",
  },
  {
    id: 3,
    name: "Chung cư cao cấp Sky Garden",
    client: "Tập đoàn Đầu tư Bất động sản DEF",
    status: "Hoàn thiện",
    progress: 90,
    dueDate: "05/04/2024",
    startDate: "20/08/2023",
    manager: "Lê Văn C",
    location: "Quận 2, TP.HCM",
    budget: "42.000.000.000 VND",
    priority: "Cao",
    team: [
      { name: "Lê Văn C", role: "Quản lý dự án" },
      { name: "Nguyễn Văn A", role: "Kỹ sư xây dựng" },
      { name: "Hoàng Văn E", role: "Giám sát công trình" },
      { name: "Đỗ Thị F", role: "Thiết kế cảnh quan" },
      { name: "Vũ Văn G", role: "Kỹ sư MEP" },
    ],
    description:
      "Khu chung cư cao cấp gồm 3 tòa tháp với 600 căn hộ, thiết kế hiện đại, đầy đủ tiện ích như bể bơi, gym, spa, khu vui chơi trẻ em, và khu vườn trên cao.",
  },
  {
    id: 4,
    name: "Văn phòng công ty Tech Innovation",
    client: "Công ty CP Công nghệ Tech Innovation",
    status: "Đang thi công",
    progress: 45,
    dueDate: "30/07/2024",
    startDate: "15/12/2023",
    manager: "Phạm Thị D",
    location: "Quận 1, TP.HCM",
    budget: "12.000.000.000 VND",
    priority: "Trung bình",
    team: [
      { name: "Phạm Thị D", role: "Quản lý dự án" },
      { name: "Lê Văn C", role: "Thiết kế nội thất" },
      { name: "Vũ Văn G", role: "Kỹ sư MEP" },
    ],
    description:
      "Thiết kế và thi công văn phòng theo phong cách hiện đại, mở, tối ưu hóa không gian làm việc sáng tạo với nhiều khu vực chức năng linh hoạt.",
  },
  {
    id: 5,
    name: "Khu đô thị Green Valley",
    client: "Tập đoàn Phát triển Đô thị GHI",
    status: "Hoàn thành",
    progress: 100,
    dueDate: "10/12/2023",
    startDate: "05/03/2023",
    manager: "Hoàng Văn E",
    location: "Long An",
    budget: "68.000.000.000 VND",
    priority: "Cao",
    team: [
      { name: "Hoàng Văn E", role: "Quản lý dự án" },
      { name: "Nguyễn Văn A", role: "Kiến trúc sư" },
      { name: "Trần Thị B", role: "Kỹ sư xây dựng" },
      { name: "Đỗ Thị F", role: "Kế toán dự án" },
      { name: "Vũ Văn G", role: "Kỹ sư MEP" },
    ],
    description:
      "Khu đô thị phức hợp bao gồm biệt thự, nhà phố, chung cư và trung tâm thương mại, với hệ thống tiện ích đầy đủ, cảnh quan xanh và hồ điều hòa.",
  },
  {
    id: 6,
    name: "Nhà hàng Fusion Cuisine",
    client: "Công ty TNHH Ẩm thực Fusion",
    status: "Thiết kế",
    progress: 25,
    dueDate: "15/06/2024",
    startDate: "10/02/2024",
    manager: "Đỗ Thị F",
    location: "Quận 3, TP.HCM",
    budget: "5.000.000.000 VND",
    priority: "Thấp",
    team: [
      { name: "Đỗ Thị F", role: "Quản lý dự án" },
      { name: "Lê Văn C", role: "Thiết kế nội thất" },
      { name: "Phạm Thị D", role: "Kiến trúc sư" },
    ],
    description:
      "Thiết kế nhà hàng phong cách fusion độc đáo, kết hợp yếu tố truyền thống và hiện đại, tạo không gian ẩm thực sang trọng và ấm cúng.",
  },
];

const Projects = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTab, setSelectedTab] = useState("all");
  const [showDialog, setShowDialog] = useState(false);

  // Filter projects based on selected tab
  const filteredProjects =
    selectedTab === "all"
      ? projectsData
      : selectedTab === "inProgress"
      ? projectsData.filter(
          (p) => p.status === "Đang thi công" || p.status === "Thiết kế"
        )
      : selectedTab === "completed"
      ? projectsData.filter(
          (p) => p.status === "Hoàn thành" || p.status === "Hoàn thiện"
        )
      : projectsData;

  return (
    <PageLayout>
      <PageHeader
        title="Quản lý dự án"
        subtitle="Quản lý tất cả các dự án thiết kế và thi công"
        actions={
          <div className="flex items-center gap-2">
            <div className="border rounded-md flex">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-none rounded-l-md"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-none rounded-r-md"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4 mr-1" /> Thêm dự án
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Thêm dự án mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin dự án mới để thêm vào hệ thống.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên dự án</Label>
                      <Input id="name" placeholder="Nhập tên dự án" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client">Khách hàng</Label>
                      <Input id="client" placeholder="Tên khách hàng" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Thiết kế</SelectItem>
                          <SelectItem value="inProgress">Đang thi công</SelectItem>
                          <SelectItem value="finishing">Hoàn thiện</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Mức độ ưu tiên</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mức độ ưu tiên" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Cao</SelectItem>
                          <SelectItem value="medium">Trung bình</SelectItem>
                          <SelectItem value="low">Thấp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Ngày bắt đầu</Label>
                      <Input id="startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Ngày hoàn thành</Label>
                      <Input id="dueDate" type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="manager">Người quản lý</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn người quản lý" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager1">Nguyễn Văn A</SelectItem>
                          <SelectItem value="manager2">Trần Thị B</SelectItem>
                          <SelectItem value="manager3">Lê Văn C</SelectItem>
                          <SelectItem value="manager4">Phạm Thị D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Ngân sách (VND)</Label>
                      <Input id="budget" placeholder="Nhập ngân sách" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Địa điểm</Label>
                    <Input id="location" placeholder="Địa điểm dự án" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả dự án</Label>
                    <Textarea
                      id="description"
                      placeholder="Nhập mô tả chi tiết về dự án"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                  >
                    Hủy bỏ
                  </Button>
                  <Button type="submit" onClick={() => setShowDialog(false)}>
                    Tạo dự án
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <Tabs
        defaultValue="all"
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="mb-6 animate-slide-in"
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4 mr-1" />
            Tất cả dự án
            <Badge variant="secondary" className="ml-1">
              {projectsData.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="flex items-center gap-1">
            <Clock className="h-4 w-4 mr-1" />
            Đang thực hiện
            <Badge variant="secondary" className="ml-1">
              {
                projectsData.filter(
                  (p) => p.status === "Đang thi công" || p.status === "Thiết kế"
                ).length
              }
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1">
            <Check className="h-4 w-4 mr-1" />
            Hoàn thành
            <Badge variant="secondary" className="ml-1">
              {
                projectsData.filter(
                  (p) => p.status === "Hoàn thành" || p.status === "Hoàn thiện"
                ).length
              }
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-0">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/50"
                >
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg truncate max-w-[200px]">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="mt-1 truncate max-w-[220px]">
                          {project.client}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PenLine className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa dự án
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge
                          variant={
                            project.status === "Hoàn thành" || project.status === "Hoàn thiện" 
                              ? "default"
                              : project.status === "Thiết kế"
                              ? "outline"
                              : "secondary"
                          }
                          className={
                            project.status === "Hoàn thành" || project.status === "Hoàn thiện"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                              : ""
                          }
                        >
                          {project.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {project.dueDate}
                        </span>
                      </div>

                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Tiến độ:</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Đội dự án:</span>
                          </div>
                          <span>{project.team.length} người</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member, i) => (
                              <Avatar
                                key={i}
                                className="h-6 w-6 border-2 border-background"
                              >
                                <AvatarFallback className="text-[10px]">
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {project.team.length > 3 && (
                            <span className="text-xs ml-1 text-muted-foreground">
                              +{project.team.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building className="h-3.5 w-3.5 mr-1" />
                      {project.location}
                    </div>
                    <Badge variant="outline" className="font-normal">
                      {project.priority}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Tên dự án</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Tiến độ</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Người quản lý</TableHead>
                    <TableHead>Ngày hoàn thành</TableHead>
                    <TableHead className="w-[80px] text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {project.client}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.status === "Hoàn thành" || project.status === "Hoàn thiện"
                              ? "default"
                              : project.status === "Thiết kế"
                              ? "outline"
                              : "secondary"
                          }
                          className={
                            project.status === "Hoàn thành" || project.status === "Hoàn thiện"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                              : ""
                          }
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-[120px] flex items-center gap-2">
                          <Progress value={project.progress} className="h-2" />
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>{project.manager}</TableCell>
                      <TableCell>{project.dueDate}</TableCell>
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
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <PenLine className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa dự án
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Projects;
