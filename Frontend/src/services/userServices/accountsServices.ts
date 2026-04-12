import api from "@/lib/axios";
import type { Account } from "@/types/authTypes/accountTypes";

export const accountsServices = {
  createAccount: async (data: Account) => {
    const res = await api.post("/api/account/Accounts", data, {
      withCredentials: true,
    });
    return res.data;
  },
  getAccounts: async () => {
    const res = await api.get("/api/account/Accounts", {
      params: { size: 0 },
      withCredentials: true,
    });
    return res.data.data;
  },
  updateAccount: async (ID: string, data: Partial<Account>) => {
    const res = await api.put(`/api/account/Accounts/${ID}`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  deleteAccount: async (ID: string) => {
    await api.delete(`/api/account/Accounts/${ID}`, { withCredentials: true });
    return true;
  },
};
