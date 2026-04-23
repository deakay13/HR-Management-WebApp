import { z } from "zod";

/* ================== INPUT (FORM / CREATE / UPDATE) ================== */
export const DeductionInputSchema = z.object({
  MaKT: z
    .string()
    .min(1, "Mã khấu trừ không được để trống")
    .regex(/^KT\d{3,}$/, "Mã phải bắt đầu bằng KT và có ít nhất 3 chữ số"),

  LoaiKT: z.string().min(1, "Loại khấu trừ không được để trống"),

  PhanTram: z
    .number({ message: "Phần trăm phải là một con số" })
    .min(0, "Phần trăm phải >= 0")
    .max(100, "Phần trăm không được vượt quá 100"),
});

/* OUTPUT (DATA TỪ API) */
export const DeductionSchema = DeductionInputSchema;

/*  TYPES */
export type DeductionInput = z.infer<typeof DeductionInputSchema>;
export type Deduction = z.infer<typeof DeductionSchema>;

/*  STORE  */
export interface DeductionTypes {
  Deductions: Deduction[];
  initializing: boolean;

  clearState: () => void;
  getDeductions: () => Promise<void>;
  deleteDeduction: (ID: string) => Promise<void>;

  createDeduction: (data: DeductionInput) => Promise<void>;
  updateDeduction: (ID: string, data: DeductionInput) => Promise<void>;
}
