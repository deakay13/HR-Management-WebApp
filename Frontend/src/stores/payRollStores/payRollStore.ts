import { create } from "zustand";
import { toast } from "sonner";
import { PayRollServices } from "@/services/payRollServices/payRollServices";
import type { PayRollTypes } from "@/types/payRollTypes/payRollTypes";

export const usePayRollStore = create<PayRollTypes>((set,get) => ({
    PayRolls: [],
    initializing: true,

    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    searchParams: {},
    
    clearState: () => {
        set({ PayRolls: [] });
    },

    getPayRolls: async () => {
        set({ initializing: true }); 
        try {
            const response = await PayRollServices.getPayRolls();
            
            set({ 
                PayRolls: response?.data || [],
                totalItems: response?.totalItems || 0,
                totalPages: response?.totalPages || 0
            });
        } catch (error) {
            console.error("Lỗi:", error);
        } finally {
            set({ initializing: false });
        }
    },
    deletePayRoll: async (ID: string) => {
        try {
            await PayRollServices.deletePayRoll(ID);
            set({
                PayRolls: get().PayRolls.filter((d) => d.MaBL !== ID),
            });
            toast.success("Xoá Bảng lương thành công");
        } catch (error) {
            console.error("Lỗi khi xoá Bảng lương", error);
            toast.error("Không thể xoá Bảng lương");
        }
        },
    // CREATE
    createPayRolls: async (data) => {
        try {
            await PayRollServices.createPayRoll(data);
            await get().getPayRolls(); // Tải lại danh sách sau khi thêm
            toast.success("Thêm Bảng lương thành công");
        } catch (error) {
            console.error("Lỗi khi thêm Bảng lương", error);
            toast.error("Không thể thêm Bảng lương");
        }
    },
    // UPDATE
    updatePayRoll: async (ID: string, data) => {
            try {
                await PayRollServices.updatePayRoll(ID, data);
                await get().getPayRolls(); // Tải lại danh sách sau khi cập nhật
                toast.success("Cập nhật Bảng lương thành công");
            } catch (error) {
                console.error("Lỗi khi cập nhật Bảng lương", error);
                toast.error("Không thể cập nhật Bảng lương");
                    }
        },
        searchPayRolls: async (params) => {
            try {
                const res = await PayRollServices.searchPayRolls(params);

                set({
                    PayRolls: res.data,
                    totalItems: res.totalItems,
                    totalPages: res.totalPages,
                    currentPage: res.currentPage,
                    searchParams: params
                });

            } catch (error) {
                console.error("Lỗi search payroll", error);
                toast.error("Không thể tìm kiếm bảng lương");
            } finally {
                set({ initializing: false });
            }
        },
}));
