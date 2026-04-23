import api from "@/lib/axios";
import type { Department } from "@/types/informationTypes/departmentTypes";

export const DepartmentServices = {
  getDepartments: async (params?: any) => {
    const res = await api.get("/api/information/departments", {
      params: { size: 10, ...params },
      withCredentials: true,
    });
    return res.data;
  },

  searchDepartment: async (params: any) => {
    const res = await api.get("/api/information/departments/search", {
      params: { size: 10, ...params },
      withCredentials: true,
    });
    return res.data;
  },

  exportDepartment: async () => {
    const res = await api.get("/api/information/departments/export", {
      responseType: "blob",
      withCredentials: true,
    });
    return res.data;
  },

  getDepartment: async (ID: string) => {
    const res = await api.get(`/api/information/departments/${ID}`, {
      withCredentials: true,
    });
    return res.data;
  },

  createDepartment: async (data: Department): Promise<Department> => {
    const res = await api.post("/api/information/departments", data, {
      withCredentials: true,
    });
    return res.data;
  },

  updateDepartment: async (
    ID: string,
    data: Department,
  ): Promise<Department> => {
    const res = await api.put(`/api/information/departments/${ID}`, data, {
      withCredentials: true,
    });
    return res.data;
  },

  deleteDepartment: async (ID: string): Promise<void> => {
    await api.delete(`/api/information/departments/${ID}`, {
      withCredentials: true,
    });
  },
};
