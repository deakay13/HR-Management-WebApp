import { useRolesStore } from "@/stores/permissionStores/RolesStore";
import { useGrantPermissionsStore } from "@/stores/permissionStores/GrantPermissions";
import { usePermissionsStore } from "@/stores/permissionStores/PermissionsStore";
import { useAuthStore } from "@/stores/authStores/useAuthStore";
import { useEffect, useMemo } from "react";
import { RolesTable } from "../Table/managementsTable/RolesTable";
import type { RoleWithPermissions } from "@/types/permissionTypes/Role&GrantPermissionsTypes";

const AccountsComponents = () => {
  const { Roles, initializing: rolesLoading, getRoles } = useRolesStore();
  const {
    GrantPermissions,
    initializing: gpLoading,
    getGrantPermissions,
  } = useGrantPermissionsStore();
  const { getPermissions } = usePermissionsStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (accessToken) {
        await Promise.all([
          getRoles(),
          getGrantPermissions(),
          getPermissions(),
        ]);
      }
    };
    init();
  }, [accessToken, getRoles, getGrantPermissions, getPermissions]);

  // Merge Roles with GrantPermissions to produce RoleWithPermissions[]
  const mergedData: RoleWithPermissions[] = useMemo(() => {
    return Roles.map((role) => {
      const gp = GrantPermissions.find((g) => g.MaVT === role.MaVT);
      return {
        ...role,
        permissions: gp?.permissions ?? [],
      };
    });
  }, [Roles, GrantPermissions]);

  const initializing = rolesLoading || gpLoading;

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <RolesTable data={mergedData} />
      </div>
    </div>
  );
};

export default AccountsComponents;
