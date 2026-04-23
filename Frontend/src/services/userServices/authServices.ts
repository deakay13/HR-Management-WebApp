import api from "@/lib/axios";

export const authServices = {
  signIn: async (TenTaiKhoan: string, MatKhau: string) => {
    const res = await api.post(
      "/api/auth/signin",
      { TenTaiKhoan, MatKhau },
      { withCredentials: true },
    );
    return res.data;
  },

  signOut: async () => {
    return api.post("/api/auth/signout", {}, { withCredentials: true });
  },
  getCurrentAccount: async () => {
    const res = await api.get("/api/current/currentA", {
      withCredentials: true,
    });
    return res.data;
  },
  refresh: async () => {
    const res = await api.post("/api/auth/refresh", null, {
      withCredentials: true,
    });
    return res.data.accessToken;
  },
};
