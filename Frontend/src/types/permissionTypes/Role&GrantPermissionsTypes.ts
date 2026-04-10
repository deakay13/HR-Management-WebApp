import type { Role } from "@/types/permissionTypes/RolesTypes";
import type { GrantPermission } from "@/types/permissionTypes/GrantPermissionsTypes";

export type RoleWithPermissions = Role & {
    permissions: GrantPermission["permissions"];
};
