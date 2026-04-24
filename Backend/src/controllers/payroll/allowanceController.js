import PhuCap from "../../models/salary/PhuCap.js";
import { Pagination } from "../../utils/paginations.js";
import { allowanceSchema } from "../../utils/validationSchemas.js";
import { searchService } from "../../utils/search.js";
import sequelize from "../../config/dbconnect.js";
import ExcelJS from "exceljs";
export const createAllowance = async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "Thiếu dữ liệu (Body)" });
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

    const options = {
      order: [
        [sequelize.fn("LEN", sequelize.col("MaPC")), "ASC"],
        ["MaPC", "ASC"],
      ],
    };
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await PhuCap.findAndCountAll({
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
  if (!req.body) return res.status(400).json({ message: "Thiếu dữ liệu (Body)" });
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

export const searchAllowance = async (req, res) => {
  try {
    const query = { ...req.query };
    if (query.size === undefined) {
      query.size = 0;
    }

    const pagination = Pagination(query);

    const result = await searchService(PhuCap, req.query, pagination, {
      searchFields: ["MaPC", "LoaiPC", "SoTien"],
      numericFields: ["SoTien"],
      order: [
        [sequelize.fn("LEN", sequelize.col("MaPC")), "ASC"],
        ["MaPC", "ASC"],
      ],
      distinct: true,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const exportAllowancesToExcel = async (req, res) => {
  try {
    const allowances = await PhuCap.findAll({
      order: [
        [sequelize.fn("LEN", sequelize.col("MaPC")), "ASC"],
        ["MaPC", "ASC"],
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PhuCap");

    // Title
    worksheet.mergeCells("A1:C1");
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = "DANH SÁCH PHỤ CẤP";
    titleRow.getCell(1).font = { name: "Arial", size: 14, bold: true };
    titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    titleRow.height = 25;

    // Header
    const headerRow = ["Mã Phụ Cấp", "Loại Phụ Cấp", "Số Tiền"];
    worksheet.getRow(3).values = headerRow;
    worksheet.columns = [
      { key: "MaPC", width: 15 },
      { key: "LoaiPC", width: 25 },
      { key: "SoTien", width: 20 },
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
    allowances.forEach((a) => {
      const row = worksheet.addRow({
        MaPC: a.MaPC,
        LoaiPC: a.LoaiPC,
        SoTien: new Intl.NumberFormat("vi-VN").format(a.SoTien) + " VNĐ",
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
      "attachment; filename=danh_sach_phu_cap.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Lỗi export:", error);
    res.status(500).json({ message: "Lỗi xuất file" });
  }
};
