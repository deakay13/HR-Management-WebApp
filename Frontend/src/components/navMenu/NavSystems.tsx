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
import { Link } from "react-router-dom";

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
  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>{t("Quản Trị Hệ Thống")}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{t(item.name)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
