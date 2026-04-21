import { z } from "zod";

/* ================== INPUT (FORM / CREATE / UPDATE) ================== */
export const HoursInputSchema = z.object({
  MaGL: z
    .string()
    .min(1, "Mã giờ làm không được để trống")
    .regex(/^GL\d{3,}$/, "Mã phải bắt đầu bằng GL và có ít nhất 3 chữ số"),

  SoGioLam: z.coerce
    .number({ message: "Số giờ phải là một con số" }) 
    .min(1, "Số giờ phải lớn hơn 0"),
  SoNgayLam: z.coerce
    .number({ message: "Số ngày phải là một con số" })
    .min(1, "Số ngày công phải lớn hơn 0"),
  TongSoGio: z.coerce.number({ message: "Tổng số giờ phải là một con số" }),
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