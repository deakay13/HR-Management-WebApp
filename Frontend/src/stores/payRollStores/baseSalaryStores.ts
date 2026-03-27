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
            toast.success("Lấy danh sách BaseSalaries thành công");
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
     // CREATE
        createBaseSalary: async (data) => {
            try {
                const newItem = await BaseSalaryServices.createBaseSalary(data);
                await get().getBaseSalaries(); // Tải lại danh sách sau khi thêm
                set({
                    BaseSalaries: [...get().BaseSalaries, newItem],
                });
    
                toast.success("Thêm Lương cơ bản thành công");
            } catch (error) {
                console.error("Lỗi khi thêm Lương cơ bản", error);
                toast.error("Không thể thêm Lương cơ bản");
            }
        },
    
        // UPDATE
        updateBaseSalary: async (ID: string, data) => {
            try {
                const updated = await BaseSalaryServices.updateBaseSalary(ID, data);
                await get().getBaseSalaries(); // Tải lại danh sách sau khi cập nhật
                set({
                    BaseSalaries: get().BaseSalaries.map((d) =>
                        d.MaLCB === ID ? updated : d
                    ),
                });
    
                toast.success("Cập nhật Lương cơ bản thành công");
            } catch (error) {
                console.error("Lỗi khi cập nhật Lương cơ bản", error);
                toast.error("Không thể cập nhật Lương cơ bản");
            }
        },
}));
