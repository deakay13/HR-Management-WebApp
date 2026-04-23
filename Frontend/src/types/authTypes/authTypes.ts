import type { Account } from "./accountTypes";
export interface AuthTypes {
  accessToken: string | null;
  account: Account | null;
  avatarUrl: string | null;
  initializing: boolean;
  setAccessToken: (accessToken: string) => void;
  setAvatarUrl: (url: string | null) => void;
  clearState: () => void;
  signIn: (TenTaiKhoan: string, MatKhau: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: (showToast?: boolean) => Promise<void>;
  getCurrentAccount: () => Promise<void>;
}
