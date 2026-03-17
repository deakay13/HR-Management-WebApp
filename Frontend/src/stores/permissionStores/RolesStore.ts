import { create } from "zustand";
import { toast } from "sonner";
import { RolesServices } from "@/services/permissionServices/RolesServices";
import type { RolesTypes } from "@/types/permissionTypes/RolesTypes";

export const useRolesStore = create<RolesTypes>((set) => ({
    Roles: [],
    initializing: true,
    clearState: () => {
        set({ Roles: [] });
    },

    getRoles: async () => {
        set({ initializing: true });
        try {
            const data = await RolesServices.getRoles();
            set({ Roles: data });
            toast.success("Lấy danh sách Roles thành công");
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tài khoản", error);
            toast.error("Không thể lấy danh sách tài khoản");
        } finally {
            set({ initializing: false });
        }
    },
}));
