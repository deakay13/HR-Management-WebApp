import bcrypt from 'bcrypt';
import TaiKhoan from '../../models/auth/TaiKhoan.js';
import NhanVien from '../../models/information/NhanVien.js';
import VaiTro from '../../models/auth/VaiTro.js';

export const CreateAccount = async (req, res) => {
    try {
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
        console.error("Lỗi khi gọi", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}