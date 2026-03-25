import { z } from "zod";

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
