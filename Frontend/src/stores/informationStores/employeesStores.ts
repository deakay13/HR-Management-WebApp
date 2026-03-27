import { create } from "zustand";
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

    } catch (error: any) {
      console.error("Lỗi khi tạo nhân viên:", error);
      set({ initializing: false });
    }
  },

  getEmployees: async () => {
    set({ initializing: true });
    try {
      const data = await EmployeeServices.getEmployees();
      set({ employees: Array.isArray(data) ? data : [] }); 
    } catch (error: any) {
      set({ employees: [] }); 
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

    } catch (error: any) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
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

    } catch (error: any) {
      console.error("Lỗi khi xoá nhân viên", error);
      set({ initializing: false });
    }
  },
}));