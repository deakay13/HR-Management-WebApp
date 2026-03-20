import { z } from "zod";

export const AllowanceSchema = z.object({
    MaPC: z.string(),
    LoaiPC: z.string(),
    SoTien: z.number(),
});
export type AllowanceType = z.infer<typeof AllowanceSchema>;

