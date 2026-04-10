import { z } from "zod";

/* ================== INPUT (FORM / CREATE / UPDATE) ================== */
export const PayRollInputSchema = z.object({
  MaBL: z
    .string()
    .min(1, "Mã bảng lương không được để trống")
    .regex(/^BL\d{3}$/, "Mã phải dạng BLxxx"),

  MaNV: z
    .string()
    .min(1, "Mã nhân viên không được để trống"),

  MaLCB: z
    .string()
    .min(1, "Mã lương cơ bản không được để trống"),

  MaPC: z
    .string()
    .min(1, "Mã phụ cấp không được để trống"),

  MaGL: z
    .string()
    .min(1, "Mã giờ làm không được để trống"),

  MaKT: z
    .string()
    .min(1, "Mã khấu trừ không được để trống"),

  Thang: z
    .string()
    .min(1, "Tháng không được để trống"),
});

export const PayRollSchema = PayRollInputSchema.extend({
  NgayTinhLuong: z.string(),
  TongLuong: z.number(),
  TrangThai: z.string(),
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
  searchParams: any;

  // actions
  clearState: () => void;
  getPayRolls: () => Promise<void>;
  deletePayRoll: (ID: string) => Promise<void>;

  createPayRolls: (data: PayRollInput) => Promise<void>;
  updatePayRoll: (ID: string, data: PayRollInput) => Promise<void>;

  //  thêm search
  searchPayRolls: (params: any) => Promise<void>;
}