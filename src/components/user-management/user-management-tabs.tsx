
import { TabsContent } from "@/components/ui/tabs";
import { UsersTab } from "./users-tab";
import { RolesTab } from "./roles-tab";

interface UserManagementTabsProps {
  activeTab: string;
  setOpenUserDialog: (open: boolean) => void;
  setOpenRoleDialog: (open: boolean) => void;
  setSelectedRoleId: (id: number | null) => void;
}

export function UserManagementTabs({ 
  activeTab, 
  setOpenUserDialog, 
  setOpenRoleDialog, 
  setSelectedRoleId 
}: UserManagementTabsProps) {
  return (
    <>
      <TabsContent value="users" className="mt-0">
        <UsersTab setOpenUserDialog={setOpenUserDialog} />
      </TabsContent>
      
      <TabsContent value="roles" className="mt-0">
        <RolesTab 
          setOpenRoleDialog={setOpenRoleDialog} 
          setSelectedRoleId={setSelectedRoleId} 
        />
      </TabsContent>
    </>
  );
}
