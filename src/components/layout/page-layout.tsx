
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/sidebar/main-sidebar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <ThemeProvider defaultTheme="light">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <MainSidebar />
          <main className="flex-1 overflow-auto">
            <div className="flex justify-end p-4 border-b">
              <SidebarTrigger />
            </div>
            <div className={cn("p-4 md:p-6", className)}>{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
