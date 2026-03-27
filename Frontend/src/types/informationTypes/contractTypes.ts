import { z } from "zod";

// Schema static
export const ContractSchema = z.object({
  MaHopDong: z.string()
    .min(1, "Mã hợp đồng không được để trống")
    .transform((val) => val.toUpperCase())
    .refine((val) => /^HD\d+$/.test(val), {
      message: "Mã hợp đồng phải có định dạng HDxxx (Ví dụ: HD001, HD123)",
    }),
  MaNV: z.string()
    .min(1, "Mã nhân viên không được để trống")
    .transform((val) => val.toUpperCase()),
  LoaiHD: z.string().min(1, "Loại hợp đồng không được để trống"),
  NgayBatDau: z.string()
    .min(1, "Vui lòng chọn ngày bắt đầu")
    .refine((val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }, {
      message: "Ngày bắt đầu không được lớn hơn ngày hiện tại",
    }),
  NgayKetThuc: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  HinhAnhHopDong: z.any()
    .refine((file) => {
    if (!file) return true;
    if (file instanceof File) {
      if (file.size === 0) return true;
      return file.type === "application/pdf";
    }
    if (typeof file === 'string') return true;
    return false;
  }, {
    message: "Chỉ chấp nhận định dạng file PDF",
  }).nullable().optional(),
  NhanVien: z.object({
    MaNV: z.string(),
    TenNV: z.string().optional(),
  }).optional(),
});

// Schema dynamic for Validation (Check duplicate and date logic)
export const getContractValidationSchema = (
  existingCodes: string[],
  employeeCodes: string[],
  isEdit: boolean = false
) => 
  ContractSchema.extend({
    MaHopDong: z.string()
      .min(1)
      .refine((val) => isEdit || !existingCodes.includes(val), {
        message: "Mã hợp đồng này đã tồn tại",
      }),
    MaNV: z.string()
      .min(1, "Mã nhân viên không được để trống")
      .transform((val) => val.toUpperCase())
      .refine((val) => employeeCodes.includes(val.toUpperCase()), {
        message: "Mã nhân viên không tồn tại trong hệ thống",
      }),
  }).refine((data) => {
    const start = new Date(data.NgayBatDau);
    const end = new Date(data.NgayKetThuc);
    return end >= start;
  }, {
    message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
    path: ["NgayKetThuc"],
  });

export type Contract = z.infer<typeof ContractSchema>;

export interface ContractTypes {
  contracts: Contract[];
  loading: boolean;
  createContract: (data: FormData | Contract) => Promise<void>;
  getContracts: () => Promise<void>;
  updateContract: (ID: string, data: FormData | Contract) => Promise<void>;
  deleteContract: (ID: string) => Promise<void>;
}