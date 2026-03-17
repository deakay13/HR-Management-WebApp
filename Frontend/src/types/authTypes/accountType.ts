export interface Account {
  MaTK: string;
  MaNV: string;
  MaVT: string;
  TenTaiKhoan: string;
  MatKhau: string;
}
export interface AccountTypes {
  accounts: Account[];
  initializing: boolean;
  clearState: () => void;
  getAccounts: () => Promise<void>;
}
