import PhuCap from "../../models/salary/PhuCap.js";
import { Pagination } from "../../utils/paginations.js";
import { allowanceSchema } from "../../utils/validationSchemas.js";
export const createAllowance = async (req, res) => {
  try {
    const parsed = allowanceSchema.safeParse({
      MaPC: req.body.MaPC,
      LoaiPC: req.body.LoaiPC,
      SoTien: req.body.SoTien,
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));

      return res.status(400).json({ errors: errorMessages });
    }

    const { MaPC, LoaiPC, SoTien } = parsed.data;

    const existId = await PhuCap.findByPk(MaPC);
    if (existId) {
      return res.status(400).json({ message: "Mã phụ cấp đã tồn tại" });
    }

    const existType = await PhuCap.findOne({
      where: { LoaiPC },
    });

    if (existType) {
      return res.status(400).json({ message: "Loại phụ cấp đã tồn tại" });
    }

    const phuCap = await PhuCap.create({
      MaPC,
      LoaiPC,
      SoTien,
    });

    return res.status(201).json({
      message: "Tạo phụ cấp thành công",
      phuCap,
    });
  } catch (error) {
    console.error("Lỗi khi tạo phụ cấp:", error);

    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const getAllowances = async (req, res) => {
  try {
    //set page and size rows in page
    const { offset, limit, page, finalSize } = Pagination(req.query);

    const options = {};
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await PhuCap.findAndCountAll(options);

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
};
export const getAllowanceById = async (req, res) => {
  try {
    const { ID } = req.params;

    const phuCap = await PhuCap.findByPk(ID);

    if (!phuCap) {
      return res.status(404).json({
        message: "Phụ cấp không tồn tại",
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
    const parsed = allowanceSchema.omit({ MaPC: true }).safeParse({
      LoaiPC: req.body.LoaiPC,
      SoTien: req.body.SoTien,
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));

      return res.status(400).json({ errors: errorMessages });
    }

    const { ID } = req.params;

    const phuCap = await PhuCap.findByPk(ID);

    if (!phuCap) {
      return res.status(404).json({
        message: "Phụ cấp không tồn tại",
      });
    }

    await phuCap.update({
      LoaiPC: parsed.data.LoaiPC,
      SoTien: parsed.data.SoTien,
    });

    return res.status(200).json({
      message: "Cập nhật phụ cấp thành công",
      phuCap,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật phụ cấp:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
export const deleteAllowance = async (req, res) => {
  try {
    const { ID } = req.params;

    const phuCap = await PhuCap.findByPk(ID);

    if (!phuCap) {
      return res.status(404).json({
        message: "Phụ cấp không tồn tại",
      });
    }

    await phuCap.destroy();

    return res.status(200).json({
      message: "Xóa phụ cấp thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa phụ cấp:", error);

    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
