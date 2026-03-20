import api from "@/lib/axios";

export const HoursServices = {

  getHours: async () => {
    const res = await api.get("/api/payroll/hours", {
      params: { size: 0 },
      withCredentials: true,
    });
    return res.data.data;
  },
};
