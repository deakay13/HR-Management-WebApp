import KhauTru from "../../models/salary/KhauTru.js";
import { Pagination } from "../../utils/paginations.js";
import { deductionSchema } from "../../utils/validationSchemas.js";
export const createDeduction = async (req, res) => {
  try {
    const parsed = deductionSchema.safeParse({
      MaKT: req.body.MaKT,
      LoaiKT: req.body.LoaiKT,
      PhanTram: req.body.PhanTram,
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
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
      deduction,
    });
  } catch (error) {
    console.error("Lỗi khi tạo khấu trừ:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const getDeductions = async (req, res) => {
  try {
    //set page and size rows in papge
    const { offset, limit, page, finalSize } = Pagination(req.query);

    const options = {};
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await KhauTru.findAndCountAll(options);

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
    const parsed = deductionSchema.omit({ MaKT: true }).safeParse({
      LoaiKT: req.body.LoaiKT,
      PhanTram: req.body.PhanTram,
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
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
      where: { LoaiKT: parsed.data.LoaiKT },
    });

    if (existType && existType.MaKT !== req.params.MaKT) {
      return res.status(400).json({ message: "Loại khấu trừ đã tồn tại" });
    }

    await deduction.update({
      LoaiKT: parsed.data.LoaiKT,
      PhanTram: parsed.data.PhanTram,
    });

    res.status(200).json({
      message: "Cập nhật khấu trừ thành công",
      deduction,
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
      message: "Xóa khấu trừ thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa khấu trừ:", error);

    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
