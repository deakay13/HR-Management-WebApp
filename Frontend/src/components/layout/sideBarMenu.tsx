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
import MyIcon from "@/assets/logo.svg";
import { NavDocuments } from "@/components/navMenu/NavManagements";
import { NavMain } from "@/components/navMenu/NavWorkspaces";
import { NavSecondary } from "@/components/navMenu/NavSystems";
import { NavUserMini } from "@/components/navMenu/NavUserMini";
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
import { hasRole, ROLE_EMPLOYEE, ROLE_HR } from "@/utils/authorizeUtils";
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

// Items hidden from Employee role in navWorkspaces
const EMPLOYEE_HIDDEN_WORKSPACE_ITEMS = [
  "Nhân Viên",
  "Phòng Ban",
  "Giờ Làm",
  "Lương Cơ Bản",
  "Phụ Cấp",
  "Khấu Trừ",
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const role = useAuthorizeStore((state) => state.role);

  const isEmployee = hasRole(role, ROLE_EMPLOYEE);

  // Filter workspace items — Employee only sees Dashboard, Contract, Payroll
  const workspaceItems = data.navWorkspaces.filter((item) => {
    if (isEmployee && EMPLOYEE_HIDDEN_WORKSPACE_ITEMS.includes(item.name)) {
      return false;
    }
    return true;
  });

  const isHR = hasRole(role, ROLE_HR);

  // Management section rules:
  // - Employee: hide entire section
  // - HR: hide "Quyền" (Permissions) item only
  // - Admin: see everything
  const managementItems: SidebarItem[] = isEmployee
    ? []
    : data.NavManagements.filter((item) => {
        if (isHR && item.name === "Quyền") return false;
        return true;
      });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/PortalPage/DashBoard">
                <img src={MyIcon} className="size-5!" alt="Logo" />
                <span className="text-base font-semibold">HR-Systerm</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={workspaceItems} />
        {managementItems.length > 0 && <NavDocuments items={managementItems} />}
        <NavSecondary items={data.navSystems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUserMini />
      </SidebarFooter>
    </Sidebar>
  );
}
