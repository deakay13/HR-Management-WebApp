import {
  IconBellRinging,
  IconDotsVertical,
  IconId,
  IconLogout2,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function NavUserMini() {
  const { isMobile } = useSidebar();
  const { signOut, account, avatarUrl } = useAuthStore();
  const { role } = useAuthorizeStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!account) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  const roleName = role?.TenVaiTro ?? "Unknown";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={avatarUrl ?? ""}
                  alt={account.TenTaiKhoan}
                  className="object-cover rounded-lg"
                />
                <AvatarFallback className="rounded-lg">
                  {(account.NhanVien?.HoVaTen || account.TenTaiKhoan)
                    ?.charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {account.NhanVien?.HoVaTen || account.TenTaiKhoan}
                </span>
                <span className="opacity-80 truncate text-xs">{roleName}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={avatarUrl ?? ""}
                    alt={account.TenTaiKhoan}
                    className="object-cover rounded-lg"
                  />
                  <AvatarFallback className="rounded-lg">
                    {(account.NhanVien?.HoVaTen || account.TenTaiKhoan)
                      ?.charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {account.NhanVien?.HoVaTen || account.TenTaiKhoan}
                  </span>
                  <span className="opacity-80 truncate text-xs">
                    {roleName}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/PortalPage/Profile")}>
                <IconId />
                {t("Hồ Sơ")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconBellRinging />
                {t("Thông Báo")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              variant="destructive"
              className="text-red-500 hover:text-red-500 dark:text-red-500 focus:bg-red-500! focus:text-white!"
            >
              <IconLogout2 />
              {t("Đăng Xuất")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
