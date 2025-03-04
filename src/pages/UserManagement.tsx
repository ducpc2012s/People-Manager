
import AdminCheck from '@/components/auth/AdminCheck';
import { PageLayout } from "@/components/layout/page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { UserManagementTabs } from '@/components/user-management/user-management-tabs';
import { UserPlus, ShieldCheck } from "lucide-react";
import { UserDialog } from '@/components/user-management/user-dialog';
import { RoleDialog } from '@/components/user-management/role-dialog';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  return (
    <PageLayout>
      <PageHeader
        title="Quản lý người dùng và phân quyền"
        subtitle="Thiết lập người dùng, vai trò và phân quyền trong hệ thống"
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "users" ? (
              <UserDialog 
                open={openUserDialog} 
                onOpenChange={setOpenUserDialog} 
              />
            ) : (
              <RoleDialog 
                open={openRoleDialog} 
                onOpenChange={setOpenRoleDialog} 
                selectedRoleId={selectedRoleId}
                setSelectedRoleId={setSelectedRoleId}
              />
            )}
          </div>
        }
      />

      <Card className="shadow-sm animate-slide-in">
        <Tabs
          defaultValue="users"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4 p-4">
            <TabsTrigger value="users" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4 mr-1" />
              Quản lý người dùng
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 mr-1" />
              Vai trò & Phân quyền
            </TabsTrigger>
          </TabsList>

          <UserManagementTabs 
            activeTab={activeTab} 
            setOpenUserDialog={setOpenUserDialog}
            setOpenRoleDialog={setOpenRoleDialog}
            setSelectedRoleId={setSelectedRoleId}
          />
        </Tabs>
      </Card>
    </PageLayout>
  );
};

export default UserManagement;
