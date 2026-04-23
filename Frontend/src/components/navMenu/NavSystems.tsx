"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    name: string;
    url: string;
    icon: Icon;
    disabled?: boolean;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { t } = useTranslation();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>{t("Quản Trị Hệ Thống")}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.name}>
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
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
