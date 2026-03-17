import type { Account } from "./accountType";
export interface AuthTypes {
  accessToken: string | null;
  account: Account | null;
  initializing: boolean;
  setAccessToken: (accessToken: string) => void;
  clearState: () => void;
  signIn: (TenTaiKhoan: string, MatKhau: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  getCurrentAccount: () => Promise<void>;
}
