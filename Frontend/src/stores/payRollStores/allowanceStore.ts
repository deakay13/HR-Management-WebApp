import i18n from "@/i18n";
import { create } from "zustand";
import { toast } from "sonner";
import { AllowanceServices } from "@/services/payRollServices/allowanceServices";
import type { AllowanceTypes } from "@/types/payRollTypes/allowanceTypes";

export const useAllowanceStore = create<AllowanceTypes>((set, get) => ({
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
    } catch (error) {
      console.error("Lỗi khi lấy danh sách Allowances", error);
      toast.error(i18n.t("Không thể lấy danh sách Allowances"));
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
      toast.success(i18n.t("Xoá Phụ cấp thành công"));
    } catch (error) {
      console.error("Lỗi khi xoá Phụ cấp", error);
      toast.error(i18n.t("Không thể xoá Phụ cấp"));
    }
  },
  // CREATE
  createAllowance: async (data) => {
    try {
      const newItem = await AllowanceServices.createAllowance(data);
      set({
        Allowances: [...get().Allowances, newItem],
      });
      toast.success(i18n.t("Thêm phụ cấp thành công"));
    } catch (error) {
      console.error("Lỗi khi thêm phụ cấp", error);
      toast.error(i18n.t("Không thể thêm phụ cấp"));
      throw error;
    }
  },

  // UPDATE
  updateAllowance: async (ID: string, data) => {
    try {
      const updated = await AllowanceServices.updateAllowance(ID, data);
      set({
        Allowances: get().Allowances.map((d) => (d.MaPC === ID ? updated : d)),
      });
      toast.success(i18n.t("Lưu thay đổi phụ cấp thành công"));
    } catch (error) {
      console.error("Lỗi khi cập nhật phụ cấp", error);
      toast.error(i18n.t("Không thể lưu thay đổi phụ cấp"));
      throw error;
    }
  },
}));
