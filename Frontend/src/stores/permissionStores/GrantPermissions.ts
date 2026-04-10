import { create } from "zustand";
import { toast } from "sonner";
import { GrantPermissionsServices } from "@/services/permissionServices/GrantPermissionsServices";
import type { GrantPermissionsTypes } from "@/types/permissionTypes/GrantPermissionsTypes";

export const useGrantPermissionsStore = create<GrantPermissionsTypes>()(
  (set, get) => ({
    GrantPermissions: [],
    initializing: true,

    clearState: () => {
      set({ GrantPermissions: [] });
    },

    assigGrantPermissions: async (data) => {
      set({ initializing: true });
      try {
        await GrantPermissionsServices.assigGrantPermissions(data);

        // Refresh lại danh sách quyền
        await get().getGrantPermissions();

        toast.success("Cấp quyền thành công");
      } catch (error) {
        console.error("Lỗi khi cấp quyền", error);
        toast.error("Không thể cấp quyền");
      } finally {
        set({ initializing: false });
      }
    },
    getGrantPermissions: async () => {
      set({ initializing: true });
      try {
        const data = await GrantPermissionsServices.getGrantPermissions();
        set({ GrantPermissions: data });
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quyền", error);
        toast.error("Không thể lấy danh sách quyền");
      } finally {
        set({ initializing: false });
      }
    },
    updateGrantPermissions: async (
      MaVT: string,
      oldQuyen: string,
      newQuyen: string,
    ) => {
      try {
        const payload = { MaVT, oldQuyen, newQuyen };
        await GrantPermissionsServices.updateGrantPermissions(MaVT, payload);

        toast.success("Thay đổi Quyền thành công");
      } catch (error) {
        console.error("Lỗi khi cập nhật Quyền", error);
        toast.error("Không thể cập nhật Quyền");
      }
    },
    deleteAllGrantPermissions: async (ID: string) => {
      try {
        await GrantPermissionsServices.deleteAllGrantPermissions(ID);
        // Refresh to get updated data from server
        await get().getGrantPermissions();
        toast.success("Xoá tất cả quyền được cấp thành công");
      } catch (error) {
        console.error("Lỗi khi xoá Vai trò được cấp quyền", error);
        toast.error("Không thể xoá Vai trò được cấp quyền");
      }
    },
    deleteOneGrantPermissions: async (IDR: string, IDP: string) => {
      try {
        const data = await GrantPermissionsServices.deleteOneGrantPermissions(
          IDR,
          IDP,
        );
        set({
          GrantPermissions: get().GrantPermissions.map((gp) =>
            gp.MaVT === IDR ? { ...gp, permissions: data.permissions } : gp,
          ),
        });
      } catch (error) {
        console.error("Lỗi khi xoá quyền khỏi vai trò", error);
        toast.error("Không thể xoá quyền khỏi vai trò");
      }
    },
  }),
);
