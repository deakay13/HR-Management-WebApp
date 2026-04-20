import api from "@/lib/axios";
import type { Employee } from "@/types/informationTypes/employeeTypes";

export const EmployeeServices = {
  getEmployees: async () => {
    const res = await api.get("/api/information/employees", {
      params: { size: 0 },
      withCredentials: true,
    });
    return res.data;
  },

  getEmployee: async (ID: string) => {
    const res = await api.get(`/api/information/employees/${ID}`, {
      withCredentials: true,
    });
    return res.data;
  },

  createEmployee: async (data: Employee): Promise<Employee> => {
    const res = await api.post("/api/information/employees", data, {
      withCredentials: true,
    });
    return res.data;       
  },

  updateEmployee: async (ID: string, data: Employee | FormData): Promise<Employee> => {
    const res = await api.put(`/api/information/employees/${ID}`, data, {
      withCredentials: true,
    });
    return res.data;        
  },

  deleteEmployee: async (ID: string): Promise<void> => {
    await api.delete(`/api/information/employees/${ID}`, {
      withCredentials: true,
    });
  },

  searchEmployees: async (filters: { keyword?: string; MaPB?: string }) => {
    const res = await api.get("/api/information/employees/search", {
      params: filters,
      withCredentials: true,
    });
    return res.data;
  },

  exportEmployees: async () => {
    const res = await api.get("/api/information/employees/export", {
      responseType: "blob",
      withCredentials: true,
    });
    return res.data;
  },
};