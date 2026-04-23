import { z } from "zod";

// Schema static
export const DepartmentSchema = z.object({
  MaPB: z.string().min(1, "Mã phòng ban không được để trống"),
  TenPB: z.string().min(2, "Tên phòng ban phải từ 2 ký tự").max(100),
  MoTa: z.string().max(255).optional().nullable(),
});

// Schema dynamic for Validation (Check duplicate )
export const getDepartmentValidationSchema = (existingCodes: string[]) =>
  DepartmentSchema.extend({
    MaPB: z
      .string()
      .min(1)
      .refine((val) => !existingCodes.includes(val), {
        message: "Mã phòng ban này đã tồn tại",
      }),
  });

export type Department = z.infer<typeof DepartmentSchema>;

export interface DepartmentTypes {
  departments: Department[];
  initializing: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  searchParams: any;
  clearState: () => void;
  createDepartment: (data: Department) => Promise<void>;
  getDepartments: (params?: any) => Promise<void>;
  searchDepartments: (params?: any) => Promise<void>;
  updateDepartment: (ID: string, data: Department) => Promise<void>;
  deleteDepartment: (ID: string) => Promise<void>;
}
