import api from "@/lib/axios";

export const accountsServices = {
  getAccounts: async () => {
    const res = await api.get("/api/account/Accounts", {
      params: { size: 0 },
      withCredentials: true,
    });
    return res.data.data;
  },
};
