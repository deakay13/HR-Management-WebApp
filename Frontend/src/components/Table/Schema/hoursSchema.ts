import { z } from "zod";
export const HoursSchema = z.object({
    MaGl: z.string(),
    SoGioLam: z.number(),
});
export type HoursType = z.infer<typeof HoursSchema>;

