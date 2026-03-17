export interface User {
  accessToken: string | null;
  user: User | null;
  initializing: boolean;
  signIn: (TenTaiKhoan: string, MatKhau: string) => Promise<void>;
}
