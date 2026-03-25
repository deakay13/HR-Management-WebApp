import { z } from "zod";

export const AllowanceSchema = z.object({
    MaPC: z.string(),
    LoaiPC: z.string(),
    SoTien: z.number()
});
export type Allowance = z.infer<typeof AllowanceSchema>;

export interface AllowanceTypes {
  Allowances: Allowance[];
  initializing: boolean;
  clearState: () => void;
  getAllowances: () => Promise<void>;
  deleteAllowance: (ID: string) => Promise<void>;
   createAllowance: (data: Allowance) => Promise<void>;
  updateAllowance: (ID: string, data: Allowance) => Promise<void>;
}
