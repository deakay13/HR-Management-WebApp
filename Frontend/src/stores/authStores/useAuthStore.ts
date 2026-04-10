import { create } from "zustand";
import { toast } from "sonner";
import { authServices } from "@/services/userServices/authService";
import type { AuthTypes } from "@/types/authTypes/authType";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { normalizePermissions, roleFromMaVT } from "@/utils/authorizeUtiles";

export const useAuthStore = create<AuthTypes>((set, get) => ({
  accessToken: null,
  account: null,
  initializing: true,
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  clearState: () => {
    set({
      accessToken: null,
      account: null,
    });
    useAuthorizeStore.getState().clearState();
  },

  signIn: async (TenTaiKhoan, MatKhau) => {
    set({ initializing: true });
    try {
      const res = await authServices.signIn(TenTaiKhoan, MatKhau);

      // lấy token từ response
      const token = res.accessToken;
      // lưu vào store
      get().setAccessToken(token);
      await get().getCurrentAccount();

      toast.success(res.message || "Chào mừng đã đến HR-System");
    } catch (error) {
      console.error(error);
      toast.error("Đăng nhập không thành công");
    } finally {
      set({ initializing: false });
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
  getCurrentAccount: async () => {
    set({ initializing: true });
    useAuthorizeStore.getState().setInitializing(true);
    try {
      const currentAccount = await authServices.getCurrentAccount();
      set({ account: currentAccount });

      const role = roleFromMaVT(currentAccount?.MaVT);
      const permissions = normalizePermissions(currentAccount?.permissions);
      const authorizeState = useAuthorizeStore.getState();

      authorizeState.setRole(role);
      authorizeState.setPermissions(permissions);
    } catch (err) {
      console.error(err);
      toast.error("Không thể lấy tài khoản hiện tại");
    } finally {
      set({ initializing: false });
      useAuthorizeStore.getState().setInitializing(false);
    }
  },
  refresh: async () => {
    try {
      const { account, getCurrentAccount } = get();
      set({ initializing: true });
      const accessToken = await authServices.refresh();
      get().setAccessToken(accessToken);
      if (!account) {
        await getCurrentAccount();
      }
    } catch (error) {
      console.error(error);
      toast.error("Phiên đăng nhập đã hết hạn, Vui lòng đăng nhập lại");
      get().clearState();
    } finally {
      set({ initializing: false });
    }
  },
}));
