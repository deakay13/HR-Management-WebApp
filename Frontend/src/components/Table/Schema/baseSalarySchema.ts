import { z } from "zod";

export const BaseSalarySchema = z.object({
    MaLCB: z.string(),
    LuongCB: z.number(),
});
export type BaseSalaryType = z.infer<typeof BaseSalarySchema>;
