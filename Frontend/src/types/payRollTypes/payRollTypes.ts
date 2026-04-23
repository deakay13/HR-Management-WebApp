import { z } from "zod";

/* ================== INPUT (FORM / CREATE / UPDATE) ================== */
export const PayRollInputSchema = z.object({
  MaBL: z
    .string()
    .min(1, "Mã bảng lương không được để trống")
    .regex(/^BL\d{3}$/, "Mã phải dạng BLxxx"),

  MaNV: z.string().min(1, "Mã nhân viên không được để trống"),

  MaLCB: z.string().min(1, "Mã lương cơ bản không được để trống"),

  MaPC: z.string().min(1, "Mã phụ cấp không được để trống"),

  MaGL: z.string().min(1, "Mã giờ làm không được để trống"),

  MaKT: z.string().min(1, "Mã khấu trừ không được để trống"),

  Thang: z.string().min(1, "Tháng không được để trống"),
  SoNgayLam: z
    .number()
    .int()
    .min(1, "Số ngày làm phải ít nhất là 1")
    .or(z.string()),
});

export const PayRollSchema = PayRollInputSchema.extend({
  NgayTinhLuong: z.string(),
  TongLuong: z.number().or(z.string()),
  SoNgayLam: z.number().or(z.string()),
  TrangThai: z.string(),
  NhanVien: z
    .object({
      HoVaTen: z.string(),
    })
    .optional(),
  KhauTru: z
    .object({
      LoaiKT: z.string(),
    })
    .optional(),
  PhuCapThuong: z
    .object({
      LoaiPC: z.string(),
      SoTien: z.number().or(z.string()),
    })
    .optional(),
  LuongCoBan: z
    .object({
      LuongCB: z.number().or(z.string()),
    })
    .optional(),
  TongGioLam: z
    .object({
      SoGioLam: z.number().or(z.string()),
    })
    .optional(),
});

export type PayRollInput = z.infer<typeof PayRollInputSchema>;
export type PayRoll = z.infer<typeof PayRollSchema>;

export interface PayRollTypes {
  PayRolls: PayRoll[];
  initializing: boolean;

  //  thêm cho search + pagination
  totalItems: number;
  totalPages: number;
  currentPage: number;
  searchParams: Record<string, unknown>;

  // actions
  clearState: () => void;
  getPayRolls: () => Promise<void>;
  deletePayRoll: (ID: string) => Promise<void>;

  createPayRolls: (data: PayRollInput) => Promise<void>;
  updatePayRoll: (ID: string, data: PayRollInput) => Promise<void>;

  //  thêm search
  searchPayRolls: (params: Record<string, unknown>) => Promise<void>;

  // Employee self-service: fetch own payroll by MaNV
  getMyPayrolls: (MaNV: string) => Promise<void>;
}
