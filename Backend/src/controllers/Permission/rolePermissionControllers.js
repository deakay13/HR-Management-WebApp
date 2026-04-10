import VaiTro_Quyen from '../../models/auth/VaiTro_Quyen.js';
import Quyen from '../../models/auth/Quyen.js';
import VaiTro from '../../models/auth/VaiTro.js';
import { Pagination } from '../../utils/paginations.js';
// import { z } from "zod";

// const createPermission_RoleSchema = z.object({
//     MaQuyen: z
//         .string()
//         .min(1, "Mã Quyền không được để trống")
//         .regex(/^MQ\d{3}$/, "Mã Quyền phải có dạng MQxxx"),
//     TenQuyen: z.string()
//     .min(3, "Tên vai Quyền phải có ít nhất 3 ký tự")
// });
// const updatePermission_RoleSchema = z.object({
//     TenQuyen: z.string()
//         .min(3, "Tên vai Quyền phải có ít nhất 3 ký tự")
// });

export const assignPermission_Role = async (req, res) => {
    try {
        const { MaVT, MaQuyen } = req.body;

        const role = await VaiTro.findByPk(MaVT);
        if (!role) {
        return res.status(404).json({ message: "Vai trò không tồn tại" });
        }

        const already = [];

        for (const quyenId of MaQuyen) {
        const permission = await Quyen.findByPk(quyenId);
        if (!permission) {
            return res.status(404).json({ message: `Quyền ${quyenId} không tồn tại` });
        }

        const exist = await VaiTro_Quyen.findOne({ where: { MaVT, MaQuyen: quyenId } });
        if (exist) {
            already.push(`${quyenId} - ${permission.TenQuyen}`);
        } else {
            await VaiTro_Quyen.create({ MaVT, MaQuyen: quyenId });
        }
        }

        if (already.length > 0) {
        return res.status(400).json({
            message: `Vai trò ${MaVT} - ${role.TenVaiTro} đã có các quyền ${already.join(", ")}`
        });
        }

        return res.status(201).json({
        message: `Thêm quyền cho vai trò ${MaVT} - ${role.TenVaiTro} thành công`
        });
    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const getPermission_Role = async (req, res) => {
    try {
        const { offset, limit, page, finalSize } = Pagination(req.query);

        const roles = await VaiTro.findAll({
            include: [{
                model: Quyen,
                through: { attributes: [] },
                attributes: ["MaQuyen", "TenQuyen"]
            }],
            offset,
            limit
        });

        const result = roles.map(role => ({
            MaVT: role.MaVT,
            TenVaiTro: role.TenVaiTro,
            permissions: role.Quyens.map(q => ({
                MaQuyen: q.MaQuyen,
                TenQuyen: q.TenQuyen
            }))
        }));

        return res.status(200).json({
            page,
            size: finalSize,
            data: result
        });
    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const getPermission_RoleById = async (req, res) => { 
    try {
        const { ID } = req.params;

        const role = await VaiTro.findByPk(ID);
        if (!role) {
            return res.status(404).json({ message: "Vai trò không tồn tại" });
        }

        const rolePermissions = await VaiTro_Quyen.findAll({
            where: { MaVT: ID },
            include: [
                { model: Quyen, as: 'Quyen', attributes: ["MaQuyen", "TenQuyen"] }
            ]
        });

        const permissions = rolePermissions.map(rp => ({
            MaQuyen: rp.Quyen.MaQuyen,
            TenQuyen: rp.Quyen.TenQuyen
        }));

        return res.status(200).json({
            role: { MaVT: role.MaVT, TenVaiTro: role.TenVaiTro },
            permissions
        });

    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const updatePermission_Role = async (req, res) => {
    try {
        const { ID } = req.params;
        const { oldQuyen, newQuyen } = req.body;

        const role = await VaiTro.findByPk(ID);
        if (!role) {
            return res.status(404).json({ message: "Vai trò không tồn tại" });
        }

        const mapping = await VaiTro_Quyen.findOne({ where: { MaVT: ID, MaQuyen: oldQuyen } });
        if (!mapping) {
            return res.status(404).json({ message: `Vai trò chưa có quyền ${oldQuyen}` });
        }

        const newPermission = await Quyen.findByPk(newQuyen);
        if (!newPermission) {
            return res.status(404).json({ message: `Quyền ${newQuyen} không tồn tại` });
        }

        await mapping.destroy();
        await VaiTro_Quyen.create({ MaVT: ID, MaQuyen: newQuyen });

        const updatedPermissions = await VaiTro_Quyen.findAll({
            where: { MaVT:ID },
            include: [{ model: Quyen, as: 'Quyen', attributes: ["MaQuyen", "TenQuyen"] }]
        });

        const permissions = updatedPermissions.map(rp => ({
            MaQuyen: rp.Quyen.MaQuyen,
            TenQuyen: rp.Quyen.TenQuyen
        }));

        return res.status(200).json({
            message: `Cập nhật quyền cho vai trò ${ID} - ${role.TenVaiTro} thành công: ${oldQuyen} → ${newQuyen}`,
            role: { MaVT: role.MaVT, TenVaiTro: role.TenVaiTro },
            permissions
        });

    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const deleteAllPermission_Role = async (req, res) => {
    try {
        const { IDR } = req.params; // lấy role ID từ URL

        const role = await VaiTro.findByPk(IDR);
        if (!role) {
            return res.status(404).json({ message: "Vai trò không tồn tại" });
        }

        // Xóa tất cả quyền của vai trò này
        await VaiTro_Quyen.destroy({ where: { MaVT: IDR } });

        return res.status(200).json({
            message: `Đã xóa toàn bộ quyền khỏi vai trò ${IDR} - ${role.TenVaiTro}`,
            role: { MaVT: role.MaVT, TenVaiTro: role.TenVaiTro },
            permissions: []
        });
    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const deletePermission_RoleOnePermission = async (req, res) => {
    try {
        const { IDR, IDP } = req.params;

        const role = await VaiTro.findByPk(IDR);
        if (!role) {
        return res.status(404).json({ message: "Vai trò không tồn tại" });
        }

        const mapping = await VaiTro_Quyen.findOne({ where: { MaVT: IDR, MaQuyen: IDP } });
        if (!mapping) {
        return res.status(404).json({ message: `Vai trò ${IDR} chưa có quyền ${IDP}` });
        }

        await mapping.destroy();

        const updatedPermissions = await VaiTro_Quyen.findAll({
            where: { MaVT: IDR },
            include: [{ model: Quyen, as: 'Quyen', attributes: ["MaQuyen", "TenQuyen"] }]
        });

        const permissions = updatedPermissions.map(rp => ({
            MaQuyen: rp.Quyen.MaQuyen,
            TenQuyen: rp.Quyen.TenQuyen
        }));

        return res.status(200).json({
            message: `Đã xóa quyền ${IDP} khỏi vai trò ${IDR} - ${role.TenVaiTro}`,
            role: { MaVT: role.MaVT, TenVaiTro: role.TenVaiTro },
            permissions
        });

    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" }); 
    }
};
