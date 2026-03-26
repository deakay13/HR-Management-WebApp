import z from "zod";

export const EmployeeSchema = z.object({
    MaNV: z.string(),
    MaPB: z.string(),
    HoVaTen: z.string().min(2).max(100),
    GioiTinh: z.enum(["Nam", "Nữ", "Khác"]),
    NgaySinh: z.string().refine((date) => !isNaN(Date.parse(date)), {
    }),
    DiaChi: z.string().max(255).optional(),
    SDT: z.string().regex(/^[0-9]{10}$/),
    NgayVaoLam: z.string().refine((date) => !isNaN(Date.parse(date)), {}
    ),
    HinhAnh: z.string(),
});

export type Employee = z.infer<typeof EmployeeSchema>;

export interface EmployeeTypes {
  employees: Employee[];
  initializing: boolean;
  clearState: () => void;
  createEmployee: (data: Employee) => Promise<void>;
  getEmployees: () => Promise<void>;
  updateEmployee: (ID: string, data: Employee) => Promise<void>;
  deleteEmployee: (ID: string) => Promise<void>;
}