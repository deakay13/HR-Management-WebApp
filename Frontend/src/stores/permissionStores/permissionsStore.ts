import i18n from "@/i18n";
import { create } from "zustand";
import { toast } from "sonner";
import { PermissionsServices } from "@/services/permissionServices/permissionsServices";
import type { PermissionsTypes } from "@/types/permissionTypes/permissionsTypes";

export const usePermissionsStore = create<PermissionsTypes>()((set, get) => ({
  Permissions: [],
  initializing: true,

  clearState: () => {
    set({ Permissions: [] });
  },

  createPermissions: async (data) => {
    set({ initializing: true });
    try {
      const newdata = await PermissionsServices.createPermissions(data);
      await get().getPermissions();
      set({
        Permissions: [...get().Permissions, newdata],
      });
      toast.success(i18n.t("Thêm quyền thành công"));
    } catch (error) {
      console.error("Lỗi khi tạo quyền", error);
      // Global axios interceptor handles error toast
    } finally {
      set({ initializing: false });
    }
  },
  getPermissions: async () => {
    set({ initializing: true });
    try {
      const data = await PermissionsServices.getPermissions();
      set({ Permissions: data });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quyền", error);
      // Global axios interceptor handles error toast
    } finally {
      set({ initializing: false });
    }
  },
  updatePermissions: async (ID: string, data) => {
    try {
      const updated = await PermissionsServices.updatePermissions(ID, data);
      await get().getPermissions();
      set({
        Permissions: get().Permissions.map((per) =>
          per.MaQuyen === ID ? updated : per,
        ),
      });
      toast.success(i18n.t("Lưu thay đổi quyền thành công"));
    } catch (error) {
      console.error("Lỗi khi cập nhật phụ cấp", error);
      // Global axios interceptor handles error toast
    }
  },
  deletePermission: async (ID: string) => {
    try {
      await PermissionsServices.deletePermission(ID);
      await get().getPermissions();
      set({
        Permissions: get().Permissions.filter((p) => p.MaQuyen !== ID),
      });
      toast.success(i18n.t("Xoá Quyền thành công"));
    } catch (error) {
      console.error("Lỗi khi xoá Quyền", error);
      // Global axios interceptor handles error toast
    }
  },
}));
