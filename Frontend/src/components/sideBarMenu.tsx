import * as React from "react";
import {
  type Icon,
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
import { NavDocuments } from "@/components/nav-menu/NavManagements";
import { NavMain } from "@/components/nav-menu/NavWorkspaces";
import { NavSecondary } from "@/components/nav-menu/NavSystems";
import { NavUserMini } from "@/components/nav-menu/NavUserMini";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { hasRole, ROLE_EMPLOYEE, ROLE_HR } from "@/utils/authorizeUtiles";
import { Link } from "react-router-dom";

type SidebarItem = {
  name: string;
  url: string;
  icon: Icon;
  disabled?: boolean;
};

const data = {
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
  const role = useAuthorizeStore((state) => state.role);

  const isEmployee = hasRole(role, ROLE_EMPLOYEE);
  const isHR = hasRole(role, ROLE_HR);

  const managementItems: SidebarItem[] = data.NavManagements.map((item) => {
    if (isEmployee) {
      return { ...item, disabled: true };
    }

    if (isHR && item.name === "Quyền") {
      return { ...item, disabled: true };
    }

    return item;
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link to="/PortalPage/DashBoard">
                <MyIcon className="size-5!" />
                <span className="text-base font-semibold">HR-Systerm</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navWorkspaces} />
        <NavDocuments items={managementItems} />
        <NavSecondary items={data.navSystems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUserMini />
      </SidebarFooter>
    </Sidebar>
  );
}
