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
  oldQuyen: z.string().min(1, "Vui lòng chọn quyền cũ"),
  newQuyen: z.string().min(1, "Vui lòng chọn quyền mới"),
});

export const RemovePermissionSchema = z.object({
  MaVT: z.string(),
  MaQuyen: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một quyền để xoá"),
});

export const AssignPermissionSchema = z.object({
  MaVT: z.string(),
  MaQuyen: z.array(z.string()),
});

export type AssignPermissionPayload = z.infer<typeof AssignPermissionSchema>;
export type ChangePermissionPayload = z.infer<typeof ChangePermissionSchema>;
export type RemovePermissionPayload = z.infer<typeof RemovePermissionSchema>;

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
