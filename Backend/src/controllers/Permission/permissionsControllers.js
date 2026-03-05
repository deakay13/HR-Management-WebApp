import Quyen from '../../models/auth/Quyen.js';
import { z } from "zod";

const createPermissionSchema = z.object({
    MaQuyen: z
        .string()
        .min(1, "Mã vai trò không được để trống")
        .regex(/^MQ\d{3}$/, "Mã vai trò phải có dạng VTxxx"),
    TenQuyen: z.string()
    .min(3, "Tên vai trò phải có ít nhất 3 ký tự")
    .min(1, "Tên vai trò không được để trống"),
});
const updatePermissionSchema = z.object({
    TenQuyen: z.string()
        .min(3, "Tên vai trò phải có ít nhất 3 ký tự")
        .min(1, "Tên vai trò không được để trống"),
});

export const createPermission = async (req, res) => {
    try {
        //validate input
        const parsed = createPermissionSchema.safeParse({
            MaQuyen: req.body.MaQuyen,
            TenQuyen: req.body.TenQuyen
        });
        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            return res.status(400).json({ errors: errorMessages });
        }
        //create permissions
        const { MaQuyen, TenQuyen } = parsed.data;

        //check Quyen by MaQuyen
        const permissionId= await Quyen.findByPk(MaQuyen);
        if (permissionId) {
            return res.status(400).json({ message: "Vai trò đã tồn tại" });
        }

        //check TenVaiTro
        const permissionName = await Quyen.findOne({ where: { TenQuyen } });
        if (permissionName) {
            return res.status(400).json({ message: "Tên vai trò đã tồn tại" });
        }

        const permission = await Quyen.create({ MaQuyen, TenQuyen });
        
        //respon status 200
        return res.status(200).json({ message: "Tạo Vai trò thành công", permission });

    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const getPermissions = async (req, res) => {
    try {

        const permissions = await Quyen.findAll();
        return res.status(200).json(permissions);

    } catch (error) {
        console.error("Lỗi không tìm thấy danh sách", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const getPermissionsById = async (req, res) => {
    try {
        const { ID } = req.params;

        //check Quyen
        if (!ID) {
        return res.status(400).json({ message: "Thiếu MaQuyen" });
        }

        //get QUyen by MaQuyen
        const permissions = await Quyen.findByPk(ID);
        if (!permissions) {
        return res.status(404).json({ message: "Quyền không tồn tại" });
        }

        //respon status 200
        return res.status(200).json(permissions);
    } catch (error) {
        console.error("Lỗi không tìm thấy danh sách", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const updatePermission = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}
export const deletePermission = async (req, res) => {
    try {
        const { ID } = req.params;
        if (!ID) {
            return res.status(400).json({ message: "Thiếu MaQuyen để xóa quyền" });
        }

        const permission = await Quyen.findByPk(ID);
        if (!permission) {
            return res.status(404).json({ message: "Quyền không tồn tại" });
        }

        //Delete account
        await permission.destroy();

        //respon status 200
        return res.status(200).json({ message: "Xoá Quyền thành công" });
    } catch (error) {
        console.error("Lỗi khi gọi", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}