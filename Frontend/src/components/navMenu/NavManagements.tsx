"use client";

import { type Icon } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

export function NavDocuments({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: Icon;
    disabled?: boolean;
  }[];
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t("Phân Quyền")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.url);
          return (
            <SidebarMenuItem key={item.name}>
              {item.disabled ? (
                <SidebarMenuButton
                  disabled
                  className="cursor-not-allowed opacity-50"
                >
                  <item.icon />
                  <span>{t(item.name)}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton 
                  asChild
                  isActive={isActive}
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{t(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
