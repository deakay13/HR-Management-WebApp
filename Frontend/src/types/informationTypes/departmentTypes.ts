import z from "zod";

export const DepartmentSchema = z.object({
  MaPB: z.string(),
  TenPB: z.string().min(2).max(100),
  MoTa: z.string().max(255).optional(),
});

export type Department = z.infer<typeof DepartmentSchema>;

export interface DepartmentTypes {
  departments: Department[];
  initializing: boolean;
  clearState: () => void;
  createDepartment: (data: Department) => Promise<void>;
  getDepartments: () => Promise<void>;
  updateDepartment: (ID: string, data: Department) => Promise<void>;
  deleteDepartment: (ID: string) => Promise<void>;
}