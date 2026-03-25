import { create } from "zustand";
import { toast } from "sonner";
import { HoursServices } from "@/services/payRollServices/hoursServices";
import type { HoursTypes } from "@/types/payRollTypes/hoursTypes";
export const useHoursStore = create<HoursTypes>((set,get) => ({
    Hours: [],
    initializing: true,
    clearState: () => {
        set({ Hours: [] });
    },

    getHours: async () => {
        set({ initializing: true });
        try {
            const data = await HoursServices.getHours();
            set({ Hours: data });
            toast.success("Lấy danh sách Hours thành công");
        } catch (error) {
            console.error("Lỗi khi lấy danh sách Hours", error);
            toast.error("Không thể lấy danh sách Hours");
        } finally {
            set({ initializing: false });
        }
    },
     deleteHours: async (ID: string) => {
            try {
              await HoursServices.deleteHour(ID);
              set({
                    Hours: get().Hours.filter((d) => d.MaGL !== ID),
              });
              toast.success("Xoá Giờ làm thêm thành công");
            } catch (error) {
              console.error("Lỗi khi xoá Giờ làm thêm", error);
              toast.error("Không thể xoá Giờ làm thêm");
            }
          },
}));