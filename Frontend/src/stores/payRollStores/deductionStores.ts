import { create } from "zustand";
import { toast } from "sonner";
import { DeductionServices } from "@/services/payRollServices/deductionServices";
import type { DeductionTypes } from "@/types/payRollTypes/deductionTypes";

export const useDeductionStore = create<DeductionTypes>((set,get) => ({
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
     deleteDeduction: async (ID: string) => {
            try {
              await DeductionServices.deleteDeduction(ID);
              set({
                    Deductions: get().Deductions.filter((d) => d.MaKT !== ID),
              });
              toast.success("Xoá Phụ cấp thành công");
            } catch (error) {
              console.error("Lỗi khi xoá Phụ cấp", error);
              toast.error("Không thể xoá Phụ cấp");
            }
          },
}));
