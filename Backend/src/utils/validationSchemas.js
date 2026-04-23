import { z } from "zod";

export const accountSchema = z.object({
  MaTK: z.string().min(1, "Mã tài khoản không được để trống"),
  MaNV: z.string().min(1, "Mã nhân viên không được để trống"),
  MaVT: z.string().min(1, "Mã vai trò không được để trống"),
  TenTaiKhoan: z
    .string()
    .min(1, "Tài khoản đăng nhập không được bỏ trống")
    .min(5, "Tài Khoản đăng nhập phải có ít nhất 5 ký tự")
    .max(50, "Tài khoản đăng nhập không quá 50 ký tự")
    .regex(/^[a-zA-Z0-9._]+$/, "Chỉ cho phép chữ, số, dấu chấm và gạch dưới"),
  MatKhau: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Phải có ít nhất một chữ hoa")
    .regex(/[a-z]/, "Phải có ít nhất một chữ thường")
    .regex(/[0-9]/, "Phải có ít nhất một chữ số")
    .regex(/[@#$%!^&*]/, "Phải có ít nhất một ký tự đặc biệt"),
});

// Separate schema for update (all fields optional, but must be valid if provided)
export const accountUpdateSchema = z.object({
  MaVT: z.string().min(1, "Mã vai trò không được để trống").optional(),
  TenTaiKhoan: z
    .string()
    .min(5, "Tài Khoản đăng nhập phải có ít nhất 5 ký tự")
    .max(50, "Tài khoản đăng nhập không quá 50 ký tự")
    .regex(/^[a-zA-Z0-9._]+$/, "Chỉ cho phép chữ, số, dấu chấm và gạch dưới")
    .optional(),
  MatKhau: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Phải có ít nhất một chữ hoa")
    .regex(/[a-z]/, "Phải có ít nhất một chữ thường")
    .regex(/[0-9]/, "Phải có ít nhất một chữ số")
    .regex(/[@#$%!^&*]/, "Phải có ít nhất một ký tự đặc biệt")
    .optional(),
});

export const employeeSchema = z.object({
  MaNV: z
    .string()
    .min(1, "Mã nhân viên không được để trống")
    .regex(/^NV\d+$/, "Mã nhân viên phải có định dạng NVxxx (Ví dụ: NV001)"),
  MaPB: z.string().min(1, "Vui lòng chọn phòng ban"),
  HoVaTen: z.string().min(1, "Họ và tên không được để trống"),
  GioiTinh: z.enum(["Nam", "Nữ", "Khác"], {
    errorMap: () => ({ message: "Vui lòng chọn giới tính" }),
  }),
  NgaySinh: z.string().min(1, "Ngày sinh không được để trống"),
  SDT: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(11, "Số điện thoại không quá 11 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  NgayVaoLam: z.string().min(1, "Ngày vào làm không được để trống"),
  DiaChi: z.string().min(1, "Địa chỉ không được để trống"),
  HinhAnh: z.string().nullable().optional(),
});

export const departmentSchema = z.object({
  MaPB: z.string().min(1, "Mã phòng ban không được để trống"),
  TenPB: z.string().min(2, "Tên phòng ban phải từ 2 ký tự").max(100),
  MoTa: z.string().max(255).optional().nullable(),
});

export const contractSchema = z.object({
  MaHopDong: z
    .string()
    .min(1, "Mã hợp đồng không được để trống")
    .regex(/^HD\d+$/, "Mã hợp đồng phải có định dạng HDxxx (Ví dụ: HD001, HD123)"),
  MaNV: z.string().min(1, "Mã nhân viên không được để trống"),
  LoaiHD: z.string().min(1, "Loại hợp đồng không được để trống"),
  NgayBatDau: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  NgayKetThuc: z.string().nullable().optional(),
  NgayKy: z.string().nullable().optional(),
  ChucDanh: z.string().nullable().optional(),
  MaPB: z.string().nullable().optional(),
  MaLCB: z.string().nullable().optional(),
  MaPC: z.string().nullable().optional(),
  HinhThucTraLuong: z.string().nullable().optional(),
  TinhTrang: z.string().nullable().optional(),
}).refine(
  (data) => {
    if (!data.NgayKetThuc) return true;
    const start = new Date(data.NgayBatDau);
    const end = new Date(data.NgayKetThuc);
    return end >= start;
  },
  {
    message: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
    path: ["NgayKetThuc"],
  }
);

// Update schema with all fields optional (valid if provided)
export const contractUpdateSchema = z.object({
  MaNV: z.string().min(1, "Mã nhân viên không được để trống").optional(),
  LoaiHD: z.string().min(1, "Loại hợp đồng không được để trống").optional(),
  NgayBatDau: z.string().min(1, "Vui lòng chọn ngày bắt đầu").optional(),
  NgayKetThuc: z.string().nullable().optional(),
  NgayKy: z.string().nullable().optional(),
  ChucDanh: z.string().nullable().optional(),
  MaPB: z.string().nullable().optional(),
  MaLCB: z.string().nullable().optional(),
  MaPC: z.string().nullable().optional(),
  HinhThucTraLuong: z.string().nullable().optional(),
  TinhTrang: z.string().nullable().optional(),
});

export const allowanceSchema = z.object({
  MaPC: z
    .string()
    .min(1, "Mã phụ cấp không được để trống")
    .regex(/^PC\d{3}$/, "Mã phải dạng PCxxx"),
  LoaiPC: z.string().min(1, "Loại phụ cấp không được để trống"),
  SoTien: z.coerce.number().min(10000, "Số tiền phải lớn hơn hoặc bằng 10000"),
});

export const baseSalarySchema = z.object({
  MaLCB: z
    .string()
    .min(1, "Mã lương cơ bản không được để trống")
    .regex(/^LCB\d{3}$/, "Mã phải dạng LCBxxx"),
  LuongCB: z.coerce.number().min(1, "Lương phải lớn hơn 0"),
});

export const deductionSchema = z.object({
  MaKT: z
    .string()
    .min(1, "Mã khấu trừ không được để trống")
    .regex(/^KT\d{3}$/, "Mã phải dạng KTxxx"),
  LoaiKT: z.string().min(1, "Loại khấu trừ không được để trống"),
  PhanTram: z.coerce
    .number()
    .min(0, "Phần trăm phải >= 0")
    .max(100, "Phần trăm không được vượt quá 100"),
});

export const hoursSchema = z.object({
  MaGL: z
    .string()
    .min(1, "Mã giờ làm không được để trống")
    .regex(/^GL\d{3}$/, "Mã phải dạng GLxxx"),
  SoGioLam: z.coerce.number().min(1, "Số giờ phải lớn hơn 0"),
  SoNgayLam: z.coerce.number().min(1, "Số ngày công phải lớn hơn 0"),
  TongSoGio: z.coerce.number().optional(),
});

export const payRollSchema = z.object({
  MaBL: z
    .string()
    .min(1, "Mã bảng lương không được để trống")
    .regex(/^BL\d{3}$/, "Mã phải dạng BLxxx"),
  MaNV: z.string().min(1, "Mã nhân viên không được để trống"),
  MaLCB: z.string().min(1, "Mã lương cơ bản không được để trống"),
  MaPC: z.string().min(1, "Mã phụ cấp không được để trống"),
  MaGL: z.string().min(1, "Mã giờ làm không được để trống"),
  MaKT: z.string().min(1, "Mã khấu trừ không được để trống"),
  Thang: z.string().min(1, "Tháng không được để trống"),
  SoNgayLam: z.coerce.number().min(1, "Số ngày làm phải ít nhất là 1"),
});

export const roleSchema = z.object({
  MaVT: z.string().min(1, "Mã vai trò không được để trống").regex(/^VT\d{3}$/, "Mã vai trò phải có dạng VTxxx"),
  TenVaiTro: z.string().min(3, "Tên vai trò phải có ít nhất 3 ký tự"),
});

export const permissionSchema = z.object({
  MaQuyen: z.string().min(1, "Mã Quyền không được để trống").regex(/^MQ\d{3}$/, "Mã Quyền phải có dạng MQxxx"),
  TenQuyen: z.string().min(3, "Tên quyền phải có ít nhất 3 ký tự"),
});
