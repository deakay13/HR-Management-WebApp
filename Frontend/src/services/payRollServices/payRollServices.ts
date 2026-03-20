import api from "@/lib/axios";

export const PayRollServices = {

  getPayRolls: async () => {
    const res = await api.get("/api/payroll/payrolls", {
      params: { size: 0 },
      withCredentials: true,
    });
    return res.data.data;
  },
};
