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
  getRoles: () => Promise<void>;
  deleteRole: (ID: string) => Promise<void>;
}
