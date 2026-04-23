import i18n from "@/i18n";
import { create } from "zustand";
import { toast } from "sonner";
import { HoursServices } from "@/services/payRollServices/hoursServices";
import type { HoursTypes } from "@/types/payRollTypes/hoursTypes";
export const useHoursStore = create<HoursTypes>((set, get) => ({
  Hours: [],
  initializing: true,
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: 10,
  searchParams: { keyword: "", page: 1, size: 10 },

  clearState: () => {
    set({
      Hours: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
      searchParams: { keyword: "", page: 1, size: 10 },
    });
  },

  getHours: async () => {
    set({ initializing: true });
    try {
      const { searchParams } = get();
      const response = await HoursServices.searchHours(searchParams);
      if (response && "data" in response) {
        set({
          Hours: response.data,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          pageSize: response.pageSize,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách Hours", error);
      toast.error(i18n.t("Không thể lấy danh sách Hours"));
    } finally {
      set({ initializing: false });
    }
  },
  searchHours: async (params) => {
    try {
      const currentParams = get().searchParams;
      const newParams = { ...currentParams, ...params };

      const response = await HoursServices.searchHours(newParams);
      set({
        Hours: response.data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        searchParams: newParams,
      });
    } catch (error) {
      console.error("Lỗi khi tìm kiếm Hours:", error);
      toast.error(i18n.t("Không thể thực hiện tìm kiếm"));
    }
  },
  deleteHours: async (ID: string) => {
    try {
      await HoursServices.deleteHour(ID);
      set({
        Hours: get().Hours.filter((d) => d.MaGL !== ID),
      });
      toast.success(i18n.t("Xoá Giờ làm thêm thành công"));
    } catch (error) {
      console.error("Lỗi khi xoá Giờ làm thêm", error);
      toast.error(i18n.t("Không thể xoá Giờ làm thêm"));
    }
  },
  // CREATE
  createHours: async (data) => {
    try {
      const newItem = await HoursServices.createHours(data);
      set({
        Hours: [...get().Hours, newItem],
      });
      toast.success(i18n.t("Thêm Giờ làm thành công"));
    } catch (error) {
      console.error("Lỗi khi thêm Giờ làm", error);
      toast.error(i18n.t("Không thể thêm Giờ làm"));
      throw error;
    }
  },

  // UPDATE
  updateHours: async (ID: string, data) => {
    try {
      const updated = await HoursServices.updateHours(ID, data);
      set({
        Hours: get().Hours.map((d) => (d.MaGL === ID ? updated : d)),
      });
      toast.success(i18n.t("Cập nhật Giờ làm thành công"));
    } catch (error) {
      console.error("Lỗi khi cập nhật Giờ làm", error);
      toast.error(i18n.t("Không thể cập nhật Giờ làm"));
      throw error;
    }
  },
}));
