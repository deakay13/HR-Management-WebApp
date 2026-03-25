import { z } from "zod";
export const HoursSchema = z.object({
    MaGL: z.string(),
    SoGioLam: z.number(),
});
export type HoursType = z.infer<typeof HoursSchema>;

