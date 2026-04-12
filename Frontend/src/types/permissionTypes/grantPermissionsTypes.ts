import { z } from "zod";
import { PermissionSchema } from "./permissionsTypes";

// Schema cho một vai trò kèm danh sách quyền
export const GrantPermissionsSchema = z.object({
  MaVT: z.string(),
  TenVaiTro: z.string(),
  permissions: z.array(PermissionSchema),
});

export type GrantPermission = z.infer<typeof GrantPermissionsSchema>;

export const ChangePermissionSchema = z.object({
  MaVT: z.string(),
  oldQuyen: z.string(),
  newQuyen: z.string(),
});
export type ChangePermissionPayload = z.infer<typeof ChangePermissionSchema>;

export const AssignPermissionSchema = z.object({
  MaVT: z.string(),
  MaQuyen: z.array(z.string()),
});

export type AssignPermissionPayload = z.infer<typeof AssignPermissionSchema>;

export interface GrantPermissionsTypes {
  GrantPermissions: GrantPermission[];
  initializing: boolean;
  clearState: () => void;
  assigGrantPermissions: (data: AssignPermissionPayload) => Promise<void>;
  getGrantPermissions: () => Promise<void>;
  updateGrantPermissions: (
    ID: string,
    oldQuyen: string,
    newQuyen: string,
  ) => Promise<void>;
  deleteAllGrantPermissions: (ID: string) => Promise<void>;
  deleteOneGrantPermissions: (IDR: string, IDP: string) => Promise<void>;
}
