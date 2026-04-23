import api from "@/lib/axios";

export const BaseSalaryServices = {
  getBaseSalaries: async () => {
    const res = await api.get("/api/payroll/basesalary", {
      params: { size: 0 },
      withCredentials: true,
    });
    return res.data.data;
  },
  deleteBaseSalary: async (ID: string) => {
    await api.delete(`/api/payroll/basesalary/${ID}`, {
      withCredentials: true,
    });
    return true;
  },
  updateBaseSalary: async (
    ID: string,
    baseSalaryData: Record<string, unknown>,
  ) => {
    const res = await api.put(`/api/payroll/basesalary/${ID}`, baseSalaryData, {
      withCredentials: true,
    });
    return res.data.luong;
  },
  createBaseSalary: async (baseSalaryData: Record<string, unknown>) => {
    const res = await api.post(`/api/payroll/basesalary`, baseSalaryData, {
      withCredentials: true,
    });
    return res.data.luong;
  },
};
