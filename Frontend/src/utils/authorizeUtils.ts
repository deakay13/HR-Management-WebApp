import type { Role } from "@/types/permissionTypes/rolesTypes";
import type { Permission } from "@/types/permissionTypes/permissionsTypes";

export const ROLE_ADMIN = "Quản Trị Viên";
export const ROLE_HR = "Nhân Sự";
export const ROLE_EMPLOYEE = "Nhân Viên";

export const PERMISSION = {
  CREATE: "Tạo",
  READ: "Đọc",
  UPDATE: "Sửa",
  DELETE: "Xoá",
} as const;

export const roleFromMaVT = (maVT?: string | null): Role | null => {
  switch (maVT) {
    case "VT001":
      return { MaVT: "VT001", TenVaiTro: ROLE_ADMIN };
    case "VT002":
      return { MaVT: "VT002", TenVaiTro: ROLE_HR };
    case "VT003":
      return { MaVT: "VT003", TenVaiTro: ROLE_EMPLOYEE };
    default:
      return null;
  }
};

export const normalizePermissions = (rawPermissions: unknown): Permission[] => {
  if (!Array.isArray(rawPermissions)) {
    return [];
  }

  return rawPermissions
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          MaQuyen: `AUTO_${index}`,
          TenQuyen: item,
        };
      }

      if (
        typeof item === "object" &&
        item !== null &&
        "TenQuyen" in item &&
        typeof item.TenQuyen === "string"
      ) {
        const maQuyen =
          "MaQuyen" in item && typeof item.MaQuyen === "string"
            ? item.MaQuyen
            : `AUTO_${index}`;

        return {
          MaQuyen: maQuyen,
          TenQuyen: item.TenQuyen,
        };
      }

      return null;
    })
    .filter((item): item is Permission => item !== null);
};

export const hasRole = (role: Role | null, required: string) =>
  role?.TenVaiTro === required;

export const hasPermission = (permissions: Permission[], required: string) =>
  permissions.some((p) => p.TenQuyen === required);

// New utility functions for CRUD permissions
export const canCreate = (permissions: Permission[]) =>
  hasPermission(permissions, PERMISSION.CREATE);

export const canRead = (permissions: Permission[]) =>
  hasPermission(permissions, PERMISSION.READ);

export const canUpdate = (permissions: Permission[]) =>
  hasPermission(permissions, PERMISSION.UPDATE);

export const canDelete = (permissions: Permission[]) =>
  hasPermission(permissions, PERMISSION.DELETE);

// Check if has any write permission (Create, Update, Delete)
export const canWrite = (permissions: Permission[]) =>
  canCreate(permissions) || canUpdate(permissions) || canDelete(permissions);
