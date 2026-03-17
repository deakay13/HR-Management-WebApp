import { AppSidebar } from "@/components/sidebarMenu"
import { SiteHeader } from "@/components/siteHeader"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";

const DashBoard = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <Outlet/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashBoard;
