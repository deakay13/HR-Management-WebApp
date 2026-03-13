import GioLam from "../../models/salary/GioLam.js"
import { z } from "zod"

const createHourSchema = z.object({
    MaGL: z
        .string()
        .min(1, "Mã giờ làm không được để trống")
        .regex(/^GL\d{3}$/, "Mã giờ làm phải có dạng GLxxx"),

    SoGioLam: z.coerce
        .number(
             "Số giờ làm phải là số"
        )
        .min(1, "Số giờ làm phải lớn hơn 0")
        .max(24, "Số giờ làm không hợp lệ")
})

const updateHourSchema = z.object({
    SoGioLam: z.coerce
        .number(
            "Số giờ làm phải là số"
        )
        .min(1, "Số giờ làm phải lớn hơn 0")
        .max(24, "Số giờ làm không hợp lệ")
});
export const createHour = async (req, res) => {
    try {

        const parsed = createHourSchema.safeParse({
            MaGL: req.body.MaGL,
            SoGioLam: req.body.SoGioLam
        })

        if (!parsed.success) {

            const errors = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }))

            return res.status(400).json({ errors })
        }

        const { MaGL, SoGioLam } = parsed.data

        const exist = await GioLam.findByPk(MaGL)

        if (exist) {
            return res.status(400).json({
                message: "Mã giờ làm đã tồn tại"
            })
        }

        const hour = await GioLam.create({
            MaGL,
            SoGioLam
        })

        return res.status(201).json({
            message: "Tạo giờ làm thành công",
            hour
        })

    } catch (error) {

        console.error("Lỗi khi tạo giờ làm:", error)

        return res.status(500).json({
            message: "Lỗi hệ thống"
        })
    }
};
export const getHours = async (req, res) => {
    try {

        const hours = await GioLam.findAll()

        return res.status(200).json(hours)

    } catch (error) {

        console.error("Lỗi khi lấy danh sách giờ làm:", error)

        return res.status(500).json({
            message: "Lỗi hệ thống"
        })
    }
};
export const getHourById = async (req, res) => {
    try {

        const { ID } = req.params

        const hour = await GioLam.findByPk(ID)

        if (!hour) {
            return res.status(404).json({
                message: "Giờ làm không tồn tại"
            })
        }

        return res.status(200).json(hour)

    } catch (error) {

        console.error("Lỗi khi tìm giờ làm:", error)

        return res.status(500).json({
            message: "Lỗi hệ thống"
        })
    }
};
export const updateHour = async (req, res) => {
    try {

        const { ID } = req.params

        const parsed = updateHourSchema.safeParse({
            SoGioLam: req.body.SoGioLam
        })

        if (!parsed.success) {

            const errors = parsed.error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }))

            return res.status(400).json({ errors })
        }

        const hour = await GioLam.findByPk(ID)

        if (!hour) {
            return res.status(404).json({
                message: "Giờ làm không tồn tại"
            })
        }

        await hour.update(parsed.data)

        return res.status(200).json({
            message: "Cập nhật giờ làm thành công",
            hour
        })

    } catch (error) {

        console.error("Lỗi khi cập nhật giờ làm:", error)

        return res.status(500).json({
            message: "Lỗi hệ thống"
        })
    }
};

export const deleteHour = async (req, res) => {
    try {

        const { ID } = req.params

        const hour = await GioLam.findByPk(ID)

        if (!hour) {
            return res.status(404).json({
                message: "Giờ làm không tồn tại"
            })
        }

        await hour.destroy()

        return res.status(200).json({
            message: "Xóa giờ làm thành công"
        })

    } catch (error) {

        console.error("Lỗi khi xóa giờ làm:", error)

        return res.status(500).json({
            message: "Lỗi hệ thống"
        })
    }
};