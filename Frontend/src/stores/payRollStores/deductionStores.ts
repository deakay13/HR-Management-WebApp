import { create } from "zustand";
import { toast } from "sonner";
import { DeductionServices } from "@/services/payRollServices/deductionServices";
import type { DeductionsTypes } from "@/types/payRollTypes/deductionTypes";

export const useDeductionStore = create<DeductionsTypes>((set) => ({
    Deductions: [],
    initializing: true,
    clearState: () => {
        set({ Deductions: [] });
    },

    getDeductions: async () => {
        set({ initializing: true });
        try {
            const data = await DeductionServices.getDeductions();
            set({ Deductions: data });
            toast.success("Lấy danh sách Deductions thành công");
        } catch (error) {
            console.error("Lỗi khi lấy danh sách Deductions", error);
            toast.error("Không thể lấy danh sách Deductions");
        } finally {
            set({ initializing: false });
        }
    },
}));
