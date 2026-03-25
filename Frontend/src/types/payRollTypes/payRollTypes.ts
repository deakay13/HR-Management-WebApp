import { z } from "zod";

export const PayRollSchema = z.object({
    MaBL: z.string(),
    MaNV: z.string(),
    MaLCB: z.string(),
    MaPC: z.string(),
    MaGL: z.string(),
    MaKT: z.string(),
    Thang: z.string(),
    NgayTinhLuong: z.string(),
    TongLuong: z.number(),
    TrangThai: z.string()
});
export type PayRoll = z.infer<typeof PayRollSchema>;

export interface PayRollTypes {
  PayRolls: PayRoll[];
  initializing: boolean;
  clearState: () => void;
  getPayRolls: () => Promise<void>;
  deletePayRoll: (ID: string) => Promise<void>;
}
