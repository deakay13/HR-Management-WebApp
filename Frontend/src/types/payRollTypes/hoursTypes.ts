import { z } from "zod";


export const HoursSchema = z.object({
    MaGL: z.string(),
    SoGioLam: z.number()
});
export type Hours = z.infer<typeof HoursSchema>;

export interface HoursTypes {
  Hours: Hours[];
  initializing: boolean;
  clearState: () => void;
  getHours: () => Promise<void>;
  deleteHours: (ID: string) => Promise<void>;
}
