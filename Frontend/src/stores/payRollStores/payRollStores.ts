import { create } from "zustand";
import { toast } from "sonner";
import { PayRollServices } from "@/services/payRollServices/payRollServices";
import type { PayRollTypes } from "@/types/payRollTypes/payRollTypes";

export const usePayRollStore = create<PayRollTypes>((set,get) => ({
    PayRolls: [],
    initializing: true,
    clearState: () => {
        set({ PayRolls: [] });
    },

    getPayRolls: async () => {
        set({ initializing: true });
        try {
            const data = await PayRollServices.getPayRolls();
            set({ PayRolls: data });
            toast.success("Lấy danh sách PayRolls thành công");
        } catch (error) {
            console.error("Lỗi khi lấy danh sách PayRolls", error);
            toast.error("Không thể lấy danh sách PayRolls");
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
}));
