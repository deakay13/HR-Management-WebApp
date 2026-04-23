import { z } from "zod";

export const PermissionSchema = z.object({
  MaQuyen: z.string().min(1, "Vui lòng nhập mã quyền"),
  TenQuyen: z.string().min(3, "Tên quyền phải có ít nhất 3 ký tự"),
});

export type Permission = z.infer<typeof PermissionSchema>;
export type PermissionInput = Permission;

export interface PermissionsTypes {
  Permissions: Permission[];
  initializing: boolean;
  clearState: () => void;
  createPermissions: (data: Permission) => Promise<void>;
  getPermissions: () => Promise<void>;
  updatePermissions: (ID: string, data: Permission) => Promise<void>;
  deletePermission: (ID: string) => Promise<void>;
}
