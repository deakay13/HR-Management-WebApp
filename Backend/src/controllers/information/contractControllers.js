import {
  HopDong as Contract,
  NhanVien as Employees,
} from "../../models/index.js";
import { contractSchema, contractUpdateSchema } from "../../utils/validationSchemas.js";
import { Pagination } from "../../utils/paginations.js";
import { searchService } from "../../utils/search.js";
import ExcelJS from "exceljs";
import sequelize from "../../config/dbconnect.js";
import { clearPattern } from "../../utils/redisClient.js";

const getAllContracts = async (req, res) => {
  try {
    const query = { ...req.query };
    if (query.size === undefined) {
      query.size = 0;
    }
    const { offset, limit, page, finalSize } = Pagination(query);

    const isAdminOrHR =
      req.account?.VaiTro?.TenVaiTro === "Quản Trị Viên" ||
      req.account?.VaiTro?.TenVaiTro === "Nhân Sự";

    // Nếu không phải Admin hoặc HR, chỉ lấy hợp đồng của chính nhân viên đó
    const whereCondition =
      !isAdminOrHR && req.account?.MaNV ? { MaNV: req.account.MaNV } : {};

    const options = {
      where: whereCondition,
      include: [
        {
          model: Employees,
          as: "NhanVien",
          required: false,
        },
      ],
      order: [
        [sequelize.fn("LEN", sequelize.col("MaHopDong")), "ASC"],
        ["MaHopDong", "ASC"],
      ],
    };

    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await Contract.findAndCountAll(options);

    res.status(200).json({
      totalItems: count,
      totalPages: limit ? Math.ceil(count / finalSize) : 1,
      currentPage: page,
      pageSize: finalSize,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching Contracts:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách hợp đồng: " + error.message });
  }
};
const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [
        {
          model: Employees,
          as: "NhanVien",
          required: false,
        },
      ],
    });
    if (!contract)
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    res.status(200).json(contract);
  } catch (error) {
    console.error("Error fetching Contract:", error);
    res.status(500).json({ message: "Lỗi khi lấy hợp đồng: " + error.message });
  }
};
const createContract = async (req, res) => {
  try {
    const parsed = contractSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors });
    }

    const {
      MaHopDong, MaNV, LoaiHD, NgayBatDau, NgayKetThuc,
      NgayKy, ChucDanh, MaPB, MaLCB, MaPC, HinhThucTraLuong, TinhTrang
    } = parsed.data;
    const HinhAnhHopDong = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null;

    const Employee = await Employees.findByPk(MaNV);
    if (!Employee)
      return res.status(400).json({ message: "Mã nhân viên không tồn tại" });

    const contract = await Contract.create({
      MaHopDong, MaNV, LoaiHD, NgayBatDau, NgayKetThuc,
      NgayKy, ChucDanh, MaPB, MaLCB, MaPC, HinhThucTraLuong, TinhTrang, HinhAnhHopDong,
    });
    // Clear cache sau khi tạo mới
    await clearPattern("cache:/api/information/contracts*");
    res.status(201).json(contract);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo hợp đồng: " + error.message });
  }
};
const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract)
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });

    const HinhAnhHopDong = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : contract.HinhAnhHopDong;

    const parsed = contractUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors });
    }
    const { MaNV } = parsed.data;
    if (MaNV) {
      const Employee = await Employees.findByPk(MaNV);
      if (!Employee)
        return res.status(400).json({ message: "Mã nhân viên không tồn tại" });
    }
    await contract.update({ ...req.body, HinhAnhHopDong });
    // Clear cache sau khi cập nhật
    await clearPattern("cache:/api/information/contracts*");
    res.status(200).json(contract);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi cập nhật hợp đồng: " + error.message });
  }
};
const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract)
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    await contract.destroy();
    // Clear cache sau khi xóa
    await clearPattern("cache:/api/information/contracts*");
    res.status(200).json({ message: "Xóa hợp đồng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa hợp đồng: " + error.message });
  }
};
export const searchContracts = async (req, res) => {
  try {
    const query = { ...req.query };
    if (query.size === undefined) {
      query.size = 0;
    }
    const pagination = Pagination(query);

    const isAdminOrHR =
      req.account?.VaiTro?.TenVaiTro === "Quản Trị Viên" ||
      req.account?.VaiTro?.TenVaiTro === "Nhân Sự";
    const forcedWhere = !isAdminOrHR && req.account?.MaNV ? { MaNV: req.account.MaNV } : {};

    const result = await searchService(Contract, req.query, pagination, {
      searchFields: ["MaHopDong", "MaNV", "LoaiHD", "ChucDanh", "$NhanVien.HoVaTen$"],
      exactFields: ["MaNV", "MaPB", "TinhTrang"],
      forcedWhere,
      order: [
        [sequelize.fn("LEN", sequelize.col("MaHopDong")), "ASC"],
        ["MaHopDong", "ASC"],
      ],
      include: [
        {
          model: Employees,
          as: "NhanVien",
          required: false,
        },
      ],
      subQuery: false,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching Contracts:", error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm hợp đồng" });
  }
};

export const exportContractsToExcel = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        {
          model: Employees,
          as: "NhanVien",
        },
      ],
      order: [
        [sequelize.fn("LEN", sequelize.col("MaHopDong")), "ASC"],
        ["MaHopDong", "ASC"],
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DanhSachHopDong");

    worksheet.mergeCells("A1:H1");
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = "DANH SÁCH HỢP ĐỒNG NHÂN VIÊN";
    titleRow.getCell(1).font = { name: "Arial", size: 16, bold: true };
    titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    titleRow.height = 30;

    worksheet.getRow(3).values = [
      "Mã HĐ",
      "Mã NV",
      "Họ Tên",
      "Loại HĐ",
      "Ngày Bắt Đầu",
      "Ngày Kết Thúc",
      "Chức Danh",
      "Tình Trạng",
    ];

    worksheet.columns = [
      { key: "MaHopDong", width: 15 },
      { key: "MaNV", width: 15 },
      { key: "HoVaTen", width: 25 },
      { key: "LoaiHD", width: 20 },
      { key: "NgayBatDau", width: 15 },
      { key: "NgayKetThuc", width: 15 },
      { key: "ChucDanh", width: 20 },
      { key: "TinhTrang", width: 15 },
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

    contracts.forEach((c) => {
      const row = worksheet.addRow({
        MaHopDong: c.MaHopDong,
        MaNV: c.MaNV,
        HoVaTen: c.NhanVien?.HoVaTen || "N/A",
        LoaiHD: c.LoaiHD,
        NgayBatDau: c.NgayBatDau,
        NgayKetThuc: c.NgayKetThuc || "N/A",
        ChucDanh: c.ChucDanh,
        TinhTrang: c.TinhTrang,
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
    res.setHeader("Content-Disposition", "attachment; filename=danh_sach_hop_dong.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting Contracts:", error);
    res.status(500).json({ message: "Lỗi khi xuất file excel" });
  }
};

export {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
};
