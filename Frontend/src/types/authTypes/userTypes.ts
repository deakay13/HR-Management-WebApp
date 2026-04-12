import type { Account } from "./accountTypes";

export interface User {
  MaTK: string;
  MaNV: string;
  MaVT: string;
  TenTaiKhoan: string;
  account: Account | null;
}
