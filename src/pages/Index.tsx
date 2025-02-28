
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  ClipboardCheck,
  Calendar,
  DollarSign,
  Briefcase,
  Building,
  Bell,
  Eye,
  ArrowUpRight,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Index = () => {
  // Mock data
  const stats = [
    { label: "Tổng nhân viên", value: 42, icon: Users, color: "text-blue-500" },
    {
      label: "Chuyên môn",
      value: 18,
      icon: UserCheck,
      color: "text-emerald-500",
    },
    {
      label: "Vận hành",
      value: 24,
      icon: Briefcase,
      color: "text-amber-500",
    },
    {
      label: "Vắng mặt",
      value: 3,
      icon: UserX,
      color: "text-rose-500",
    },
  ];

  const recentProjects = [
    {
      name: "Khu nhà phố Riverside",
      progress: 75,
      status: "Đang thi công",
      dueDate: "15/05/2024",
    },
    {
      name: "Biệt thự nghỉ dưỡng Serenity",
      progress: 30,
      status: "Thiết kế",
      dueDate: "22/06/2024",
    },
    {
      name: "Chung cư cao cấp Sky Garden",
      progress: 90,
      status: "Hoàn thiện",
      dueDate: "05/04/2024",
    },
  ];

  const upcomingEvents = [
    {
      title: "Họp dự án Riverside",
      time: "09:00 AM - 10:30 AM",
      date: "Hôm nay",
    },
    {
      title: "Đánh giá thiết kế Serenity",
      time: "02:00 PM - 03:30 PM",
      date: "Hôm nay",
    },
    {
      title: "Phỏng vấn ứng viên KTS",
      time: "10:30 AM - 11:30 AM",
      date: "Ngày mai",
    },
  ];

  const notifications = [
    {
      message: "Đơn xin nghỉ phép của Nguyễn Văn A cần duyệt",
      time: "15 phút trước",
    },
    {
      message: "Báo cáo tiến độ dự án Sky Garden đã cập nhật",
      time: "1 giờ trước",
    },
    {
      message: "Tài liệu năng lực cần cập nhật trước 20/04",
      time: "3 giờ trước",
    },
  ];

  const currentTime = new Date();
  const hours = currentTime.getHours();
  let greeting;

  if (hours < 12) {
    greeting = "Chào buổi sáng";
  } else if (hours < 18) {
    greeting = "Chào buổi chiều";
  } else {
    greeting = "Chào buổi tối";
  }

  return (
    <PageLayout>
      <PageHeader
        title={greeting}
        subtitle="Chào mừng đến với hệ thống quản lý nhân sự ArchiPeople"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-in">
        {stats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={cn(
                    "rounded-full p-3 bg-background shadow-sm",
                    stat.color
                  )}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Dự án gần đây
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/projects" className="flex items-center gap-1">
                  Xem tất cả <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge
                      variant={
                        project.status === "Hoàn thiện"
                          ? "success"
                          : project.status === "Thiết kế"
                          ? "outline"
                          : "default"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Tiến độ: {project.progress}%</span>
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {project.dueDate}
                    </span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Lịch hôm nay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start border-l-2 border-primary pl-3 py-1"
                  >
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.time}
                        <span className="mx-1">•</span>
                        {event.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                asChild
              >
                <Link to="/calendar">Xem lịch đầy đủ</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Thông báo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="flex items-start border p-2 rounded-md hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 ml-2"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Nhân viên mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b last:border-0 pb-3 last:pb-0"
                >
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg`} />
                    <AvatarFallback>
                      {["NT", "HA", "KD"][i]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {["Nguyễn Thành", "Hoàng Anh", "Khánh Đan"][i]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {[
                        "Kiến trúc sư",
                        "Kỹ sư xây dựng",
                        "Thiết kế nội thất",
                      ][i]}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <Badge variant="outline" className="text-xs">
                      {["15 ngày", "1 tháng", "2 tuần"][i]}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                asChild
              >
                <Link to="/employees">Xem tất cả nhân viên</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Chấm công hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center gap-2 mb-4">
              <div className="text-center flex-1">
                <div className="text-3xl font-bold text-emerald-500">36</div>
                <div className="text-xs text-muted-foreground">Có mặt</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-3xl font-bold text-amber-500">3</div>
                <div className="text-xs text-muted-foreground">Đi trễ</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-3xl font-bold text-rose-500">3</div>
                <div className="text-xs text-muted-foreground">Vắng mặt</div>
              </div>
            </div>
            <Progress value={85} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>85% tỷ lệ hiện diện</span>
              <span>Cập nhật: 11:30 AM</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              asChild
            >
              <Link to="/attendance">Chi tiết chấm công</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Công trình mới nhất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-3 relative group">
              <img
                src="/placeholder.svg"
                alt="Công trình mới nhất"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <div className="text-white">
                  <h4 className="font-medium">Khu đô thị Green Valley</h4>
                  <p className="text-xs">Hoàn thành: 12/2023</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              asChild
            >
              <Link to="/portfolio">Xem hồ sơ năng lực</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Index;
