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
          await get().getAllowances(); // Tải lại danh sách sau khi xoá
          set({
                Allowances: get().Allowances.filter((d) => d.MaPC !== ID),

          });
          toast.success("Xoá Phụ cấp thành công");
        } catch (error) {
          console.error("Lỗi khi xoá Phụ cấp", error);
          toast.error("Không thể xoá Phụ cấp");
        }
      },
     // CREATE
    createAllowance: async (data) => {
        try {
            const newItem = await AllowanceServices.createAllowance(data);
            await get().getAllowances(); // Tải lại danh sách sau khi thêm
            set({
                Allowances: [...get().Allowances, newItem],
            });

            toast.success("Thêm phụ cấp thành công");
        } catch (error) {
            console.error("Lỗi khi thêm phụ cấp", error);
            toast.error("Không thể thêm phụ cấp");
        }
    },

    // UPDATE
    updateAllowance: async (ID: string, data) => {
        try {
            const updated = await AllowanceServices.updateAllowance(ID, data);
            await get().getAllowances(); // Tải lại danh sách sau khi cập nhật
            set({
                Allowances: get().Allowances.map((d) =>
                    d.MaPC === ID ? updated : d
                ),
            });

            toast.success("Cập nhật phụ cấp thành công");
        } catch (error) {
            console.error("Lỗi khi cập nhật phụ cấp", error);
            toast.error("Không thể cập nhật phụ cấp");
        }
    },
}));
