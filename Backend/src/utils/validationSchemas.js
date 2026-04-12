import { z } from 'zod';

export const accountSchema = z.object({
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
