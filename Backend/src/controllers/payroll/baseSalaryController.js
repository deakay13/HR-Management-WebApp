import LuongCoBan from "../../models/salary/LuongCoBan.js";
import { Pagination } from "../../utils/paginations.js";
import { baseSalarySchema } from "../../utils/validationSchemas.js";
import { searchService } from "../../utils/search.js";
import sequelize from "../../config/dbconnect.js";
import ExcelJS from "exceljs";
export const createBaseSalary = async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "Thiếu dữ liệu" });
  try {
    const parsed = baseSalarySchema.safeParse({
      MaLCB: req.body.MaLCB,
      LuongCB: req.body.LuongCB,
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
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
    return res.status(201).json({
      message: "Tạo lương cơ bản thành công",
      luong,
    });
  } catch (error) {
    console.error("Lỗi khi gọi", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const updateBaseSalary = async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "Thiếu dữ liệu" });
  try {
    const parsed = baseSalarySchema.omit({ MaLCB: true }).safeParse({
      LuongCB: req.body.LuongCB,
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors: errorMessages });
    }
    const { ID } = req.params;
    // Find base salary by primary key
    const luong = await LuongCoBan.findByPk(ID);

    if (!luong) {
      return res.status(404).json({ message: "Không tìm thấy lương cơ bản" });
    }

    // Check if the salary amount already exists
    const existLuong = await LuongCoBan.findOne({
      where: { LuongCB: parsed.data.LuongCB },
    });

    if (existLuong && existLuong.MaLCB !== ID) {
      return res.status(400).json({ message: "Mức lương cơ bản đã tồn tại" });
    }

    // Update base salary
    await luong.update({
      LuongCB: parsed.data.LuongCB,
    });

    // Return success response
    res.status(200).json({
      message: "Cập nhật lương cơ bản thành công",
      luong,
    });
  } catch (error) {
    console.error("Error while updating base salary:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const getBaseSalaries = async (req, res) => {
  try {
    //set page and size rows in papge
    const { offset, limit, page, finalSize } = Pagination(req.query);

    const options = {
      order: [
        [sequelize.fn("LEN", sequelize.col("MaLCB")), "ASC"],
        ["MaLCB", "ASC"],
      ],
    };
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await LuongCoBan.findAndCountAll({
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
export const getBaseSalaryById = async (req, res) => {
  try {
    const { ID } = req.params;

    // Check ID
    if (!ID) {
      return res.status(400).json({ message: "Thiếu ID" });
    }

    // Get base salary by ID
    const baseSalary = await LuongCoBan.findByPk(ID);

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
};
export const deleteBaseSalary = async (req, res) => {
  try {
    const { ID } = req.params;

    // Check if ID is provided
    if (!ID) {
      return res.status(400).json({ message: "Thiếu ID để xóa lương cơ bản" });
    }

    // Find base salary by primary key
    const luong = await LuongCoBan.findByPk(ID);

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

export const searchBaseSalary = async (req, res) => {
  try {
    const query = { ...req.query };
    if (query.size === undefined) {
      query.size = 0;
    }

    const pagination = Pagination(query);

    const result = await searchService(LuongCoBan, req.query, pagination, {
      searchFields: ["MaLCB", "LuongCB"],
      numericFields: ["LuongCB"],
      order: [
        [sequelize.fn("LEN", sequelize.col("MaLCB")), "ASC"],
        ["MaLCB", "ASC"],
      ],
      distinct: true,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const exportBaseSalariesToExcel = async (req, res) => {
  try {
    const salaries = await LuongCoBan.findAll({
      order: [
        [sequelize.fn("LEN", sequelize.col("MaLCB")), "ASC"],
        ["MaLCB", "ASC"],
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("LuongCoBan");

    // Title
    worksheet.mergeCells("A1:B1");
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = "DANH SÁCH LƯƠNG CƠ BẢN";
    titleRow.getCell(1).font = { name: "Arial", size: 14, bold: true };
    titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    titleRow.height = 25;

    // Header
    const headerRow = ["Mã Lương", "Mức Lương"];
    worksheet.getRow(3).values = headerRow;
    worksheet.columns = [
      { key: "MaLCB", width: 15 },
      { key: "LuongCB", width: 25 },
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
    salaries.forEach((s) => {
      const row = worksheet.addRow({
        MaLCB: s.MaLCB,
        LuongCB: new Intl.NumberFormat("vi-VN").format(s.LuongCB) + " VNĐ",
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
      "attachment; filename=danh_sach_luong_co_ban.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Lỗi export:", error);
    res.status(500).json({ message: "Lỗi xuất file" });
  }
};
