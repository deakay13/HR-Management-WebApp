import LuongCoBan from "../../models/salary/LuongCoBan.js";
import { z } from "zod";
const createBaseSalarySchema = z.object({
    MaLCB: z    
        .string()
        .min(1, "Mã lương cơ bản không được để trống")
        .regex(/^LCB\d{3}$/, "Mã lương cơ bản phải có dạng LCBxxx"),

    LuongCB: z.coerce
        .number(
             "Lương cơ bản phải là số"
        )
        .min(1000000, "Lương cơ bản phải lớn hơn 1.000.000")
        .max(1000000000, "Lương cơ bản không được vượt quá 1.000.000.000"),
});
// const updateLuongCoBanSchema
const updateBaseSalarySchema = z.object({
    LuongCB:z.coerce
        .number(
         "Lương cơ bản phải là số"
        )
        .min(1000000, "Lương cơ bản phải lớn hơn 1.000.000")
        .max(1000000000, "Lương cơ bản không được vượt quá 1.000.000.000"),
});
export const createBaseSalary = async (req, res) => {
    try {
        // validate input
        const parsed = createBaseSalarySchema.safeParse({
            MaLCB: req.body.MaLCB,
            LuongCB: req.body.LuongCB
        });

        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            return res.status(400).json({ errors: errorMessages });
        }

        // create LCB
        const { MaLCB, LuongCB } = parsed.data;

        // check MaLCB
        const luongId = await LuongCoBan.findByPk(MaLCB);
        if (luongId) {
            return res.status(400).json({ message: "Mã lương cơ bản đã tồn tại" });
        }

        // check LuongCB trùng
        const luongExist = await LuongCoBan.findOne({ where: { LuongCB } });
        if (luongExist) {
            return res.status(400).json({ message: "Mức lương cơ bản đã tồn tại" });
        }

        const luong = await LuongCoBan.create({ MaLCB, LuongCB });

        // response
        return res.status(200).json({
            message: "Tạo lương cơ bản thành công",
            luong
        });

    } catch (error) {
        console.error("Lỗi khi gọi", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const updateBaseSalary = async (req, res) => {
    try {
        // Validate input
        const parsed = updateBaseSalarySchema.safeParse({
            LuongCB: req.body.LuongCB
        });

        if (!parsed.success) {
            const errorMessages = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
            }));
            return res.status(400).json({ errors: errorMessages });
        }

        // Find base salary by primary key
        const luong = await LuongCoBan.findByPk(req.params.MaLCB);

        if (!luong) {
            return res.status(404).json({ message: "Không tìm thấy lương cơ bản" });
        }

        // Check if the salary amount already exists
        const existLuong = await LuongCoBan.findOne({
            where: { LuongCB: parsed.data.LuongCB }
        });

        if (existLuong && existLuong.MaLCB !== req.params.MaLCB) {
            return res.status(400).json({ message: "Mức lương cơ bản đã tồn tại" });
        }

        // Update base salary
        await luong.update({
            LuongCB: parsed.data.LuongCB
        });

        // Return success response
        res.status(200).json({
            message: "Cập nhật lương cơ bản thành công",
            luong
        });

    } catch (error) {
        console.error("Error while updating base salary:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const getBaseSalaries = async (req, res) => {
    try {
        const baseSalaries = await LuongCoBan.findAll();
        return res.status(200).json(baseSalaries);
    } catch (error) {
        console.error("Lỗi không tìm thấy danh sách lương cơ bản", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
export const getBaseSalaryById = async (req, res) => {
    try {
        const { MaLCB } = req.params;

        // Check MaLCB
        if (!MaLCB) {
            return res.status(400).json({ message: "Thiếu MaLCB" });
        }

        // Get base salary by MaLCB
        const baseSalary = await LuongCoBan.findByPk(MaLCB);

        if (!baseSalary) {
            return res.status(404).json({ message: "Lương cơ bản không tồn tại" });
        }

        // Return response
        return res.status(200).json(baseSalary);

    } catch (error) {

        // Only show error for dev, Can't show detail error for client
        console.error("Lỗi không tìm thấy lương cơ bản", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}
export const deleteBaseSalary = async (req, res) => {
    try {
        const { MaLCB } = req.params;

        // Check if MaLCB is provided
        if (!MaLCB) {
            return res.status(400).json({ message: "Thiếu MaLCB để xóa lương cơ bản" });
        }

        // Find base salary by primary key
        const luong = await LuongCoBan.findByPk(MaLCB);

        if (!luong) {
            return res.status(404).json({ message: "Lương cơ bản không tồn tại" });
        }

        // Delete base salary
        await luong.destroy();

        // Return success response
        return res.status(200).json({ message: "Xóa lương cơ bản thành công" });

    } catch (error) {

        // Only show error for developers, do not expose details to client
        console.error("Error while deleting base salary:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};