import { z } from "zod";

export const PermissionSchema = z.object({
  MaQuyen: z.string(),
  TenQuyen:  z.string(),
});

export type Permission = z.infer<typeof PermissionSchema>;

export interface PermissionsTypes {
  Permissions: Permission[];
  initializing: boolean;
  clearState: () => void;
  getPermissions: () => Promise<void>;
  deletePermission: (ID: string) => Promise<void>;
}
