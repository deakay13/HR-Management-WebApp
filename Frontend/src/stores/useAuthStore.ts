import { create } from "zustand";
import { toast } from "sonner";
import { authServices } from "@/services/authService";
import type { AuthState } from "@/types/store.ts";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({
      accessToken: null,
      user: null,
      loading: false,
    });
  },

  signIn: async (TenTaiKhoan, MatKhau) => {
    try {
      set({ loading: true });
      const { accessToken } = await authServices.signIn(TenTaiKhoan, MatKhau);
      set({ accessToken });
      toast.success("Chào mừng đã đến");
    } catch (error) {
      console.error(error);
      toast.error("đăng nhập không thành công");
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {   
      await authServices.signOut();
      get().clearState();
      toast.success("đăng xuất thành công");
    } catch (error) {
      console.error(error);
      toast.error("Không thể đăng xuất");
    }
  },
}));
