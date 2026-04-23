import GioLam from "../../models/salary/GioLam.js";
import { Pagination } from "../../utils/paginations.js";
import { hoursSchema } from "../../utils/validationSchemas.js";
import { searchService } from "../../utils/search.js";
import sequelize from "../../config/dbconnect.js";
import ExcelJS from "exceljs";
export const createHour = async (req, res) => {
  try {
    const parsed = hoursSchema.omit({ SoNgayLam: true }).safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));

      return res.status(400).json({ errors });
    }

    const { MaGL, SoGioLam } = parsed.data;

    const exist = await GioLam.findByPk(MaGL);

    if (exist) {
      return res.status(400).json({
        message: "Mã giờ làm đã tồn tại",
      });
    }

    const hour = await GioLam.create({
      MaGL,
      SoGioLam,
    });

    return res.status(201).json({
      message: "Tạo giờ làm thành công",
      hour,
    });
  } catch (error) {
    console.error("Lỗi khi tạo giờ làm:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
export const getHours = async (req, res) => {
  try {
    //set page and size rows in papge
    const { offset, limit, page, finalSize } = Pagination(req.query);

    const options = {
      order: [
        [sequelize.fn("LEN", sequelize.col("MaGL")), "ASC"],
        ["MaGL", "ASC"],
      ],
    };
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await GioLam.findAndCountAll({
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
export const getHourById = async (req, res) => {
  try {
    const { ID } = req.params;

    const hour = await GioLam.findByPk(ID);

    if (!hour) {
      return res.status(404).json({
        message: "Giờ làm không tồn tại",
      });
    }

    return res.status(200).json(hour);
  } catch (error) {
    console.error("Lỗi khi tìm giờ làm:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
export const updateHour = async (req, res) => {
  try {
    const { ID } = req.params;

    const parsed = hoursSchema.omit({ MaGL: true, SoNgayLam: true }).safeParse({
      SoGioLam: req.body.SoGioLam,
    });

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));

      return res.status(400).json({ errors });
    }

    const hour = await GioLam.findByPk(ID);

    if (!hour) {
      return res.status(404).json({
        message: "Giờ làm không tồn tại",
      });
    }

    await hour.update(parsed.data);

    return res.status(200).json({
      message: "Cập nhật giờ làm thành công",
      hour,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật giờ làm:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
export const deleteHour = async (req, res) => {
  try {
    const { ID } = req.params;

    const hour = await GioLam.findByPk(ID);

    if (!hour) {
      return res.status(404).json({
        message: "Giờ làm không tồn tại",
      });
    }

    await hour.destroy();

    return res.status(200).json({
      message: "Xóa giờ làm thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa giờ làm:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const searchHours = async (req, res) => {
  try {
    const query = { ...req.query };
    if (query.size === undefined) {
      query.size = 0;
    }

    const pagination = Pagination(query);

    const result = await searchService(GioLam, req.query, pagination, {
      searchFields: ["MaGL", "SoGioLam"],
      numericFields: ["SoGioLam"],
      order: [
        [sequelize.fn("LEN", sequelize.col("MaGL")), "ASC"],
        ["MaGL", "ASC"],
      ],
      distinct: true,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const exportHoursToExcel = async (req, res) => {
  try {
    const hours = await GioLam.findAll({
      order: [
        [sequelize.fn("LEN", sequelize.col("MaGL")), "ASC"],
        ["MaGL", "ASC"],
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("GioLam");

    // Title
    worksheet.mergeCells("A1:B1");
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = "DANH SÁCH GIỜ PHÂN CA";
    titleRow.getCell(1).font = { name: "Arial", size: 14, bold: true };
    titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    titleRow.height = 25;

    // Header
    const headerRow = ["Mã Giờ Làm", "Số Giờ Làm"];
    worksheet.getRow(3).values = headerRow;
    worksheet.columns = [
      { key: "MaGL", width: 15 },
      { key: "SoGioLam", width: 15 },
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
    hours.forEach((h) => {
      const row = worksheet.addRow({
        MaGL: h.MaGL,
        SoGioLam: `${h.SoGioLam}h`,
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
      "attachment; filename=danh_sach_gio_lam.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Lỗi export:", error);
    res.status(500).json({ message: "Lỗi xuất file" });
  }
};
