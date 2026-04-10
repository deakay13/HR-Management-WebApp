import type { Role } from "@/types/permissionTypes/RolesTypes";
import type { Permission } from "@/types/permissionTypes/PermissionsTypes";

export interface AuthorizeTypes {
  role: Role | null;
  permissions: Permission[];
  initializing: boolean;
  setRole: (role: Role | null) => void;
  setPermissions: (permissions: Permission[]) => void;
  setInitializing: (initializing: boolean) => void;
  clearState: () => void;
}
