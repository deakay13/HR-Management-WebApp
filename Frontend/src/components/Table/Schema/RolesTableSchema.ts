import { z } from "zod";

export const RolesSchema = z.object({
    MaVT: z.string(),
    TenVaiTro: z.string(),
});
export type RolesType = z.infer<typeof RolesSchema>;

