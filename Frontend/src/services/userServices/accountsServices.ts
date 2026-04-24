import api from "@/lib/axios";
import type { Account } from "@/types/authTypes/accountTypes";

export interface AccountSearchParams {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface AccountSearchResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  data: Account[];
}

export const accountsServices = {
  createAccount: async (data: Account) => {
    const res = await api.post("/api/account/Accounts", data, {
      withCredentials: true,
    });
    return res.data;
  },
  searchAccounts: async (params: AccountSearchParams): Promise<AccountSearchResponse> => {
    const res = await api.get("/api/account/Accounts/search", {
      params,
      withCredentials: true,
    });
    return res.data;
  },
  getAccounts: async (search?: string) => {
    const res = await api.get("/api/account/Accounts", {
      params: { size: 0, search },
      withCredentials: true,
    });
    return res.data.data;
  },
  exportAccounts: async () => {
    const res = await api.get("/api/account/Accounts/export", {
      responseType: "blob",
      withCredentials: true,
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "danh_sach_tai_khoan.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
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
