import { z } from "zod";

export const AccountSchema = z.object({
  MaTK: z.string(),
  MaNV: z.string(),
  MaVT: z.string(),
  TenTaiKhoan: z.string(),
  MatKhau: z.string(),
  TrangThai: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type Account = z.infer<typeof AccountSchema> & {
  HoVaTen?: string;
  TenVaiTro?: string;
};

export interface AccountTypes {
  accounts: Account[];
  initializing: boolean;
  clearState: () => void;
  createAccount: (data: Account) => Promise<void>;
  updateAccount: (ID: string, data: Partial<Account>) => Promise<void>;
  getAccounts: (search?: string) => Promise<void>;
  exportAccounts: () => Promise<void>;
  deleteAccount: (ID: string) => Promise<void>;
}
