import { create } from "zustand";
import { toast } from "sonner";
import { BaseSalaryServices } from "@/services/payRollServices/baseSalaryServices";
import type { BaseSalaryTypes } from "@/types/payRollTypes/baseSalaryTypes";

export const useBaseSalaryStore = create<BaseSalaryTypes>((set) => ({
    BaseSalaries: [],
    initializing: true,
    clearState: () => {
        set({ BaseSalaries: [] });
    },

    getBaseSalaries: async () => {
        set({ initializing: true });
        try {
            const data = await BaseSalaryServices.getBaseSalaries();
            set({ BaseSalaries: data });
            toast.success("Lấy danh sách BaseSalaries thành công");
        } catch (error) {
            console.error("Lỗi khi lấy danh sách BaseSalaries", error);
            toast.error("Không thể lấy danh sách BaseSalaries");
        } finally {
            set({ initializing: false });
        }
    },
}));
