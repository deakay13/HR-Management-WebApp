import api from "@/lib/axios";

export const HoursServices = {
  getHours: async () => {
    const res = await api.get("/api/payroll/hours", {
      params: { size: 0 },
      withCredentials: true,
    });
    return res.data.data;
  },
  deleteHour: async (ID: string) => {
    await api.delete(`/api/payroll/hours/${ID}`, { withCredentials: true });
    return true;
  },
  updateHours: async (ID: string, hoursData: Record<string, unknown>) => {
    const res = await api.put(`/api/payroll/hours/${ID}`, hoursData, {
      withCredentials: true,
    });
    return res.data.hour;
  },
  createHours: async (hoursData: Record<string, unknown>) => {
    const res = await api.post(`/api/payroll/hours`, hoursData, {
      withCredentials: true,
    });
    return res.data.hour;
  },
  searchHours: async (params: Record<string, unknown>) => {
    const res = await api.get("/api/payroll/hours/search", {
      params,
      withCredentials: true,
    });
    return res.data;
  },
  exportHours: async () => {
    const res = await api.get("/api/payroll/hours/export", {
      responseType: "blob",
      withCredentials: true,
    });
    return res.data;
  },
};
