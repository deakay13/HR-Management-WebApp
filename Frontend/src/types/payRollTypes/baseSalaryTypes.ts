import { z } from "zod";


export const BaseSalarySchema = z.object({
    MaLCB: z.string(),
    LuongCB: z.number()
});
export type BaseSalary = z.infer<typeof BaseSalarySchema>;

export interface BaseSalaryTypes {
  BaseSalaries: BaseSalary[];
  initializing: boolean;
  clearState: () => void;
  getBaseSalaries: () => Promise<void>;
  deleteBaseSalary: (ID: string) => Promise<void>;
}
