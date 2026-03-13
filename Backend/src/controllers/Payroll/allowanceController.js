import PhuCap from "../../models/salary/PhuCap.js";
import { z } from "zod";

const createPhuCapSchema = z.object({
    MaPC: z
        .string()
        .min(1, "Mã phụ cấp không được để trống")
        .regex(/^PC\d{3}$/, "Mã phụ cấp phải có dạng PCxxx"),

    LoaiPC: z
        .string()
        .min(1, "Loại phụ cấp không được để trống"),

    SoTien: z.coerce
        .number(
             "Số tiền phải là số"
    )
        .min(1000, "Số tiền phải lớn hơn 1000")
});
const updatePhuCapSchema = z.object({
    LoaiPC: z
        .string()
        .min(1, "Loại phụ cấp không được để trống"),
    SoTien: z.coerce
        .number(
             "Số tiền phải là số"
        )
        .min(1000, "Số tiền phải lớn hơn 1000")
});
export const createAllowance = async (req, res) => {
    try {

        const parsed = createPhuCapSchema.safeParse({
            MaPC: req.body.MaPC,
            LoaiPC: req.body.LoaiPC,
            SoTien: req.body.SoTien
        });

        if (!parsed.success) {

            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));

            return res.status(400).json({ errors: errorMessages });
        }

        const { MaPC, LoaiPC, SoTien } = parsed.data;

        const existId = await PhuCap.findByPk(MaPC);
        if (existId) {
            return res.status(400).json({ message: "Mã phụ cấp đã tồn tại" });
        }

        const existType = await PhuCap.findOne({
            where: { LoaiPC }
        });

        if (existType) {
            return res.status(400).json({ message: "Loại phụ cấp đã tồn tại" });
        }

        const phuCap = await PhuCap.create({
            MaPC,
            LoaiPC,
            SoTien
        });

        return res.status(201).json({
            message: "Tạo phụ cấp thành công",
            phuCap
        });

    } catch (error) {

        console.error("Lỗi khi tạo phụ cấp:", error);

        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const getAllowances = async (req, res) => {
    try {

        const phuCaps = await PhuCap.findAll();

        return res.status(200).json(phuCaps);

    } catch (error) {

        console.error("Lỗi khi lấy danh sách phụ cấp:", error);

        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const getAllowanceById = async (req, res) => {
    try {

        const { ID } = req.params;

        const phuCap = await PhuCap.findByPk(ID);

        if (!phuCap) {
            return res.status(404).json({
                message: "Phụ cấp không tồn tại"
            });
        }

        return res.status(200).json(phuCap);

    } catch (error) {

        console.error("Lỗi khi tìm phụ cấp:", error);

        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const updateAllowance = async (req, res) => {
    try {

        const parsed = updatePhuCapSchema.safeParse({
            LoaiPC: req.body.LoaiPC,
            SoTien: req.body.SoTien
        });

        if (!parsed.success) {

            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));

            return res.status(400).json({ errors: errorMessages });
        }

        const { ID } = req.params;

        const phuCap = await PhuCap.findByPk(ID);

        if (!phuCap) {
            return res.status(404).json({
                message: "Phụ cấp không tồn tại"
            });
        }

        await phuCap.update({
            LoaiPC: parsed.data.LoaiPC,
            SoTien: parsed.data.SoTien
        });

        return res.status(200).json({
            message: "Cập nhật phụ cấp thành công",
            phuCap
        });

    } catch (error) {

        console.error("Lỗi khi cập nhật phụ cấp:", error);

        return res.status(500).json({
            message: "Lỗi hệ thống"
        });
    }
};
export const deleteAllowance = async (req, res) => {
    try {

        const { ID } = req.params;

        const phuCap = await PhuCap.findByPk(ID);

        if (!phuCap) {
            return res.status(404).json({
                message: "Phụ cấp không tồn tại"
            });
        }

        await phuCap.destroy();

        return res.status(200).json({
            message: "Xóa phụ cấp thành công"
        });

    } catch (error) {

        console.error("Lỗi khi xóa phụ cấp:", error);

        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};