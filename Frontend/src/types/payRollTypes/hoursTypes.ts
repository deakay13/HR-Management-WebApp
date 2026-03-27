import { z } from "zod";

/* ================== INPUT (FORM / CREATE / UPDATE) ================== */
export const HoursInputSchema = z.object({
  MaGL: z
    .string()
    .min(1, "Mã giờ làm không được để trống")
    .regex(/^GL\d{3}$/, "Mã phải dạng GLxxx"),

  SoGioLam: z.coerce
    .number() // 🔥 convert string -> number (fix lỗi react-hook-form)
    .min(1, "Số giờ phải lớn hơn 0"),
});

/* OUTPUT (DATA FROM API) */
export const HoursSchema = HoursInputSchema;

/*  TYPES  */
export type HoursInput = z.infer<typeof HoursInputSchema>;
export type Hours = z.infer<typeof HoursSchema>;

/*  STORE  */
export interface HoursTypes {
  Hours: Hours[];
  initializing: boolean;

  clearState: () => void;
  getHours: () => Promise<void>;
  deleteHours: (ID: string) => Promise<void>;

  createHours: (data: HoursInput) => Promise<void>;
  updateHours: (ID: string, data: HoursInput) => Promise<void>;
}