import { create } from "zustand";
import { toast } from "sonner";
import { AllowanceServices } from "@/services/payRollServices/allowanceServices";
import type { AllowanceTypes } from "@/types/payRollTypes/allowanceTypes";

export const useAllowanceStore = create<AllowanceTypes>((set,get) => ({
    Allowances: [],
    initializing: true,
    clearState: () => {
        set({ Allowances: [] });
    },

    getAllowances: async () => {
        set({ initializing: true });
        try {
            const data = await AllowanceServices.getAllowances();
            set({ Allowances: data });
            toast.success("Lấy danh sách Allowances thành công");
        } catch (error) {
            console.error("Lỗi khi lấy danh sách Allowances", error);
            toast.error("Không thể lấy danh sách Allowances");
        } finally {
            set({ initializing: false });
        }
    },
    deleteAllowance: async (ID: string) => {
        try {
          await AllowanceServices.deleteAllowance(ID);
          set({
                Allowances: get().Allowances.filter((d) => d.MaPC !== ID),
          });
          toast.success("Xoá Phụ cấp thành công");
        } catch (error) {
          console.error("Lỗi khi xoá Phụ cấp", error);
          toast.error("Không thể xoá Phụ cấp");
        }
      },
}));
