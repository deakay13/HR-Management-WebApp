import { z } from "zod";

export const EmployeeSchema = z.object({
  MaNV: z.string()
    .min(1, "Mã nhân viên không được để trống")
    .transform((val) => val.toUpperCase())
    .refine((val) => /^NV\d+$/.test(val), {
      message: "Mã nhân viên phải có định dạng NVxxx (Ví dụ: NV001)",
    }),
  MaPB: z.string().min(1, "Vui lòng chọn phòng ban"),
  HoVaTen: z.string().min(1, "Họ và tên không được để trống"),
  GioiTinh: z.enum(["Nam", "Nữ", "Khác"], {
    message: "Vui lòng chọn giới tính",
  }),
  NgaySinh: z.string().min(1, "Ngày sinh không được để trống"),
  SDT: z.string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(11, "Số điện thoại không quá 11 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  NgayVaoLam: z.string()
    .min(1, "Ngày vào làm không được để trống")
    .refine((val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }, {
      message: "Ngày vào làm không được lớn hơn ngày hiện tại",
    }),
  DiaChi: z.string().min(1, "Địa chỉ không được để trống"),
  HinhAnh: z.string().nullable().optional(),
});

export const getEmployeeValidationSchema = (existingCodes: string[], isEdit: boolean = false) =>
  EmployeeSchema.refine((data) => {
    if (!isEdit && existingCodes.map(c => c.toUpperCase()).includes(data.MaNV.toUpperCase())) {
      return false;
    }
    return true;
  }, {
    message: "Mã nhân viên này đã tồn tại",
    path: ["MaNV"], 
  });

export type Employee = z.infer<typeof EmployeeSchema> & {
  PhongBan?: {
    MaPB: string;
    TenPB: string;
  };
};

export interface EmployeeTypes {
  employees: Employee[];
  initializing: boolean; 
  clearState: () => void;
  createEmployee: (data: Employee) => Promise<void>;
  getEmployees: () => Promise<void>;
  searchEmployees: (filters: { keyword?: string; MaPB?: string }) => Promise<void>;
  updateEmployee: (ID: string, data: Employee | FormData) => Promise<void>;
  deleteEmployee: (ID: string) => Promise<void>;
}