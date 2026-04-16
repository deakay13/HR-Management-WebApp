import { create } from "zustand";
import { toast } from "sonner";
import { RolesServices } from "@/services/permissionServices/rolesServices";
import type { RolesTypes } from "@/types/permissionTypes/rolesTypes";

export const useRolesStore = create<RolesTypes>()((set, get) => ({
    Roles: [],
    initializing: true,

    clearState: () => {
        set({ Roles: [] });
    },
    createRoles: async (data) => {
        set({ initializing: true });
        try {
            const newdata = await RolesServices.createRoles(data);
            await get().getRoles();
            set({
                Roles: [...get().Roles, newdata],
            });
            toast.success("Thêm Vai trò thành công");
        } catch (error) {
            console.error("Lỗi khi tạo Vai Trò", error);
            toast.error("Không thể tạo vai trò");
        } finally {
            set({ initializing: false });
        }
    },
    getRoles: async () => {
        set({ initializing: true });
        try {
            const data = await RolesServices.getRoles();
            set({ Roles: data });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách Vai trò", error);
            toast.error("Không thể lấy danh sách Vai trò");
        } finally {
        set({ initializing: false });
        }
    },
    updateRoles: async (ID: string, data) => {
        try {
            await RolesServices.updateRoles(ID, data);
            await get().getRoles();
            toast.success("Lưu thay đổi vai trò thành công");
        } catch (error) {
            console.error("Lỗi khi cập nhật Vai Trò", error);
            toast.error("Không thể lưu thay đổi vai trò");
        }
    },
    deleteRole: async (ID: string) => {
        try {
            await RolesServices.deleteRole(ID);
            await get().getRoles();
            set({
                Roles: get().Roles.filter((r) => r.MaVT !== ID),
            });
            toast.success("Xoá Vai trò thành công");
        } catch (error) {
            console.error("Lỗi khi xoá Vai trò", error);
            toast.error("Không thể xoá Vai trò");
        }
    },
}));
