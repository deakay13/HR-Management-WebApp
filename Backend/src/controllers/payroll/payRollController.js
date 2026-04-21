import BangLuong from "../../models/salary/BangLuong.js"
import LuongCoBan from "../../models/salary/LuongCoBan.js"
import PhuCap from "../../models/salary/PhuCap.js"
import KhauTru from "../../models/salary/KhauTru.js"
import GioLam from "../../models/salary/GioLam.js"
import NhanVien from "../../models/information/NhanVien.js"
import { Pagination } from '../../utils/paginations.js';
import { searchService } from "../../utils/search.js";
import ExcelJS from "exceljs"
import { Op } from "sequelize";


export const calculatePayroll = async (req, res) => {

  try {

    const { MaBL, MaNV, MaLCB, MaPC, MaKT, MaGL, Thang, SoNgayLam } = req.body
    if (!MaBL || !MaNV || !MaLCB || !MaPC || !MaKT || !MaGL || !Thang) {
      return res.status(400).json({
        message: "Thiếu dữ liệu tính lương"
      })
    }

    const existPayroll = await BangLuong.findByPk(MaBL)

    if (existPayroll) {
      return res.status(400).json({
        message: "Bảng lương đã tồn tại"
      })
    }

    const luongCoBan = await LuongCoBan.findByPk(MaLCB)
    const phuCap = await PhuCap.findByPk(MaPC)
    const khauTru = await KhauTru.findByPk(MaKT)
    const gioLam = await GioLam.findByPk(MaGL)

    if (!luongCoBan || !phuCap || !khauTru || !gioLam) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu lương"
      })
    }

    // TÍNH LƯƠNG
    const baseSalary = Number(luongCoBan.LuongCB || 0)
    const allowance = Number(phuCap.SoTien || 0)
    const deductionPercent = Number(khauTru.PhanTram || 0)
    
    // Tính tổng giờ trong tháng = giờ ca * số ngày đi làm
    const shiftHours = Number(gioLam.SoGioLam || 0)
    const daysWorked = Number(SoNgayLam || gioLam.SoNgayLam || 26)
    const totalWorkingHours = shiftHours * daysWorked

    const STANDARD_HOURS = 208 // 26 ngày * 8 giờ

    const salaryByHours = (baseSalary / STANDARD_HOURS) * totalWorkingHours
    const grossSalary = salaryByHours + allowance
    const deductionAmount = grossSalary * (deductionPercent / 100)
    const totalSalary = Math.round(grossSalary - deductionAmount)

    const payroll = await BangLuong.create({
      MaBL,
      MaNV,
      MaLCB,
      MaPC,
      MaKT,
      MaGL,
      Thang,
      SoNgayLam: daysWorked,
      TongLuong: totalSalary
    })

    return res.status(201).json({
      message: "Tính lương thành công",
      payroll
    })
  } catch (error) {
    console.error("Lỗi khi tính lương:", error)
    return res.status(500).json({
      message: "Lỗi hệ thống"
    })
  }
};
export const updatePayroll = async (req, res) => {
  try {
    const { ID } = req.params
    const { MaLCB, MaPC, MaKT, MaGL, Thang, SoNgayLam } = req.body

    const payroll = await BangLuong.findByPk(ID)

    if (!payroll) {
      return res.status(404).json({ message: "Bảng lương không tồn tại" })
    }

    // Dùng dữ liệu cũ nếu không truyền mới
    const newMaLCB = MaLCB || payroll.MaLCB
    const newMaPC = MaPC || payroll.MaPC
    const newMaKT = MaKT || payroll.MaKT
    const newMaGL = MaGL || payroll.MaGL
    const newThang = Thang || payroll.Thang
    
    // Lấy data liên quan
    const [luongCoBan, phuCap, khauTru, gioLam] = await Promise.all([
      LuongCoBan.findByPk(newMaLCB),
      PhuCap.findByPk(newMaPC),
      KhauTru.findByPk(newMaKT),
      GioLam.findByPk(newMaGL)
    ])

    if (!luongCoBan || !phuCap || !khauTru || !gioLam) {
      return res.status(404).json({ message: "Thiếu dữ liệu tính lương" })
    }

    const newSoNgayLam = SoNgayLam || payroll.SoNgayLam || gioLam.SoNgayLam || 26

    // TÍNH LẠI GIỜ CÔNG
    const baseSalary = Number(luongCoBan.LuongCB || 0)
    const allowance = Number(phuCap.SoTien || 0)
    const deductionPercent = Number(khauTru.PhanTram || 0)

    const shiftHours = Number(gioLam.SoGioLam || 0)
    const totalWorkingHours = shiftHours * Number(newSoNgayLam)

    const STANDARD_HOURS = 208

    const salaryByHours = (baseSalary / STANDARD_HOURS) * totalWorkingHours
    const grossSalary = salaryByHours + allowance
    const deductionAmount = grossSalary * (deductionPercent / 100)
    const totalSalary = Math.round(grossSalary - deductionAmount)

    // ===== UPDATE =====
    await payroll.update({
      MaLCB: newMaLCB,
      MaPC: newMaPC,
      MaKT: newMaKT,
      MaGL: newMaGL,
      Thang: newThang,
      SoNgayLam: newSoNgayLam,
      TongLuong: totalSalary
    })

    return res.status(200).json({
      message: "Cập nhật bảng lương thành công",
      payroll
    })

  } catch (error) {
    console.error("Lỗi update:", error)
    return res.status(500).json({ message: "Lỗi hệ thống" })
  }
};
export const getPayrolls = async (req, res) => {
  try {
    const { offset, limit, page, finalSize } = Pagination(req.query);

    // Role-based filter: Employee only sees their own payroll
    const isEmployee = req.account?.VaiTro?.TenVaiTro === "Nhân Viên";
    const whereClause = isEmployee ? { MaNV: req.account.MaNV } : {};

    const options = { where: whereClause };
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await BangLuong.findAndCountAll({
      ...options,
      include: [
        { model: NhanVien, as: 'NhanVien', attributes: ['HoVaTen'] },
        { model: KhauTru, as: 'KhauTru', attributes: ['LoaiKT'] },
        { model: PhuCap, as: 'PhuCapThuong', attributes: ['LoaiPC', 'SoTien'] },
        { model: LuongCoBan, as: 'LuongCoBan', attributes: ['LuongCB'] },
        { model: GioLam, as: 'TongGioLam', attributes: ['SoGioLam'] }
      ]
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
export const getPayrollById = async (req, res) => {
  try {

    const { ID } = req.params

    const payroll = await BangLuong.findByPk(ID)

    if (!payroll) {
      return res.status(404).json({
        message: "Bảng lương không tồn tại"
      })
    }

    return res.status(200).json(payroll)

  } catch (error) {

    console.error("Lỗi khi tìm bảng lương:", error)

    return res.status(500).json({
      message: "Lỗi hệ thống"
    })
  }
};
export const deletePayroll = async (req, res) => {
  try {

    const { ID } = req.params

    const payroll = await BangLuong.findByPk(ID)

    if (!payroll) {
      return res.status(404).json({
        message: "Bảng lương không tồn tại"
      })
    }

    await payroll.destroy()

    return res.status(200).json({
      message: "Xóa bảng lương thành công"
    })

  } catch (error) {

    console.error("Lỗi khi xóa bảng lương:", error)

    return res.status(500).json({
      message: "Lỗi hệ thống"
    })
  }
};
export const getPayrollByMonth = async (req, res) => {
  try {

    const { month } = req.params;

    const payrolls = await BangLuong.findAll({
      where: {
        Thang: {
          [Op.like]: `${month}%`
        }
      }
    });

    return res.status(200).json(payrolls);

  } catch (error) {

    console.error("Lỗi khi lọc lương theo tháng:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống"
    });

  }
};
export const getPayrollByEmployee = async (req, res) => {

  try {

    const { ID } = req.params;

    // Security guard: Employee can only view their own payroll
    const isEmployee = req.account?.VaiTro?.TenVaiTro === "Nhân Viên";
    if (isEmployee && ID !== req.account.MaNV) {
      return res.status(403).json({ message: "Không có quyền xem lương của nhân viên khác" });
    }

    const payrolls = await BangLuong.findAll({
      where: { MaNV: ID },
      include: [
        { model: NhanVien, as: 'NhanVien', attributes: ['HoVaTen'] },
        { model: KhauTru, as: 'KhauTru', attributes: ['LoaiKT'] },
        { model: PhuCap, as: 'PhuCapThuong', attributes: ['LoaiPC', 'SoTien'] },
        { model: LuongCoBan, as: 'LuongCoBan', attributes: ['LuongCB'] },
        { model: GioLam, as: 'TongGioLam', attributes: ['SoGioLam'] }
      ]
    });

    return res.status(200).json(payrolls);

  } catch (error) {

    console.error("Lỗi khi lấy lương theo nhân viên:", error);

    return res.status(500).json({
      message: "Lỗi hệ thống"
    });

  }
};
export const searchPayroll = async (req, res) => {
  try {
    const query = { ...req.query };
    if (!query.keyword) {
      query.size = 0;
    }

    const pagination = Pagination(query);

    // Role-based filter: Employee only searches their own payroll
    const isEmployee = req.account?.VaiTro?.TenVaiTro === "Nhân Viên";
    const forcedWhere = isEmployee ? { MaNV: req.account.MaNV } : {};

    const result = await searchService(
      BangLuong,
      req.query,
      pagination,
      {
        searchFields: ["MaNV", "MaBL", "MaKT", "MaPC", "MaLCB", "TongLuong", "$NhanVien.HoVaTen$"],
        numericFields: ["TongLuong"],
        exactFields: ["TrangThai", "MaNV"],
        likeFields: ["Thang"],
        rangeFields: ["TongLuong"],
        forcedWhere,
        order: [["NgayTinhLuong", "DESC"]],
        include: [
          { model: NhanVien, as: "NhanVien", attributes: ["HoVaTen"] },
          { model: KhauTru, as: "KhauTru", attributes: ["LoaiKT"] },
          { model: PhuCap, as: "PhuCapThuong", attributes: ["LoaiPC", "SoTien"] },
          { model: LuongCoBan, as: "LuongCoBan", attributes: ["LuongCB"] },
          { model: GioLam, as: "TongGioLam", attributes: ["SoGioLam"] }
        ],
        subQuery: false
      }
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const exportPayrollToExcel = async (req, res) => {
  try {
    const payrolls = await BangLuong.findAll({
      include: [
        { model: NhanVien, as: 'NhanVien', attributes: ['HoVaTen'] },
        { model: KhauTru, as: 'KhauTru', attributes: ['LoaiKT', 'PhanTram'] },
        { model: PhuCap, as: 'PhuCapThuong', attributes: ['LoaiPC', 'SoTien'] },
        { model: LuongCoBan, as: 'LuongCoBan', attributes: ['LuongCB'] },
        { model: GioLam, as: 'TongGioLam', attributes: ['SoGioLam'] }
      ]
    })

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("BangLuong")

    // ===== TITLE ROW =====
    worksheet.mergeCells("A1:K1")
    const titleRow = worksheet.getRow(1)
    titleRow.getCell(1).value = "DANH SÁCH BẢNG LƯƠNG"
    titleRow.getCell(1).font = { name: "Arial", size: 16, bold: true }
    titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" }
    titleRow.height = 30

    // ===== HEADER ROW (Row 3) =====
    const headerRow = ["Mã BL", "Mã NV", "Họ và Tên", "Tháng", "Lương cơ bản", "Giờ theo ca", "Số ngày công", "Tổng giờ tháng", "Phụ cấp", "Khấu trừ (%)", "Tổng lương"]
    worksheet.getRow(3).values = headerRow
    worksheet.columns = [
      { key: "MaBL", width: 15 },
      { key: "MaNV", width: 15 },
      { key: "HoVaTen", width: 25 },
      { key: "Thang", width: 15 },
      { key: "LuongCB", width: 18 },
      { key: "ShiftHours", width: 15 },
      { key: "SoNgayLam", width: 15 },
      { key: "TotalHours", width: 15 },
      { key: "PhuCap", width: 25 },
      { key: "KhauTru", width: 25 },
      { key: "TongLuong", width: 20 }
    ]

    // Style Header
    worksheet.getRow(3).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } }
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } }
      cell.alignment = { vertical: "middle", horizontal: "center" }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      }
    })

    // ===== DATA ROWS =====
    for (const p of payrolls) {
      const shiftHours = Number(p.TongGioLam?.SoGioLam || 0)
      const days = Number(p.SoNgayLam || 26)
      
      const row = worksheet.addRow({
        MaBL: p.MaBL,
        MaNV: p.MaNV,
        HoVaTen: p.NhanVien?.HoVaTen || "N/A",
        Thang: p.Thang,
        LuongCB: p.LuongCoBan?.LuongCB || 0,
        ShiftHours: `${shiftHours}h/ngày`,
        SoNgayLam: `${days} ngày`,
        TotalHours: `${shiftHours * days}h`,
        PhuCap: p.PhuCapThuong ? `${p.PhuCapThuong.LoaiPC} (${Number(p.PhuCapThuong.SoTien).toLocaleString("vi-VN")} VND)` : "0",
        KhauTru: p.KhauTru ? `${p.KhauTru.LoaiKT} (${p.KhauTru.PhanTram}%)` : "0",
        TongLuong: Number(p.TongLuong)
      })

      // Style Data Row
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        }
      })
    }

    // Format Number Columns
    worksheet.getColumn("LuongCB").numFmt = "#,##0"
    worksheet.getColumn("TongLuong").numFmt = "#,##0 \"VND\""

    // ===== GRAND TOTAL ROW =====
    const total = payrolls.reduce((sum, p) => sum + Number(p.TongLuong), 0)
    const lastRowIndex = worksheet.lastRow.number + 1
    
    worksheet.mergeCells(`A${lastRowIndex}:J${lastRowIndex}`)
    const totalRow = worksheet.getRow(lastRowIndex)
    
    totalRow.getCell(1).value = "TỔNG CỘNG"
    totalRow.getCell(11).value = total
    
    totalRow.eachCell((cell) => {
      cell.font = { bold: true }
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9D9D9" } }
      cell.alignment = { vertical: "middle", horizontal: "center" }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      }
    })
    totalRow.getCell(11).numFmt = "#,##0 \"VND\""

    // ===== DOWNLOAD =====
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bang_luong.xlsx"
    )

    await workbook.xlsx.write(res)
    res.end()

  } catch (error) {
    console.error("Lỗi export:", error)
    res.status(500).json({ message: "Lỗi xuất file" })
  }
}