import { Op } from "sequelize";
import ExcelJS from "exceljs";
import bcrypt from "bcrypt";
import TaiKhoan from "../../models/auth/TaiKhoan.js";
import NhanVien from "../../models/information/NhanVien.js";
import { Pagination } from "../../utils/paginations.js";
import { formatVNDateTime } from "../../utils/dateFormat.js";
import VaiTro from "../../models/auth/VaiTro.js";
import Session from "../../models/auth/Session.js";
import { accountSchema, accountUpdateSchema } from "../../utils/validationSchemas.js";

export const createAccount = async (req, res) => {
  try {
    //get input TenTaiKhoan và MatKhau
    const parsed = accountSchema.safeParse({
      MaTK: req.body.MaTK,
      MaNV: req.body.MaNV,
      MaVT: req.body.MaVT,
      TenTaiKhoan: req.body.TenTaiKhoan,
      MatKhau: req.body.MatKhau,
    });

    //check Validate TenTaiKhoan và MatKhau
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    const { MaTK, MaNV, MaVT, TenTaiKhoan, MatKhau } = parsed.data;

    //Check if MaTaiKhoan is already taken.
    const dupTenTaiKhoan = await TaiKhoan.findByPk(MaTK);
    if (dupTenTaiKhoan) {
      return res.status(400).json({ message: "Tài Khoản đã tồn tại" });
    }

    //check if NhanVien is already taken.
    const dupNhanVien = await NhanVien.findByPk(MaNV);
    if (!dupNhanVien) {
      return res.status(400).json({ message: "Nhân viên không tồn tại" });
    }

    //Check employee already has an account.
    const existingAccount = await TaiKhoan.findOne({ where: { MaNV } });
    if (existingAccount) {
      return res.status(400).json({ message: "Nhân viên này đã có tài khoản" });
    }

    //check VaiTro exists
    const dupVaiTro = await VaiTro.findByPk(MaVT);
    if (!dupVaiTro) {
      return res.status(404).json({ message: "Không có Vai Trò" });
    }

    //HasdedPassword
    const HashedPassword = await bcrypt.hash(MatKhau, 10);

    //create new Account
    await TaiKhoan.create({
      MaTK,
      MaNV,
      MaVT,
      TenTaiKhoan,
      MatKhau: HashedPassword,
    });

    return res.status(201).json({ message: "Tạo Tài Khoản thành công" });
  } catch (error) {
    //Only show error for dev, Can't show detail error for client
    console.error("Lỗi khi tạo tài khoản", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const readAllAccount = async (req, res) => {
  try {
    const { offset, limit, page, finalSize } = Pagination(req.query);
    const { search } = req.query;

    const options = {};
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    if (search) {
      options.where = {
        [Op.or]: [
          { MaTK: { [Op.like]: `%${search}%` } },
          { MaNV: { [Op.like]: `%${search}%` } },
          { MaVT: { [Op.like]: `%${search}%` } },
          { TenTaiKhoan: { [Op.like]: `%${search}%` } },
          { "$NhanVien.HoVaTen$": { [Op.like]: `%${search}%` } },
          { "$VaiTro.TenVaiTro$": { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await TaiKhoan.findAndCountAll({
      ...options,
      include: [
        { model: NhanVien, as: "NhanVien", attributes: ["HoVaTen"] },
        { model: VaiTro, as: "VaiTro", attributes: ["TenVaiTro"] },
      ],
    });

    // Tự động kiểm tra trạng thái Online/Offline qua Session
    const activeSessions = await Session.findAll();
    const activeMaTKs = new Set(activeSessions.map((s) => s.MaTK));

    const formattedRows = rows.map((acc) => ({
      MaTK: acc.MaTK,
      MaNV: acc.MaNV,
      HoVaTen: acc.NhanVien?.HoVaTen || "N/A",
      MaVT: acc.MaVT,
      TenVaiTro: acc.VaiTro?.TenVaiTro || "N/A",
      TenTaiKhoan: acc.TenTaiKhoan,
      MatKhau: acc.MatKhau,
      TrangThai: activeMaTKs.has(acc.MaTK) ? "Online" : "Offline",
      createdAt: formatVNDateTime(acc.createdAt),
      updatedAt: formatVNDateTime(acc.updatedAt),
    }));

    return res.status(200).json({
      totalItems: count,
      totalPages: limit ? Math.ceil(count / finalSize) : 1,
      currentPage: page,
      pageSize: finalSize,
      data: formattedRows,
    });
  } catch (error) {
    //Only show error for dev, Can't show detail error for client
    console.error("Lỗi không tìm thấy danh sách tài khoản", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const searchAccount = async (req, res) => {
  try {
    const { keyword, page = 1, size = 10 } = req.query;
    const pageNum = parseInt(page);
    const sizeNum = parseInt(size);
    const offset = (pageNum - 1) * sizeNum;

    const whereClause = keyword
      ? {
          [Op.or]: [
            { MaTK: { [Op.like]: `%${keyword}%` } },
            { MaNV: { [Op.like]: `%${keyword}%` } },
            { TenTaiKhoan: { [Op.like]: `%${keyword}%` } },
            { "$NhanVien.HoVaTen$": { [Op.like]: `%${keyword}%` } },
            { "$VaiTro.TenVaiTro$": { [Op.like]: `%${keyword}%` } },
          ],
        }
      : {};

    const { count, rows } = await TaiKhoan.findAndCountAll({
      where: whereClause,
      include: [
        { model: NhanVien, as: "NhanVien", attributes: ["HoVaTen"] },
        { model: VaiTro, as: "VaiTro", attributes: ["TenVaiTro"] },
      ],
      limit: sizeNum,
      offset,
      distinct: true,
    });

    const activeSessions = await Session.findAll();
    const activeMaTKs = new Set(activeSessions.map((s) => s.MaTK));

    const data = rows.map((acc) => ({
      MaTK: acc.MaTK,
      MaNV: acc.MaNV,
      HoVaTen: acc.NhanVien?.HoVaTen || "N/A",
      MaVT: acc.MaVT,
      TenVaiTro: acc.VaiTro?.TenVaiTro || "N/A",
      TenTaiKhoan: acc.TenTaiKhoan,
      MatKhau: acc.MatKhau,
      TrangThai: activeMaTKs.has(acc.MaTK) ? "Online" : "Offline",
      createdAt: formatVNDateTime(acc.createdAt),
      updatedAt: formatVNDateTime(acc.updatedAt),
    }));

    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / sizeNum),
      currentPage: pageNum,
      pageSize: sizeNum,
      data,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm tài khoản", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readAccountById = async (req, res) => {
  try {
    const { ID } = req.params;

    //check TaiKhoan
    if (!ID) {
      return res.status(400).json({ message: "Thiếu MaTK" });
    }

    //get TaiKhoan by MaTK
    const account = await TaiKhoan.findByPk(ID);
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    //respon status 200
    return res.status(200).json(account);
  } catch (error) {
    //Only show error for dev, Can't show detail error for client
    console.error("Lỗi không tìm thấy tài khoản", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const updateAccountById = async (req, res) => {
  try {
    const { ID } = req.params;
    if (!ID) {
      return res
        .status(400)
        .json({ message: "Thiếu MaTK để cập nhật tài khoản" });
    }

    const account = await TaiKhoan.findByPk(ID);
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    const { TenTaiKhoan, MatKhau, MaVT } = req.body;

    // Validate only provided fields
    const parsed = accountUpdateSchema.safeParse({ TenTaiKhoan, MatKhau, MaVT });
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    // Check if MaVT exists
    if (MaVT) {
      const role = await VaiTro.findByPk(MaVT);
      if (!role) {
        return res.status(404).json({ message: "Vai trò không tồn tại" });
      }
    }

    // Hash password if provided
    let updatedPassword = account.MatKhau;
    if (MatKhau) {
      updatedPassword = await bcrypt.hash(MatKhau, 10);
    }

    // Update only changed fields
    await account.update({
      TenTaiKhoan: TenTaiKhoan || account.TenTaiKhoan,
      MatKhau: updatedPassword,
      MaVT: MaVT || account.MaVT,
    });

    return res.status(200).json({ message: "Cập nhật thành công", account });
  } catch (error) {
    console.error("Lỗi khi cập nhật tài khoản", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const deleteAccount = async (req, res) => {
  try {
    const { ID } = req.params;
    if (!ID) {
      return res.status(400).json({ message: "Thiếu MaTK để xóa tài khoản" });
    }

    const account = await TaiKhoan.findByPk(ID);
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    //Delete account
    await account.destroy();

    //respon status 200
    return res.status(200).json({ message: "Xoá Tài Khoản thành công" });
  } catch (error) {
    //Only show error for dev, Can't show detail error for client
    console.error("Lỗi khi xóa tài khoản", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const exportAccountToExcel = async (req, res) => {
  try {
    const accounts = await TaiKhoan.findAll({
      include: [
        { model: NhanVien, as: "NhanVien", attributes: ["HoVaTen"] },
        { model: VaiTro, as: "VaiTro", attributes: ["TenVaiTro"] },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Accounts");

    // ===== TITLE ROW =====
    worksheet.mergeCells("A1:F1");
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = "DANH SÁCH TÀI KHOẢN HỆ THỐNG";
    titleRow.getCell(1).font = { name: "Arial", size: 16, bold: true };
    titleRow.getCell(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    titleRow.height = 30;

    // ===== HEADER ROW (Row 3) =====
    const headerRow = [
      "Mã TK",
      "Họ và Tên",
      "Tên Đăng Nhập",
      "Vai Trò",
      "Ngày Tạo",
      "Ngày Cập Nhật",
    ];
    worksheet.getRow(3).values = headerRow;
    worksheet.columns = [
      { key: "MaTK", width: 15 },
      { key: "HoVaTen", width: 30 },
      { key: "TenTaiKhoan", width: 25 },
      { key: "TenVaiTro", width: 20 },
      { key: "CreatedAt", width: 25 },
      { key: "UpdatedAt", width: 25 },
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

    // ===== DATA ROWS =====
    for (const acc of accounts) {
      const row = worksheet.addRow({
        MaTK: acc.MaTK,
        HoVaTen: acc.NhanVien?.HoVaTen || "N/A",
        TenTaiKhoan: acc.TenTaiKhoan,
        TenVaiTro: acc.VaiTro?.TenVaiTro || "N/A",
        CreatedAt: formatVNDateTime(acc.createdAt),
        UpdatedAt: formatVNDateTime(acc.updatedAt),
      });

      // Style Data Row
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }

    // ===== DOWNLOAD =====
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=danh_sach_tai_khoan.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Lỗi export tài khoản:", error);
    res.status(500).json({ message: "Lỗi xuất file" });
  }
};
