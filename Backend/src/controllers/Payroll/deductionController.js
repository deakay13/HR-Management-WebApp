import KhauTru from "../../models/salary/KhauTru.js";
import { z } from "zod";

const createDeductionSchema = z.object({
    MaKT: z
        .string()
        .min(1, "Mã khấu trừ không được để trống")
        .regex(/^KT\d{3}$/, "Mã khấu trừ phải có dạng KTxxx"),

    LoaiKT: z
        .string()
        .min(1, "Loại khấu trừ không được để trống"),

    PhanTram: z.coerce
        .number(
             "Phần trăm phải là số"
        )
        .min(0, "Phần trăm không hợp lệ")
        .max(100, "Phần trăm không được vượt quá 100")
});

const updateDeductionSchema = z.object({
    LoaiKT: z
        .string()
        .min(1, "Loại khấu trừ không được để trống"),

    PhanTram: z.coerce
        .number(
             "Phần trăm phải là số"
        )
        .min(0, "Phần trăm không hợp lệ")
        .max(100, "Phần trăm không được vượt quá 100")
});
export const createDeduction = async (req, res) => {
    try {

        const parsed = createDeductionSchema.safeParse({
            MaKT: req.body.MaKT,
            LoaiKT: req.body.LoaiKT,
            PhanTram: req.body.PhanTram
        });

        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            return res.status(400).json({ errors: errorMessages });
        }

        const { MaKT, LoaiKT, PhanTram } = parsed.data;

        const existId = await KhauTru.findByPk(MaKT);
        if (existId) {
            return res.status(400).json({ message: "Mã khấu trừ đã tồn tại" });
        }

        const existType = await KhauTru.findOne({ where: { LoaiKT } });
        if (existType) {
            return res.status(400).json({ message: "Loại khấu trừ đã tồn tại" });
        }
        

        const deduction = await KhauTru.create({ MaKT, LoaiKT, PhanTram });

        return res.status(201).json({
            message: "Tạo khấu trừ thành công",
            deduction
        });

    } catch (error) {
        console.error("Lỗi khi tạo khấu trừ:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const getDeductions = async (req, res) => {
    try {

        const deductions = await KhauTru.findAll();

        return res.status(200).json(deductions);

    } catch (error) {

        console.error("Lỗi không tìm thấy danh sách khấu trừ", error);

        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const getDeductionById = async (req, res) => {
    try {

        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({ message: "Thiếu ID" });
        }

        const deduction = await KhauTru.findByPk(ID);

        if (!deduction) {
            return res.status(404).json({ message: "Khấu trừ không tồn tại" });
        }

        return res.status(200).json(deduction);

    } catch (error) {

        console.error("Lỗi không tìm thấy khấu trừ", error);

        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const updateDeduction = async (req, res) => {
    try {

        const parsed = updateDeductionSchema.safeParse({
            LoaiKT: req.body.LoaiKT,
            PhanTram: req.body.PhanTram
        });

        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }));
            return res.status(400).json({ errors: errorMessages });
        }
        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({ message: "Thiếu ID để cập nhật khấu trừ" });
        }
        const deduction = await KhauTru.findByPk(ID);

        if (!deduction) {
            return res.status(404).json({ message: "Khấu trừ không tồn tại" });
        }

        const existType = await KhauTru.findOne({
            where: { LoaiKT: parsed.data.LoaiKT }
        });

        if (existType && existType.MaKT !== req.params.MaKT) {
            return res.status(400).json({ message: "Loại khấu trừ đã tồn tại" });
        }

        await deduction.update({
            LoaiKT: parsed.data.LoaiKT,
            PhanTram: parsed.data.PhanTram
        });

        res.status(200).json({
            message: "Cập nhật khấu trừ thành công",
            deduction
        });

    } catch (error) {
        console.error("Lỗi khi cập nhật khấu trừ:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const deleteDeduction = async (req, res) => {
    try {

        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({ message: "Thiếu ID để xóa khấu trừ" });
        }

        const deduction = await KhauTru.findByPk(ID);

        if (!deduction) {
            return res.status(404).json({ message: "Khấu trừ không tồn tại" });
        }

        await deduction.destroy();

        return res.status(200).json({
            message: "Xóa khấu trừ thành công"
        });

    } catch (error) {

        console.error("Lỗi khi xóa khấu trừ:", error);

        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};