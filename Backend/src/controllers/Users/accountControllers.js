import bcrypt from 'bcrypt';
import { z } from 'zod';
import TaiKhoan from '../../models/auth/TaiKhoan.js';
import NhanVien from '../../models/information/NhanVien.js';
import VaiTro from '../../models/auth/VaiTro.js';

const accountSchema = z.object({
    TenTaiKhoan: z
        .string()
        .min(5, "Tài Khoản đăng nhập phải có ít nhất 5 ký tự")
        .max(50, "Tài khoản đăng nhập không quá 50 ký tự")
        .regex(/^[a-zA-Z0-9._]+$/, "Chỉ cho phép chữ, số, dấu chấm và gạch dưới")
        .regex(/^TK\d{3}$/, "Mã vai trò phải có dạng VTxxx"),
    MatKhau: z
        .string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .regex(/[A-Z]/, "Phải có ít nhất một chữ hoa")
        .regex(/[a-z]/, "Phải có ít nhất một chữ thường")
        .regex(/[0-9]/, "Phải có ít nhất một chữ số")
        .regex(/[@#$%!^&*]/, "Phải có ít nhất một ký tự đặc biệt"),
});

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
        
        //return status No Content can't show data
        return res.sendStatus(204);

    } catch (error) {
        
        //Only show error for dev, Can't show detail error for client
        console.error("Lỗi khi tạo tài khoản", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const readAllAccount = async ( req, res) => {
    try {
        const accounts = await TaiKhoan.findAll();
        return res.status(200).json(accounts);
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
        //check MaTK
        if (!ID) {
        return res.status(400).json({ message: "Thiếu MaTK để cập nhật tài khoản" });
        }

        //find TaiKhoan by ID
        const account = await TaiKhoan.findByPk(ID);
        if (!account) {
        return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        const { TenTaiKhoan, MatKhau } = req.body;

        //HashedPassword again if update new password
        let updatedPassword = account.MatKhau;
        if (MatKhau) {
        updatedPassword = await bcrypt.hash(MatKhau, 10);
        }

        //update TaiKhoan
        await account.update({
            TenTaiKhoan: TenTaiKhoan || account.TenTaiKhoan,
            MatKhau: updatedPassword,
        });
        
        //respon status 200
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

