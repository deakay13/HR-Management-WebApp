import { create } from "zustand";
import { toast } from "sonner";
import { BaseSalaryServices } from "@/services/payRollServices/baseSalaryServices";
import type { BaseSalaryTypes } from "@/types/payRollTypes/baseSalaryTypes";

export const useBaseSalaryStore = create<BaseSalaryTypes>((set, get) => ({
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
      toast.error("Không thể tải danh sách lương cơ bản");
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
      set({
        BaseSalaries: [...get().BaseSalaries, newItem],
      });
      toast.success("Thêm Lương cơ bản thành công");
    } catch (error) {
      console.error("Lỗi khi thêm Lương cơ bản", error);
      toast.error("Không thể thêm Lương cơ bản");
      throw error;
    }
  },

  // UPDATE
  updateBaseSalary: async (ID: string, data) => {
    try {
      const updated = await BaseSalaryServices.updateBaseSalary(ID, data);
      set({
        BaseSalaries: get().BaseSalaries.map((d) =>
          d.MaLCB === ID ? updated : d,
        ),
      });
      toast.success("Lưu thay đổi lương cơ bản thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật Lương cơ bản", error);
      toast.error("Không thể lưu thay đổi lương cơ bản");
      throw error;
    }
  },
}));
