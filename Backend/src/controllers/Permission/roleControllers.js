import VaiTro from '../../models/auth/VaiTro.js';
import { z } from "zod";

const createroleSchema = z.object({
    MaVT: z
        .string()
        .min(1, "Mã vai trò không được để trống")
        .regex(/^VT\d{3}$/, "Mã vai trò phải có dạng VTxxx"),
    TenVaiTro: z.string()
        .min(3, "Tên vai trò phải có ít nhất 3 ký tự")
        .min(1, "Tên vai trò không được để trống"),
});
const updateRoleSchema = z.object({
    TenVaiTro: z.string()
        .min(3, "Tên vai trò phải có ít nhất 3 ký tự")
        .min(1, "Tên vai trò không được để trống"),
});

export const createRole = async (req, res) => {
    try {
        //validate input
        const parsed = createroleSchema.safeParse({
            MaVT: req.body.MaVT,
            TenVaiTro: req.body.TenVaiTro
        });
        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            return res.status(400).json({ errors: errorMessages });
        }

        //create Role
        const { MaVT, TenVaiTro } = parsed.data;

        //check VaiTro by MaVT
        const roleId= await VaiTro.findByPk(MaVT);
        if (roleId) {
            return res.status(400).json({ message: "Vai trò đã tồn tại" });
        }

        //check TenVaiTro
        const RoleName = await VaiTro.findOne({ where: { TenVaiTro } });
        if (RoleName) {
            return res.status(400).json({ message: "Tên vai trò đã tồn tại" });
        }

        const role = await VaiTro.create({ MaVT, TenVaiTro });
        
        //respon status 200
        return res.status(200).json({ message: "Tạo Vai trò thành công", role });
        
    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const getRoles = async (req, res) => {
    try {
        const roles = await VaiTro.findAll();
        return res.status(200).json(roles);
    } catch (error) {
        console.error("Lỗi không tìm thấy danh sách", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const getRolesById = async (req,res) => {
    try {
        const { ID } = req.params;

        //check TaiKhoan
        if (!ID) {
        return res.status(400).json({ message: "Thiếu MaVT" });
        }

        //get TaiKhoan by MaTK
        const roles = await VaiTro.findByPk(ID);
        if (!roles) {
        return res.status(404).json({ message: "Vai trò không tồn tại" });
        }

        //respon status 200
        return res.status(200).json(roles);

    } catch (error) {

        //Only show error for dev, Can't show detail error for client
        console.error("Lỗi không tìm thấy Vai Trò", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const updateRole = async (req,res) => {
    try {
        const parsed = updateRoleSchema.safeParse({
            TenVaiTro: req.body.TenVaiTro
        });
        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            return res.status(400).json({ errors: errorMessages });
        }

        const role = await VaiTro.findByPk(req.params.ID);
        if (!role) return res.status(404).json({ message: "không tìm thấy vai trò" });

        await role.update({ TenVaiTro: parsed.data.TenVaiTro });
        res.status(200).json({ message: "Cập nhật thành công", role});
    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const deleteRole = async (req,res) => {
    try {
        const { ID } = req.params;
        if (!ID) {
            return res.status(400).json({ message: "Thiếu MaVT để xóa vai trò" });
        }

        const role = await VaiTro.findByPk(ID);
        if (!role) {
            return res.status(404).json({ message: "Vai Trò không tồn tại" });
        }

        //Delete account
        await role.destroy();

        //respon status 200
        return res.status(200).json({ message: "Xoá Vai Trò thành công" });
    } catch (error) {

        //Only show error for dev, Can't show detail error for client
        console.error("Lỗi khi xóa Vai Trò", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}