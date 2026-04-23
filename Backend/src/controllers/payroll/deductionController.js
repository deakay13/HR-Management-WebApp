import KhauTru from "../../models/salary/KhauTru.js";
import { Pagination } from "../../utils/paginations.js";
import { deductionSchema } from "../../utils/validationSchemas.js";
import { searchService } from "../../utils/search.js";
import sequelize from "../../config/dbconnect.js";
import ExcelJS from "exceljs";
export const createDeduction = async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "Thiếu dữ liệu (Body)" });
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

    const options = {
      order: [
        [sequelize.fn("LEN", sequelize.col("MaKT")), "ASC"],
        ["MaKT", "ASC"],
      ],
    };
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await KhauTru.findAndCountAll({
      ...options,
      distinct: true,
    });

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
  if (!req.body) return res.status(400).json({ message: "Thiếu dữ liệu (Body)" });
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

export const searchDeduction = async (req, res) => {
  try {
    const query = { ...req.query };
    if (query.size === undefined) {
      query.size = 0;
    }

    const pagination = Pagination(query);

    const result = await searchService(KhauTru, req.query, pagination, {
      searchFields: ["MaKT", "LoaiKT", "PhanTram"],
      numericFields: ["PhanTram"],
      order: [
        [sequelize.fn("LEN", sequelize.col("MaKT")), "ASC"],
        ["MaKT", "ASC"],
      ],
      distinct: true,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const exportDeductionsToExcel = async (req, res) => {
  try {
    const deductions = await KhauTru.findAll({
      order: [
        [sequelize.fn("LEN", sequelize.col("MaKT")), "ASC"],
        ["MaKT", "ASC"],
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("KhauTru");

    // Title
    worksheet.mergeCells("A1:C1");
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = "DANH SÁCH CÁC KHOẢN KHẤU TRỪ";
    titleRow.getCell(1).font = { name: "Arial", size: 14, bold: true };
    titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    titleRow.height = 25;

    // Header
    const headerRow = ["Mã Khấu Trừ", "Loại Khấu Trừ", "Phần Trăm (%)"];
    worksheet.getRow(3).values = headerRow;
    worksheet.columns = [
      { key: "MaKT", width: 15 },
      { key: "LoaiKT", width: 25 },
      { key: "PhanTram", width: 20 },
    ];

    // Style Header
    worksheet.getRow(3).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Data
    deductions.forEach((d) => {
      const row = worksheet.addRow({
        MaKT: d.MaKT,
        LoaiKT: d.LoaiKT,
        PhanTram: d.PhanTram + "%",
      });
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=danh_sach_khau_tru.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Lỗi export:", error);
    res.status(500).json({ message: "Lỗi xuất file" });
  }
};
