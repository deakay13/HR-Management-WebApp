import api from "@/lib/axios";

export const ContractServices = {
  getContracts: async (params?: Record<string, unknown>) => {
    const res = await api.get("/api/information/contracts", {
      params,
      withCredentials: true,
    });
    return res.data;
  },
  getContract: async (ID: string) => {
    const res = await api.get(`/api/information/contracts/${ID}`, {
      withCredentials: true,
    });
    return res.data;
  },
  // Use FormData to send multipart/form-data for file upload
  createContract: async (data: FormData) => {
    const res = await api.post(`/api/information/contracts`, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  updateContract: async (ID: string, data: FormData) => {
    const res = await api.put(`/api/information/contracts/${ID}`, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  deleteContract: async (ID: string) => {
    const res = await api.delete(`/api/information/contracts/${ID}`, {
      withCredentials: true,
    });
    return res.data;
  },
  searchContracts: async (params: Record<string, unknown>) => {
    const res = await api.get("/api/information/contracts/search", {
      params,
      withCredentials: true,
    });
    return res.data;
  },
  exportContract: async () => {
    const res = await api.get("/api/information/contracts/export", {
      responseType: "blob",
      withCredentials: true,
    });
    return res.data;
  },
};
