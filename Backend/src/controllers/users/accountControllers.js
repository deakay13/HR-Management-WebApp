import bcrypt from 'bcrypt';
import TaiKhoan from '../../models/auth/TaiKhoan.js';
import NhanVien from '../../models/information/NhanVien.js';
import { Pagination } from '../../utils/paginations.js';
import { formatVNDateTime } from '../../utils/dateFormat.js';
import VaiTro from '../../models/auth/VaiTro.js';
import { accountSchema } from '../../utils/validationSchemas.js';

export const createAccount = async (req, res) => {
    try {

        //get input TenTaiKhoan và MatKhau
        const parsed = accountSchema.safeParse({
            TenTaiKhoan: req.body.TenTaiKhoan,
            MatKhau: req.body.MatKhau,
        });

        //check Validate TenTaiKhoan và MatKhau
        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            return res.status(400).json({ errors: errorMessages });
        }

        const { MaTK, MaNV, MaVT, TenTaiKhoan, MatKhau } = req.body;
        if (!MaTK || !MaNV || !MaVT || !TenTaiKhoan || !MatKhau) {
            return res.status(400).json({ message: "Không được thiếu MaTK, MaNV, MaVT, TaiKhoan và MatKhau" });
        }
        
        //Check if MaTaiKhoan is already taken.
        const dupTenTaiKhoan = await TaiKhoan.findByPk(MaTK)
        if (dupTenTaiKhoan) {
            return res.status(400).json({message: "Tài Khoản đã tồn tại"})
        }

        //check if NhanVien is already taken.
        const dupNhanVien = await NhanVien.findByPk(MaNV)
        if (!dupNhanVien) {
            return res.status(400).json({message: "Nhân viên không tồn tại"})
        }

        //Check employee already has an account.
        const existingAccount = await TaiKhoan.findOne({ where: { MaNV } });
        if (existingAccount) {
            return res.status(400).json({ message: "Nhân viên này đã có tài khoản" });
        }
        
        //check VaiTro exists
        const dupVaiTro = await VaiTro.findByPk(MaVT)
        if (!dupVaiTro) {
            return res.status(404).json({message: "Không có Vai Trò"})
        }

        //HasdedPassword
        const HashedPassword = await bcrypt.hash(MatKhau, 10);

        //create new Account
        await TaiKhoan.create({
            MaTK, MaNV, MaVT, TenTaiKhoan, MatKhau: HashedPassword
        })
        
        return res.status(201).json({message:"Tạo Tài Khoản thành công" });

    } catch (error) {
        
        //Only show error for dev, Can't show detail error for client
        console.error("Lỗi khi tạo tài khoản", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const readAllAccount = async ( req, res) => {
    try {
        const { offset, limit, page, finalSize } = Pagination(req.query);

        const options = {};
        if (limit !== null) {
            options.limit = limit;
            options.offset = offset;
        }

        const { count, rows } = await TaiKhoan.findAndCountAll(options);

        const formattedRows = rows.map((acc) => ({
            MaTK: acc.MaTK,
            MaNV: acc.MaNV,
            MaVT: acc.MaVT,
            TenTaiKhoan: acc.TenTaiKhoan,
            MatKhau: acc.MatKhau,
            createdAt: formatVNDateTime(acc.createdAt),
            updatedAt: formatVNDateTime(acc.updatedAt),
        }));

        return res.status(200).json({
            totalItems: count,
            totalPages: limit ? Math.ceil(count / finalSize) : 1,
            currentPage: page,
            pageSize: finalSize,
            data: formattedRows,
        });

    } catch (error) {
        //Only show error for dev, Can't show detail error for client
        console.error("Lỗi không tìm thấy danh sách tài khoản", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const readAccountById = async (req, res) => {
    try {
        const { ID } = req.params;

        //check TaiKhoan
        if (!ID) {
        return res.status(400).json({ message: "Thiếu MaTK" });
        }

        //get TaiKhoan by MaTK
        const account = await TaiKhoan.findByPk(ID);
        if (!account) {
        return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        //respon status 200
        return res.status(200).json(account);

    } catch (error) {

        //Only show error for dev, Can't show detail error for client
        console.error("Lỗi không tìm thấy tài khoản", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const updateAccountById = async (req, res) => {
    try {
        const { ID } = req.params;
        if (!ID) {
            return res.status(400).json({ message: "Thiếu MaTK để cập nhật tài khoản" });
        }

        const account = await TaiKhoan.findByPk(ID);
        if (!account) {
            return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        const { TenTaiKhoan, MatKhau, MaVT } = req.body;

        // Validate only provided fields
        const updateSchema = z.object({
            TenTaiKhoan: z
                .string()
                .min(1, "Tài khoản đăng nhập không được bỏ trống")
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
            MaVT: z.string().optional(),
        });

        const parsed = updateSchema.safeParse({ TenTaiKhoan, MatKhau, MaVT });
        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            return res.status(400).json({ errors: errorMessages });
        }

        // Check if MaVT exists
        if (MaVT) {
            const role = await VaiTro.findByPk(MaVT);
            if (!role) {
                return res.status(404).json({ message: "Vai trò không tồn tại" });
            }
        }

        // Hash password if provided
        let updatedPassword = account.MatKhau;
        if (MatKhau) {
            updatedPassword = await bcrypt.hash(MatKhau, 10);
        }

        // Update only changed fields
        await account.update({
            TenTaiKhoan: TenTaiKhoan || account.TenTaiKhoan,
            MatKhau: updatedPassword,
            MaVT: MaVT || account.MaVT,
        });
        
        return res.status(200).json({ message: "Cập nhật thành công", account });

    } catch (error) {
        console.error("Lỗi khi cập nhật tài khoản", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const deleteAccount = async (req, res) => {
    try {
        const { ID } = req.params;
        if (!ID) {
            return res.status(400).json({ message: "Thiếu MaTK để xóa tài khoản" });
        }

        const account = await TaiKhoan.findByPk(ID);
        if (!account) {
        return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        //Delete account
        await account.destroy();

        //respon status 200
        return res.status(200).json({ message: "Xoá Tài Khoản thành công" });

    } catch (error) {

        //Only show error for dev, Can't show detail error for client
        console.error("Lỗi khi xóa tài khoản", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
    
}

