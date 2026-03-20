import { z } from "zod";

export const DeductionSchema = z.object({
    MaKT: z.string(),
    LoaiKT: z.string(),
    PhanTram: z.number(),
});
export type DeductionType = z.infer<typeof DeductionSchema>;

