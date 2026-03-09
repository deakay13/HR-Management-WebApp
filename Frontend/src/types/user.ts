export interface User {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  signIn: (TenTaiKhoan: string, MatKhau: string) => Promise<void>;
}
