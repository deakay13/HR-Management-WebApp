import { z } from "zod";

export const AccountSchema = z.object({
    MaTK: z.string(),
    MaNV: z.string(),
    MaVT: z.string(),
    TenTaiKhoan: z.string(),
    MatKhau: z.string(),
});
export type AccountsType = z.infer<typeof AccountSchema>;

