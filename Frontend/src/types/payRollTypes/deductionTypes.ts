import { z } from "zod";


    export const DeductionSchema = z.object({
    MaKT: z.string(),
    LoaiKT: z.string(),
    PhanTram: z.number()
});
export type Deduction = z.infer<typeof DeductionSchema>;

export interface DeductionTypes {
  Deductions: Deduction[];
  initializing: boolean;
  clearState: () => void;
  getDeductions: () => Promise<void>;
  deleteDeduction: (ID: string) => Promise<void>;
}
