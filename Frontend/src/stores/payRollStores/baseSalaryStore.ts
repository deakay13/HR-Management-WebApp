import i18n from "@/i18n";
import { create } from "zustand";
import { toast } from "sonner";
import { BaseSalaryServices } from "@/services/payRollServices/baseSalaryServices";
import type { BaseSalaryTypes } from "@/types/payRollTypes/baseSalaryTypes";

export const useBaseSalaryStore = create<BaseSalaryTypes>((set, get) => ({
  BaseSalaries: [],
  initializing: true,
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: 10,
  searchParams: { keyword: "", page: 1, size: 10 },

  clearState: () => {
    set({
      BaseSalaries: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
      searchParams: { keyword: "", page: 1, size: 10 },
    });
  },

  getBaseSalaries: async () => {
    set({ initializing: true });
    try {
      const { searchParams } = get();
      const response = await BaseSalaryServices.searchBaseSalary(searchParams);
      if (response && "data" in response) {
        set({
          BaseSalaries: response.data,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          pageSize: response.pageSize,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách BaseSalaries", error);
      toast.error(i18n.t("Không thể tải danh sách lương cơ bản"));
    } finally {
      set({ initializing: false });
    }
  },
  searchBaseSalary: async (params) => {
    try {
      const currentParams = get().searchParams;
      const newParams = { ...currentParams, ...params };

      const response = await BaseSalaryServices.searchBaseSalary(newParams);
      set({
        BaseSalaries: response.data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        searchParams: newParams,
      });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm BaseSalary:", error);
      toast.error(i18n.t("Không thể thực hiện tìm kiếm"));
    }
  },
  deleteBaseSalary: async (ID: string) => {
    try {
      await BaseSalaryServices.deleteBaseSalary(ID);
      set({
        BaseSalaries: get().BaseSalaries.filter((d) => d.MaLCB !== ID),
      });
      toast.success(i18n.t("Xoá Lương cơ bản thành công"));
    } catch (error) {
      console.error("Lỗi khi xoá Lương cơ bản", error);
      toast.error(i18n.t("Không thể xoá Lương cơ bản"));
    }
  },
  // CREATE
  createBaseSalary: async (data) => {
    try {
      const newItem = await BaseSalaryServices.createBaseSalary(data);
      set({
        BaseSalaries: [...get().BaseSalaries, newItem],
      });
      toast.success(i18n.t("Thêm Lương cơ bản thành công"));
    } catch (error) {
      console.error("Lỗi khi thêm Lương cơ bản", error);
      toast.error(i18n.t("Không thể thêm Lương cơ bản"));
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
      toast.success(i18n.t("Lưu thay đổi lương cơ bản thành công"));
    } catch (error) {
      console.error("Lỗi khi cập nhật Lương cơ bản", error);
      toast.error(i18n.t("Không thể lưu thay đổi lương cơ bản"));
      throw error;
    }
  },
}));
