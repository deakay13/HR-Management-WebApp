import i18n from "@/i18n";
import { create } from "zustand";
import { toast } from "sonner";
import { DepartmentServices } from "@/services/informationServices/departmentServices";
import type {
  Department,
  DepartmentTypes,
} from "@/types/informationTypes/departmentTypes";

export const useDepartmentStore = create<DepartmentTypes>((set) => ({
  departments: [],
  initializing: true,
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
  searchParams: {},

  clearState: () => {
    set({ departments: [], initializing: false });
  },

  createDepartment: async (data: Department) => {
    try {
      set({ initializing: true });
      const newDepartment = await DepartmentServices.createDepartment(data);
      set((state) => ({
        departments: [...state.departments, newDepartment],
        initializing: false,
      }));
      toast.success(i18n.t("Thêm phòng ban thành công"));
    } catch (error: unknown) {
      console.error("Lỗi khi tạo phòng ban:", error);
      toast.error(i18n.t("Không thể thêm phòng ban"));
      set({ initializing: false });
      throw error;
    }
  },

  getDepartments: async (params?: any) => {
    try {
      const response = await DepartmentServices.getDepartments(params);
      if (response && response.data) {
        set({
          departments: response.data,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        });
      } else {
        set({ departments: response || [] });
      }
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách phòng ban:", error);
      toast.error(i18n.t("Không thể tải danh sách phòng ban"));
    } finally {
      set({ initializing: false });
    }
  },

  searchDepartments: async (params?: any) => {
    set({ searchParams: params });
    try {
      const response = await DepartmentServices.searchDepartment(params);
      set({
        departments: response.data,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      });
    } catch (error: unknown) {
      console.error("Lỗi khi tìm kiếm phòng ban:", error);
      toast.error(i18n.t("Không thể thực hiện tìm kiếm"));
    } finally {
      set({ initializing: false });
    }
  },

  updateDepartment: async (ID: string, data: Department) => {
    try {
      set({ initializing: true });
      const updated = await DepartmentServices.updateDepartment(ID, data);
      set((state) => ({
        departments: state.departments.map((dept) =>
          dept.MaPB === ID ? updated : dept,
        ),
        initializing: false,
      }));
      toast.success(i18n.t("Lưu thay đổi phòng ban thành công"));
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật phòng ban:", error);
      toast.error(i18n.t("Không thể lưu thay đổi phòng ban"));
      set({ initializing: false });
      throw error;
    }
  },

  deleteDepartment: async (ID: string) => {
    try {
      set({ initializing: true });
      await DepartmentServices.deleteDepartment(ID);
      set((state) => ({
        departments: state.departments.filter((d) => d.MaPB !== ID),
        initializing: false,
      }));
      toast.success(i18n.t("Xoá phòng ban thành công"));
    } catch (error: unknown) {
      console.error("Lỗi khi xoá phòng ban:", error);
      toast.error(i18n.t("Không thể xoá phòng ban"));
      set({ initializing: false });
    }
  },
}));
