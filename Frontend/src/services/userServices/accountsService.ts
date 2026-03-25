import api from "@/lib/axios";
import type { Account } from "@/types/authTypes/accountType";

export const accountsServices = {
  createAccount: async (data: Account) => {
    const res = await api.post("/api/account/Accounts",data, {
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
  deleteAccount: async (ID: string) => {
    await api.delete(`/api/account/Accounts/${ID}`, { withCredentials: true });
    return true;
  },
};
