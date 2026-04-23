import i18n from "@/i18n";
import { create } from "zustand";
import { toast } from "sonner";
import { DeductionServices } from "@/services/payRollServices/deductionServices";
import type { DeductionTypes } from "@/types/payRollTypes/deductionTypes";

export const useDeductionStore = create<DeductionTypes>((set, get) => ({
  Deductions: [],
  initializing: true,
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: 10,
  searchParams: { keyword: "", page: 1, size: 10 },

  clearState: () => {
    set({
      Deductions: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
      searchParams: { keyword: "", page: 1, size: 10 },
    });
  },

  getDeductions: async () => {
    set({ initializing: true });
    try {
      const { searchParams } = get();
      const response = await DeductionServices.searchDeduction(searchParams);
      if (response && "data" in response) {
        set({
          Deductions: response.data,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          pageSize: response.pageSize,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách Deductions", error);
      toast.error(i18n.t("Không thể lấy danh sách Deductions"));
    } finally {
      set({ initializing: false });
    }
  },
  searchDeduction: async (params) => {
    try {
      const currentParams = get().searchParams;
      const newParams = { ...currentParams, ...params };

      const response = await DeductionServices.searchDeduction(newParams);
      set({
        Deductions: response.data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        searchParams: newParams,
      });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm Deduction:", error);
      toast.error(i18n.t("Không thể thực hiện tìm kiếm"));
    }
  },
  deleteDeduction: async (ID: string) => {
    try {
      await DeductionServices.deleteDeduction(ID);
      set({
        Deductions: get().Deductions.filter((d) => d.MaKT !== ID),
      });
      toast.success(i18n.t("Xoá khấu trừ thành công"));
    } catch (error) {
      console.error("Lỗi khi xoá Phụ cấp", error);
      toast.error(i18n.t("Không thể xoá khấu trừ"));
    }
  },
  // CREATE
  createDeduction: async (data) => {
    try {
      const newItem = await DeductionServices.createDeduction(data);
      set({
        Deductions: [...get().Deductions, newItem],
      });
      toast.success(i18n.t("Thêm khấu trừ thành công"));
    } catch (error) {
      console.error("Lỗi khi thêm Khấu trừ", error);
      toast.error(i18n.t("Không thể thêm khấu trừ"));
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
      toast.success(i18n.t("Lưu thay đổi khấu trừ thành công"));
    } catch (error) {
      console.error("Lỗi khi cập nhật Khấu trừ", error);
      toast.error(i18n.t("Không thể lưu thay đổi khấu trừ"));
      throw error;
    }
  },
}));
