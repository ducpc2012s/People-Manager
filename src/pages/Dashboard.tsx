
import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  Building,
  Bell,
  FileText,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ArrowUpRight,
  Calendar,
  ClipboardCheck,
  Zap,
  UserCheck,
  Activity,
  PieChart,
  TimerReset,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for system status
  const systemStatus = {
    online: true,
    lastUpdated: "15 phút trước",
    serverLoad: 32,
    memoryUsage: 48,
    activeUsers: 18,
    version: "1.2.3",
    alerts: [
      {
        type: "destructive", // Đã sửa từ "warning" thành "destructive"
        message: "Cập nhật phiên bản mới có sẵn",
        time: "2 giờ trước",
      },
      {
        type: "default",
        message: "Sao lưu dữ liệu tự động hoàn tất",
        time: "6 giờ trước",
      },
    ],
  };

  // Mock data for modules overview
  const modulesOverview = [
    {
      name: "Quản lý nhân viên",
      path: "/employees",
      status: "active",
      usageLevel: "high",
      updates: 2,
      icon: Users,
      color: "text-blue-500",
    },
    {
      name: "Chấm công",
      path: "/attendance",
      status: "active",
      usageLevel: "high",
      updates: 0,
      icon: ClipboardCheck,
      color: "text-emerald-500",
    },
    {
      name: "Ngày nghỉ",
      path: "/leave",
      status: "active",
      usageLevel: "medium",
      updates: 5,
      icon: Calendar,
      color: "text-amber-500",
    },
    {
      name: "Quản lý dự án",
      path: "/projects",
      status: "active",
      usageLevel: "high",
      updates: 1,
      icon: Briefcase,
      color: "text-purple-500",
    },
    {
      name: "Quản lý công trình",
      path: "/constructions",
      status: "active",
      usageLevel: "medium",
      updates: 0,
      icon: Building,
      color: "text-indigo-500",
    },
    {
      name: "Báo cáo",
      path: "/reports",
      status: "active",
      usageLevel: "low",
      updates: 0,
      icon: BarChart3,
      color: "text-rose-500",
    },
    {
      name: "Quản lý người dùng",
      path: "/user-management",
      status: "active",
      usageLevel: "medium",
      updates: 0,
      icon: Users,
      color: "text-orange-500",
    },
    {
      name: "Hồ sơ năng lực",
      path: "/portfolio",
      status: "active",
      usageLevel: "low",
      updates: 0,
      icon: FileText,
      color: "text-cyan-500",
    },
  ];

  // Stats
  const systemStats = [
    {
      title: "Tổng người dùng",
      value: "42",
      change: "+5%",
      up: true,
      icon: UserCheck,
      color: "text-blue-500",
    },
    {
      title: "Thời gian hoạt động",
      value: "99.8%",
      change: "-0.1%",
      up: false,
      icon: TimerReset,
      color: "text-emerald-500",
    },
    {
      title: "Số lượng truy cập",
      value: "1,286",
      change: "+12%",
      up: true,
      icon: Activity,
      color: "text-amber-500",
    },
    {
      title: "Lượt hoạt động",
      value: "5,842",
      change: "+8%",
      up: true,
      icon: PieChart,
      color: "text-purple-500",
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      user: "Admin",
      action: "đã tạo người dùng mới",
      target: "Nguyễn Thành",
      time: "15 phút trước",
    },
    {
      user: "Trần Thị B",
      action: "đã cập nhật dự án",
      target: "Khu nhà phố Riverside",
      time: "1 giờ trước",
    },
    {
      user: "Lê Văn C",
      action: "đã gửi đơn nghỉ phép",
      target: "3 ngày (15/04 - 17/04)",
      time: "2 giờ trước",
    },
    {
      user: "Admin",
      action: "đã cập nhật quyền hạn",
      target: "vai trò Quản lý",
      time: "3 giờ trước",
    },
    {
      user: "Hoàng Văn E",
      action: "đã tạo báo cáo mới",
      target: "Báo cáo tháng 3/2024",
      time: "6 giờ trước",
    },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Bảng điều khiển quản trị"
        subtitle="Quản lý tổng quan hệ thống ArchiPeople"
      />

      <div className="mb-6 animate-slide-in">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Activity className="h-4 w-4 mr-1" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-1">
              <Zap className="h-4 w-4 mr-1" />
              Các module
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-1">
              <Settings className="h-4 w-4 mr-1" />
              Hệ thống
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemStats.map((stat, index) => (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className={`text-sm mt-1 ${stat.up ? "text-emerald-500" : "text-rose-500"}`}>
                          {stat.change} {stat.up ? "↑" : "↓"}
                        </p>
                      </div>
                      <div className={`rounded-full p-3 bg-muted ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Hoạt động gần đây
                  </CardTitle>
                  <CardDescription>
                    Các thao tác được thực hiện trên hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 pb-3 border-b last:border-0 last:pb-0"
                      >
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-primary">
                          {activity.user.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="flex-1 text-sm">
                          <p>
                            <span className="font-medium">{activity.user}</span>{" "}
                            {activity.action}{" "}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Xem tất cả hoạt động
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <AlertOctagon className="h-5 w-5 mr-2" />
                    Thông báo hệ thống
                  </CardTitle>
                  <CardDescription>
                    Cảnh báo và thông báo từ hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert variant="destructive" className="bg-amber-50 dark:bg-amber-900/20">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Cập nhật hệ thống</AlertTitle>
                      <AlertDescription>
                        Phiên bản mới 1.3.0 đã sẵn sàng để cập nhật. Dự kiến: 20/04/2024
                      </AlertDescription>
                    </Alert>
                    <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20">
                      <Bell className="h-4 w-4" />
                      <AlertTitle>Bảo trì định kỳ</AlertTitle>
                      <AlertDescription>
                        Hệ thống sẽ bảo trì từ 22:00 - 24:00 ngày 18/04/2024
                      </AlertDescription>
                    </Alert>
                    <Alert variant="default" className="bg-emerald-50 dark:bg-emerald-900/20">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Sao lưu dữ liệu hoàn tất</AlertTitle>
                      <AlertDescription>
                        Sao lưu tự động dữ liệu hệ thống đã hoàn tất lúc 03:00 AM
                      </AlertDescription>
                    </Alert>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Quản lý thông báo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Modules hệ thống
                </CardTitle>
                <CardDescription>
                  Quản lý các module chức năng của hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modulesOverview.map((module, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="p-4 pb-3 bg-muted/50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`rounded-full p-1.5 mr-2 ${module.color}`}>
                              <module.icon className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-base">{module.name}</CardTitle>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${
                              module.status === "active"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                            }`}
                          >
                            {module.status === "active" ? "Hoạt động" : "Bảo trì"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-3">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Mức độ sử dụng:</span>
                            <span className="font-medium">
                              {module.usageLevel === "high"
                                ? "Cao"
                                : module.usageLevel === "medium"
                                ? "Trung bình"
                                : "Thấp"}
                            </span>
                          </div>
                          <Progress
                            value={
                              module.usageLevel === "high"
                                ? 80
                                : module.usageLevel === "medium"
                                ? 50
                                : 20
                            }
                            className="h-1.5"
                          />
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Cập nhật mới:</span>
                            {module.updates > 0 ? (
                              <Badge variant="default" className="px-1.5 py-0 h-5 text-[10px]">
                                {module.updates}
                              </Badge>
                            ) : (
                              <span>Không có</span>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            asChild
                          >
                            <Link to={module.path} className="flex items-center justify-center">
                              <span>Quản lý</span>
                              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Thông tin hệ thống
                    </CardTitle>
                    <CardDescription>
                      Trạng thái và thông tin hoạt động hệ thống
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Trạng thái:</span>
                        <Badge
                          variant="outline"
                          className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Hoạt động
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Phiên bản:</span>
                        <span className="font-medium">{systemStatus.version}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cập nhật gần nhất:</span>
                        <span>{systemStatus.lastUpdated}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Người dùng đang hoạt động:</span>
                        <span className="font-medium">{systemStatus.activeUsers}</span>
                      </div>
                      <Separator />
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tải CPU:</span>
                          <span className="font-medium">{systemStatus.serverLoad}%</span>
                        </div>
                        <Progress value={systemStatus.serverLoad} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bộ nhớ sử dụng:</span>
                          <span className="font-medium">{systemStatus.memoryUsage}%</span>
                        </div>
                        <Progress value={systemStatus.memoryUsage} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Lịch bảo trì và nâng cấp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start border-l-2 border-primary pl-3 py-1">
                        <div>
                          <p className="font-medium text-sm">Bảo trì định kỳ hệ thống</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            18/04/2024 (22:00 - 24:00)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start border-l-2 border-blue-500 pl-3 py-1">
                        <div>
                          <p className="font-medium text-sm">Nâng cấp lên phiên bản 1.3.0</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            20/04/2024 (20:00 - 22:00)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start border-l-2 border-amber-500 pl-3 py-1">
                        <div>
                          <p className="font-medium text-sm">Sao lưu dữ liệu toàn bộ hệ thống</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            01/05/2024 (03:00 - 05:00)
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Cảnh báo hệ thống
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {systemStatus.alerts.map((alert, index) => (
                        <Alert
                          key={index}
                          variant={alert.type}
                          className={
                            alert.type === "destructive"
                              ? "bg-amber-50 dark:bg-amber-900/20"
                              : "bg-blue-50 dark:bg-blue-900/20"
                          }
                        >
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
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Xem tất cả cảnh báo
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Thao tác nhanh
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Sao lưu dữ liệu
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Quản lý người dùng
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Cài đặt hệ thống
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Báo cáo hệ thống
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
