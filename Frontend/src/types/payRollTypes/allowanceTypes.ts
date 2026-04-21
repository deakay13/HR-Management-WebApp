import { z } from "zod";

/* ================== INPUT (FORM / CREATE / UPDATE) ================== */
export const AllowanceInputSchema = z.object({
  MaPC: z
    .string()
    .min(1, "Mã phụ cấp không được để trống")
    .regex(/^PC\d{3,}$/, "Mã phải bắt đầu bằng PC và có ít nhất 3 chữ số"),

  LoaiPC: z
    .string()
    .min(1, "Loại phụ cấp không được để trống"),

  SoTien: z.coerce
    .number({ message: "Số tiền phải là một con số" }) 
    .min(10000, "Số tiền phải ít nhất là 10.000 VNĐ"),
});

/* OUTPUT (DATA TỪ API)*/
export const AllowanceSchema = AllowanceInputSchema;

/* TYPES  */
export type AllowanceInput = z.infer<typeof AllowanceInputSchema>;
export type Allowance = z.infer<typeof AllowanceSchema>;

/* STORE */
export interface AllowanceTypes {
  Allowances: Allowance[];
  initializing: boolean;

  clearState: () => void;
  getAllowances: () => Promise<void>;
  deleteAllowance: (ID: string) => Promise<void>;
  createAllowance: (data: AllowanceInput) => Promise<void>;
  updateAllowance: (ID: string, data: AllowanceInput) => Promise<void>;
}

