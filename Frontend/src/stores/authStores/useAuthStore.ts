import { create } from "zustand";
import { toast } from "sonner";
import i18n from "@/i18n";
import { authServices } from "@/services/userServices/authServices";
import type { AuthTypes } from "@/types/authTypes/authTypes";
import { useAuthorizeStore } from "@/stores/authStores/useAuthorizeStore";
import { normalizePermissions, roleFromMaVT } from "@/utils/authorizeUtils";

export const useAuthStore = create<AuthTypes>((set, get) => ({
  accessToken: null,
  account: null,
  avatarUrl: null,
  initializing: true,
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  setAvatarUrl: (url) => {
    set({ avatarUrl: url });
  },
  clearState: () => {
    set({
      accessToken: null,
      account: null,
      avatarUrl: null,
    });
    useAuthorizeStore.getState().clearState();
  },

  signIn: async (TenTaiKhoan, MatKhau) => {
    set({ initializing: true });
    try {
      const res = await authServices.signIn(TenTaiKhoan, MatKhau);
      const token = res.accessToken;
      get().setAccessToken(token);
      await get().getCurrentAccount();
      toast.success(res.message || i18n.t("Chào mừng đã đến HR-System 🎉"));
    } catch (error) {
      console.error(error);
      toast.error(i18n.t("Sai tên tài khoản hoặc mật khẩu"), {
        description: i18n.t("Vui lòng kiểm tra lại thông tin đăng nhập."),
      });
      throw error; // re-throw để SignIn form biết có lỗi
    } finally {
      set({ initializing: false });
    }
  },

  signOut: async () => {
    try {
      await authServices.signOut();
      get().clearState();
      toast.success(i18n.t("Đăng xuất thành công"));
    } catch (error) {
      console.error(error);
      toast.error(i18n.t("Không thể đăng xuất"));
    }
  },

  getCurrentAccount: async () => {
    set({ initializing: true });
    useAuthorizeStore.getState().setInitializing(true);
    try {
      const currentAccount = await authServices.getCurrentAccount();
      set({ account: currentAccount });

      // Cập nhật Avatar từ DB (Base64)
      if (currentAccount?.NhanVien?.HinhAnh) {
        set({ avatarUrl: currentAccount.NhanVien.HinhAnh });
      }

      const tenVaiTro = currentAccount?.VaiTro?.TenVaiTro;
      const role = tenVaiTro
        ? { MaVT: currentAccount.MaVT, TenVaiTro: tenVaiTro }
        : roleFromMaVT(currentAccount?.MaVT);
      const permissions = normalizePermissions(currentAccount?.permissions);
      const authorizeState = useAuthorizeStore.getState();

      authorizeState.setRole(role);
      authorizeState.setPermissions(permissions);
    } catch (err) {
      console.error(err);
      toast.error(i18n.t("Không thể lấy tài khoản hiện tại"));
    } finally {
      set({ initializing: false });
      useAuthorizeStore.getState().setInitializing(false);
    }
  },

  refresh: async (showToast = true) => {
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
      if (showToast) {
        toast.error(
          i18n.t("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại"),
        );
      }
      get().clearState();
    } finally {
      set({ initializing: false });
    }
  },
}));
