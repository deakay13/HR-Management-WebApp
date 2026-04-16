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
import { Link } from "react-router-dom";

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
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t("Phân Quyền")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            {item.disabled ? (
              <SidebarMenuButton
                disabled
                className="cursor-not-allowed opacity-50">
                <item.icon />
                <span>{t(item.name)}</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{t(item.name)}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
