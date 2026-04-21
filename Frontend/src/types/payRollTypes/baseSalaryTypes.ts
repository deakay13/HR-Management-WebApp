import { z } from "zod";

/* ================== INPUT (FORM / CREATE / UPDATE) ================== */
export const BaseSalaryInputSchema = z.object({
  MaLCB: z
    .string()
    .min(1, "Mã lương cơ bản không được để trống")
    .regex(/^LCB\d{3,}$/, "Mã phải bắt đầu bằng LCB và có ít nhất 3 chữ số"),

  LuongCB: z.coerce
    .number({ message: "Lương phải là một con số" })
    .min(1, "Lương phải lớn hơn 0"),
});

/*  OUTPUT (DATA TỪ API)  */
export const BaseSalarySchema = BaseSalaryInputSchema;

/* TYPES  */
export type BaseSalaryInput = z.infer<typeof BaseSalaryInputSchema>;
export type BaseSalary = z.infer<typeof BaseSalarySchema>;

/* STORE  */
export interface BaseSalaryTypes {
  BaseSalaries: BaseSalary[];
  initializing: boolean;

  clearState: () => void;
  getBaseSalaries: () => Promise<void>;
  deleteBaseSalary: (ID: string) => Promise<void>;

  createBaseSalary: (data: BaseSalaryInput) => Promise<void>;
  updateBaseSalary: (ID: string, data: BaseSalaryInput) => Promise<void>;
}