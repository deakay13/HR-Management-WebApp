import { create } from "zustand";
import { toast } from "sonner";
import { BaseSalaryServices } from "@/services/payRollServices/baseSalaryServices";
import type { BaseSalaryTypes } from "@/types/payRollTypes/baseSalaryTypes";

export const useBaseSalaryStore = create<BaseSalaryTypes>((set,get) => ({
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
        } catch (error) {
            console.error("Lỗi khi lấy danh sách BaseSalaries", error);
            toast.error("Không thể lấy danh sách BaseSalaries");
        } finally {
            set({ initializing: false });
        }
    },
     deleteBaseSalary: async (ID: string) => {
            try {
              await BaseSalaryServices.deleteBaseSalary(ID);
              set({
                    BaseSalaries: get().BaseSalaries.filter((d) => d.MaLCB !== ID),
              });
              toast.success("Xoá Lương cơ bản thành công");
            } catch (error) {
              console.error("Lỗi khi xoá Lương cơ bản", error);
              toast.error("Không thể xoá Lương cơ bản");
            }
          },
}));
