import Quyen from '../../models/auth/Quyen.js';
import { Pagination } from '../../utils/paginations.js';
import { z } from "zod";

const createPermissionSchema = z.object({
    MaQuyen: z
        .string()
        .min(1, "Mã Quyền không được để trống")
        .regex(/^MQ\d{3}$/, "Mã Quyền phải có dạng MQxxx"),
    TenQuyen: z.string()
    .min(3, "Tên vai Quyền phải có ít nhất 3 ký tự")
});
const updatePermissionSchema = z.object({
    TenQuyen: z.string()
        .min(3, "Tên vai Quyền phải có ít nhất 3 ký tự")
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
            return res.status(400).json({ message: "Quyền đã tồn tại" });
        }

        //check TenVaiTro
        const permissionName = await Quyen.findOne({ where: { TenQuyen } });
        if (permissionName) {
            return res.status(400).json({ message: "Tên Quyền đã tồn tại" });
        }

        const permission = await Quyen.create({ MaQuyen, TenQuyen });
        
        //respon status 200
        return res.status(201).json({ message: "Tạo Quyền thành công", permission });

    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const getPermissions = async (req, res) => {
    try {
        //set page and size rows in papge
        const { offset, limit, page, finalSize } = Pagination(req.query);

        const options = {};
        if (limit !== null) {
        options.limit = limit;
        options.offset = offset;
        }

        const { count, rows } = await Quyen.findAndCountAll(options);

        return res.status(200).json({
        totalItems: count,
        totalPages: limit ? Math.ceil(count / finalSize) : 1,
        currentPage: page,
        pageSize: finalSize,
        data: rows,
        });

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
        const parsed = updatePermissionSchema.safeParse({
            TenQuyen: req.body.TenQuyen
        });
        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            return res.status(400).json({ errors: errorMessages });
        }
        
        const { ID } = req.params;
        const permission = await Quyen.findByPk(req.params.ID);
        if (!permission) return res.status(404).json({ message: "Không tìm thấy Quyền" });

        const existName = await Quyen.findOne({
            where: { TenQuyen: parsed.data.TenQuyen }
        });

        if (existName && existName.MaQuyen !== ID) {
            return res.status(400).json({ message: "Tên Quyền đã tồn tại" });
        }

        await permission.update({ TenQuyen: parsed.data.TenQuyen });
        res.status(200).json({ message: "Cập nhật thành công", permission});
    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
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