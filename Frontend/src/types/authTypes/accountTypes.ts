import { z } from "zod";

export const AccountInputSchema = z.object({
  MaTK: z
    .string()
    .min(1, "Mã tài khoản không được để trống")
    .regex(/^TK\d{3,}$/, "Mã tài khoản phải bắt đầu bằng TK và có ít nhất 3 chữ số"),
  MaNV: z
    .string()
    .min(1, "Mã nhân viên không được để trống")
    .regex(/^NV\d{3,}$/, "Mã nhân viên phải bắt đầu bằng NV và có ít nhất 3 chữ số"),
  MaVT: z.string().min(1, "Vui lòng chọn vai trò"),
  TenTaiKhoan: z
    .string()
    .min(3, "Tên tài khoản phải có ít nhất 3 ký tự")
    .max(50, "Tên tài khoản không được vượt quá 50 ký tự"),
  MatKhau: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu quá dài"),
});

export const AccountUpdateSchema = AccountInputSchema.extend({
  MaTK: z.string().optional(),
  MaNV: z.string().optional(),
  MatKhau: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu quá dài")
    .optional()
    .or(z.literal("")),
});

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

export type AccountInput = z.infer<typeof AccountInputSchema>;
export type Account = z.infer<typeof AccountSchema> & {
  HoVaTen?: string;
  TenVaiTro?: string;
  NhanVien?: {
    HoVaTen: string;
    HinhAnh?: string;
  };
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
