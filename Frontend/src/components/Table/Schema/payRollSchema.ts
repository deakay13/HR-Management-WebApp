import { z } from "zod";

export const PayRollSchema = z.object({
    MaBL: z.string(),
    MaNV: z.string(),
    MaLCB: z.string(),
    MaGL: z.string(),
    MaKT: z.string(),
    MaVT: z.string(),
    Thang: z.number(),
    NgayTinhLuong: z.string(),
    TongLuong: z.number(),
    TrangThai: z.string(),
});
export type PayRollType = z.infer<typeof PayRollSchema>;

