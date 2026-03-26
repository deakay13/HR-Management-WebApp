import { create } from "zustand";
import { toast } from "sonner";
import { EmployeeServices } from "@/services/informationServices/employeeServices";
import type { Employee, EmployeeTypes } from "@/types/informationTypes/employeeTypes";

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

      toast.success("Tạo nhân viên thành công");
    } catch (error: any) {
      console.error("Lỗi khi tạo nhân viên:", error);
      toast.error(error?.response?.data?.message || "Không thể tạo nhân viên");
      set({ initializing: false });
    }
  },

  getEmployees: async () => {
    set({ initializing: true });
    try {
      const data = await EmployeeServices.getEmployees();
      set({ employees: Array.isArray(data) ? data : [] }); 
      toast.success("Lấy danh sách nhân viên thành công");
    } catch (error: any) {
      set({ employees: [] }); 
      toast.error("Không thể lấy danh sách nhân viên");
    } finally {
      set({ initializing: false });
    }
  },

  updateEmployee: async (ID: string, data: Employee) => {
    try {
      set({ initializing: true });
      const updated = await EmployeeServices.updateEmployee(ID, data);

      set((state) => ({
        employees: state.employees.map((emp) =>
          emp.MaNV === ID ? updated : emp
        ),
        initializing: false,
      }));

      toast.success("Cập nhật nhân viên thành công");
    } catch (error: any) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
      toast.error("Không thể cập nhật nhân viên");
      set({ initializing: false });
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

      toast.success("Xoá nhân viên thành công");
    } catch (error: any) {
      console.error("Lỗi khi xoá nhân viên", error);
      toast.error("Không thể xoá nhân viên");
      set({ initializing: false });
    }
  },
}));