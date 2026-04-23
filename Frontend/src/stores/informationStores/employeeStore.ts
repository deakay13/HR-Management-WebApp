import i18n from "@/i18n";
import { create } from "zustand";
import { toast } from "sonner";
import { EmployeeServices } from "@/services/informationServices/employeeServices";
import type {
  Employee,
  EmployeeTypes,
} from "@/types/informationTypes/employeeTypes";

export const useEmployeeStore = create<EmployeeTypes>((set) => ({
  employees: [],
  initializing: true,

  clearState: () => {
    set({ employees: [], initializing: false });
  },

  createEmployee: async (data: Employee) => {
    try {
      set({ initializing: true });
      const newEmployee = await EmployeeServices.createEmployee(data);
      set((state) => ({
        employees: [...state.employees, newEmployee],
        initializing: false,
      }));
      toast.success(i18n.t("Thêm nhân viên thành công"));
    } catch (error: unknown) {
      console.error("Lỗi khi tạo nhân viên:", error);
      toast.error(i18n.t("Không thể thêm nhân viên"), {
        description: i18n.t("Vui lòng kiểm tra lại thông tin."),
      });
      set({ initializing: false });
      throw error;
    }
  },

  getEmployees: async () => {
    try {
      const data = await EmployeeServices.getEmployees();
      set({ employees: Array.isArray(data) ? data : [] });
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      toast.error(i18n.t("Không thể tải danh sách nhân viên"));
      set({ employees: [] });
    } finally {
      set({ initializing: false });
    }
  },

  searchEmployees: async (filters: { keyword?: string; MaPB?: string }) => {
    try {
      const response = await EmployeeServices.searchEmployees(filters);
      // Backend returns { data: [...], ... }
      set({ employees: Array.isArray(response.data) ? response.data : [] });
    } catch (error: unknown) {
      console.error("Lỗi khi tìm kiếm nhân viên:", error);
      toast.error(i18n.t("Không thể tìm kiếm nhân viên"));
      set({ employees: [] });
    } finally {
      set({ initializing: false });
    }
  },

  updateEmployee: async (ID: string, data: Employee | FormData) => {
    try {
      set({ initializing: true });
      const updated = await EmployeeServices.updateEmployee(ID, data);
      set((state) => ({
        employees: state.employees.map((emp) =>
          emp.MaNV === ID ? updated : emp,
        ),
        initializing: false,
      }));
      toast.success(i18n.t("Lưu thay đổi nhân viên thành công"));
    } catch (error: unknown) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
      toast.error(i18n.t("Không thể lưu thay đổi nhân viên"));
      set({ initializing: false });
      throw error;
    }
  },

  deleteEmployee: async (ID: string) => {
    try {
      set({ initializing: true });
      await EmployeeServices.deleteEmployee(ID);
      set((state) => ({
        employees: state.employees.filter((emp) => emp.MaNV !== ID),
        initializing: false,
      }));
      toast.success(i18n.t("Xoá nhân viên thành công"));
    } catch (error: unknown) {
      console.error("Lỗi khi xoá nhân viên:", error);
      toast.error(i18n.t("Không thể xoá nhân viên"));
      set({ initializing: false });
    }
  },
}));
