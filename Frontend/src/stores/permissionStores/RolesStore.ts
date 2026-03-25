import { create } from "zustand";
import { toast } from "sonner";
import { RolesServices } from "@/services/permissionServices/RolesServices";
import type { RolesTypes } from "@/types/permissionTypes/RolesTypes";

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
            toast.error("Không thể thể vai trò");
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
            const updated = await RolesServices.updateRoles(ID, data);
            await get().getRoles();
            set({
                Roles: get().Roles.map((Rol) => (Rol.MaVT === ID ? updated : Rol)),
            });
            toast.success("Cập nhật Vai Trò thành công");
        } catch (error) {
            console.error("Lỗi khi cập nhật Vai Trò", error);
            toast.error("Không thể cập nhật Vai Trò");
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
