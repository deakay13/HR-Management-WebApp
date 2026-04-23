import { z } from "zod";

export const RoleInputSchema = z.object({
  MaVT: z
    .string()
    .min(1, "Mã vai trò không được để trống")
    .regex(/^VT\d{3,}$/, "Mã vai trò phải bắt đầu bằng VT và có ít nhất 3 chữ số"),
  TenVaiTro: z
    .string()
    .min(3, "Tên vai trò phải có ít nhất 3 ký tự")
    .max(50, "Tên vai trò không được vượt quá 50 ký tự"),
});

export type RoleInput = z.infer<typeof RoleInputSchema>;

// Khai báo schema bằng const
export const RoleSchema = z.object({
  MaVT: z.string(),
  TenVaiTro: z.string(),
});

// Sinh type từ schema
export type Role = z.infer<typeof RoleSchema>;

export interface RolesTypes {
  Roles: Role[];
  initializing: boolean;
  clearState: () => void;
  createRoles: (data: Role) => Promise<void>;
  getRoles: () => Promise<void>;
  updateRoles: (ID: string, data: Role) => Promise<void>;
  deleteRole: (ID: string) => Promise<void>;
}
