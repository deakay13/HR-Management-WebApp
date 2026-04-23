import { z } from "zod";

/* ================== INPUT (FORM / CREATE / UPDATE) ================== */
export const AllowanceInputSchema = z.object({
  MaPC: z
    .string()
    .min(1, "Mã phụ cấp không được để trống")
    .regex(/^PC\d{3}$/, "Mã phải dạng PCxxx"),

  LoaiPC: z.string().min(1, "Loại phụ cấp không được để trống"),

  SoTien: z.number().min(10000, "Số tiền phải lớn hơn 0"),
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
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  searchParams: {
    keyword?: string;
    page?: number;
    size?: number;
  };

  clearState: () => void;
  getAllowances: () => Promise<void>;
  searchAllowance: (params: {
    keyword?: string;
    page?: number;
    size?: number;
  }) => Promise<void>;
  deleteAllowance: (ID: string) => Promise<void>;
  createAllowance: (data: AllowanceInput) => Promise<void>;
  updateAllowance: (ID: string, data: AllowanceInput) => Promise<void>;
}
