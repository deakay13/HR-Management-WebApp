import { z } from "zod";

export const PayRollSchema = z.object({
    MaBL: z.string(),
    MaNV: z.string(),
    MaLCB: z.string(),
    MaGL: z.string(),
    MaKT: z.string(),
    MaPC: z.string(),
    Thang: z.string(),
    NgayTinhLuong: z.string(),
    TongLuong: z.string(),
    TrangThai: z.string(),
});
export type PayRollType = z.infer<typeof PayRollSchema>;

