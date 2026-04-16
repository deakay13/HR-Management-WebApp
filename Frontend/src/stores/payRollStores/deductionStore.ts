import { create } from "zustand";
import { toast } from "sonner";
import { DeductionServices } from "@/services/payRollServices/deductionServices";
import type { DeductionTypes } from "@/types/payRollTypes/deductionTypes";

export const useDeductionStore = create<DeductionTypes>((set, get) => ({
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
      toast.success("Xoá khấu trừ thành công");
    } catch (error) {
      console.error("Lỗi khi xoá Phụ cấp", error);
      toast.error("Không thể xoá khấu trừ");
    }
  },
  // CREATE
  createDeduction: async (data) => {
    try {
      const newItem = await DeductionServices.createDeduction(data);
      set({
        Deductions: [...get().Deductions, newItem],
      });
      toast.success("Thêm khấu trừ thành công");
    } catch (error) {
      console.error("Lỗi khi thêm Khấu trừ", error);
      toast.error("Không thể thêm khấu trừ");
      throw error;
    }
  },

  // UPDATE
  updateDeduction: async (ID: string, data) => {
    try {
      const updated = await DeductionServices.updateDeduction(ID, data);
      set({
        Deductions: get().Deductions.map((d) => (d.MaKT === ID ? updated : d)),
      });
      toast.success("Lưu thay đổi khấu trừ thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật Khấu trừ", error);
      toast.error("Không thể lưu thay đổi khấu trừ");
      throw error;
    }
  },
}));
