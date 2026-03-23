import { create } from "zustand";
import { toast } from "sonner";
import { PermissionsServices } from "@/services/permissionServices/PermissionsServices";
import type { PermissionsTypes } from "@/types/permissionTypes/PermissionsTypes";

export const usePermissionsStore = create<PermissionsTypes>()((set,get) => ({
  Permissions: [],
  initializing: true,

  clearState: () => {
    set({ Permissions: [] });
  },

  getPermissions: async () => {
    set({ initializing: true });
    try {
      const data = await PermissionsServices.getPermissions();
      set({ Permissions: data });
      toast.success("Lấy danh sách Roles thành công");
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản", error);
      toast.error("Không thể lấy danh sách tài khoản");
    } finally {
      set({ initializing: false });
    }
  },
  deletePermission: async (ID: string) => {
    try {
      await PermissionsServices.deletePermission(ID);
      set({
        Permissions: get().Permissions.filter((p) => p.MaQuyen !== ID),
      });
      toast.success("Xoá Quyền thành công");
    } catch (error) {
      console.error("Lỗi khi xoá Quyền", error);
      toast.error("Không thể xoá Quyền");
    }
  },
}));
