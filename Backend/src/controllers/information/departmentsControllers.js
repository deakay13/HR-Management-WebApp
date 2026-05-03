import { PhongBan as Department } from "../../models/index.js";
import { departmentSchema } from "../../utils/validationSchemas.js";
import { Pagination } from "../../utils/paginations.js";
import { searchService } from "../../utils/search.js";
import ExcelJS from "exceljs";
import sequelize from "../../config/dbconnect.js";
import { clearPattern } from "../../utils/redisClient.js";

const getAllDepartments = async (req, res) => {
  try {
    const query = { ...req.query };
    if (query.size === undefined) {
      query.size = 0;
    }
    const { offset, limit, page, finalSize } = Pagination(query);

    const options = {
      order: [
        [sequelize.fn("LEN", sequelize.col("MaPB")), "ASC"],
        ["MaPB", "ASC"],
      ],
    };

    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await Department.findAndCountAll(options);

    res.status(200).json({
      totalItems: count,
      totalPages: limit ? Math.ceil(count / finalSize) : 1,
      currentPage: page,
      pageSize: finalSize,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching Departments:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách phòng ban: " + error.message });
  }
};
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Phòng ban không tồn tại" });
    }
    res.status(200).json(department);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy phòng ban: " + error.message });
  }
};
const createDepartment = async (req, res) => {
  try {
    const parsed = departmentSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors });
    }
    const { MaPB, TenPB } = parsed.data;
    const department = await Department.create({ MaPB, TenPB });
    
    // Clear cache
    await clearPattern("cache:/api/information/departments*");
    
    res.status(201).json(department);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi tạo phòng ban: " + error.message });
  }
};
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Phòng ban không tồn tại" });
    }
    const parsed = departmentSchema.omit({ MaPB: true }).safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors });
    }
    await department.update(parsed.data);
    
    // Clear cache
    await clearPattern("cache:/api/information/departments*");
    
    res.status(200).json(department);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi cập nhật phòng ban: " + error.message });
  }
};
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Phòng ban không tồn tại" });
    }
    await department.destroy();
    
    // Clear cache
    await clearPattern("cache:/api/information/departments*");
    
    res.status(200).json({ message: "Xóa phòng ban thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa phòng ban: " + error.message });
  }
};
export const searchDepartments = async (req, res) => {
  try {
    const query = { ...req.query };
    if (query.size === undefined) {
      query.size = 0;
    }
    const pagination = Pagination(query);
    const result = await searchService(Department, req.query, pagination, {
      searchFields: ["MaPB", "TenPB"],
      exactFields: ["MaPB"],
      order: [
        [sequelize.fn("LEN", sequelize.col("MaPB")), "ASC"],
        ["MaPB", "ASC"],
      ],
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching Departments:", error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm phòng ban" });
  }
};

export const exportDepartmentsToExcel = async (req, res) => {
  try {
    const departments = await Department.findAll({
      order: [
        [sequelize.fn("LEN", sequelize.col("MaPB")), "ASC"],
        ["MaPB", "ASC"],
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DanhSachPhongBan");

    worksheet.mergeCells("A1:C1");
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = "DANH SÁCH PHÒNG BAN";
    titleRow.getCell(1).font = { name: "Arial", size: 16, bold: true };
    titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    titleRow.height = 30;

    worksheet.getRow(3).values = [
      "Mã Phòng Ban",
      "Tên Phòng Ban",
      "Mô Tả",
    ];

    worksheet.columns = [
      { key: "MaPB", width: 20 },
      { key: "TenPB", width: 30 },
      { key: "MoTa", width: 50 },
    ];

    worksheet.getRow(3).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    departments.forEach((d) => {
      const row = worksheet.addRow({
        MaPB: d.MaPB,
        TenPB: d.TenPB,
        MoTa: d.MoTa || "N/A",
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
    res.setHeader("Content-Disposition", "attachment; filename=danh_sach_phong_ban.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting Departments:", error);
    res.status(500).json({ message: "Lỗi khi xuất file excel" });
  }
};

export {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
