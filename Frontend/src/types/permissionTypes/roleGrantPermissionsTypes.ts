import type { Role } from "@/types/permissionTypes/rolesTypes";
import type { GrantPermission } from "@/types/permissionTypes/grantPermissionsTypes";

export type RoleWithPermissions = Role & {
  permissions: GrantPermission["permissions"];
};
