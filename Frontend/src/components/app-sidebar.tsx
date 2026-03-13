import * as React from "react"
import {
  IconLayoutDashboard,
  IconFileCertificate,
  IconSettings,
  IconUsers,
  IconBuilding,
  IconClock,
  IconCurrencyDollar,
  IconCash,
  IconCoin,
  IconScale,
  IconUserCircle,
  IconShield,
  IconLock,
  IconHelpCircle,
} from "@tabler/icons-react";
import MyIcon from "@/assets/logo.svg?react";
import { NavDocuments } from "@/components/nav-menu/NavManagements"
import { NavMain } from "@/components/nav-menu/NavWorkspaces"
import { NavSecondary } from "@/components/nav-menu/NavSystems"
import { NavUser } from "@/components/nav-menu/NavUserMini"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navWorkspaces: [
    {
      name: "Trang tổng quát",
      url: "/PortalPage/DashBoard",
      icon: IconLayoutDashboard,
    },
    {
      name: "Hợp Đồng",
      url: "/PortalPage/Contract",
      icon: IconFileCertificate,
    },
    {
      name: "Nhân Viên",
      url: "/PortalPage/Employee",
      icon: IconUsers,
    },
    {
      name: "Phòng Ban",
      url: "/PortalPage/Department",
      icon: IconBuilding,
    },
    {
      name: "Giờ Làm",
      url: "/PortalPage/WorkingHours",
      icon: IconClock,
    },
    {
      name: "Bảng Lương",
      url: "/PortalPage/Payroll",
      icon: IconCurrencyDollar,
    },
    {
      name: "Lương Cơ Bản",
      url: "/PortalPage/BasicSalary",
      icon: IconCash,
    },
    {
      name: "Phụ Cấp",
      url: "/PortalPage/Allowances",
      icon: IconCoin,
    },
    {
      name: "Khấu Trừ",
      url: "/PortalPage/Deductions",
      icon: IconScale,
    },
  ],
  NavManagements: [
    {
      name: "Tài Khoản",
      url: "/PortalPage/Accounts",
      icon: IconUserCircle,
    },
    {
      name: "Vai Trò",
      url: "/PortalPage/Roles",
      icon: IconShield,
    },
    {
      name: "Quyền",
      url: "/PortalPage/Permissions",
      icon: IconLock,
    },
  ],
  navSystems: [
    {
      name: "Cài Đặt",
      url: "/PortalPage/Settings",
      icon: IconSettings,
    },
    {
      name: "Hỗ trợ",
      url: "/PortalPage/GetHelp",
      icon: IconHelpCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <MyIcon className="size-5!" />
                <span className="text-base font-semibold">HR-Systerm</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navWorkspaces} />
        <NavDocuments items={data.NavManagements} />
        <NavSecondary items={data.navSystems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
