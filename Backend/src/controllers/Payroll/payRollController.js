import BangLuong from "../../models/salary/BangLuong.js"
import LuongCoBan from "../../models/salary/LuongCoBan.js"
import PhuCap from "../../models/salary/PhuCap.js"
import KhauTru from "../../models/salary/KhauTru.js"
import GioLam from "../../models/salary/GioLam.js"
import { Pagination } from '../../utils/paginations.js';
import { searchService } from "../../utils/search.js";
import ExcelJS from "exceljs"
import { Op } from "sequelize";


export const calculatePayroll = async (req, res) => {

    try {

        const { MaBL, MaNV, MaLCB, MaPC, MaKT, MaGL, Thang } = req.body

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

        const baseSalary = Number(luongCoBan.LuongCB)
        const allowance = Number(phuCap.SoTien)
        const deductionPercent = Number(khauTru.PhanTram)
        const hours = Number(gioLam.SoGioLam)

       const STANDARD_HOURS = 208 // 26 * 8

        // Lương theo giờ làm
        const salaryByHours = (baseSalary / STANDARD_HOURS) * hours

        // Tiền bị trừ
        const deductionAmount = salaryByHours * (deductionPercent / 100)

        // Lương cuối cùng
        const totalSalary = salaryByHours + allowance - deductionAmount

       const payroll = await BangLuong.create({
                MaBL,
                MaNV,
                MaLCB,
                MaPC,
                MaKT,   
                MaGL,
                Thang,
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
    const { MaLCB, MaPC, MaKT, MaGL, Thang } = req.body

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

    // ===== TÍNH LƯƠNG =====
    const baseSalary = Number(luongCoBan.LuongCB)
    const totalHours = Number(gioLam.SoGioLam)
    const allowance = Number(phuCap.SoTien)
    const deductionPercent = Number(khauTru.PhanTram)

    const STANDARD_HOURS = 208

    const salaryByHours = (baseSalary / STANDARD_HOURS) * totalHours
    const grossSalary = salaryByHours + allowance
    const deductionAmount = grossSalary * (deductionPercent / 100)
    const totalSalary = grossSalary - deductionAmount

    // ===== UPDATE =====
    await payroll.update({
      MaLCB: newMaLCB,
      MaPC: newMaPC,
      MaKT: newMaKT,
      MaGL: newMaGL,
      Thang: newThang,
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
        //set page and size rows in papge
        const { offset, limit, page, finalSize } = Pagination(req.query);

        const options = {};
        if (limit !== null) {
        options.limit = limit;
        options.offset = offset;
        }

        const { count, rows } = await BangLuong.findAndCountAll(options);

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

    const payrolls = await BangLuong.findAll({
      where: { MaNV : ID }
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
    const pagination = Pagination(req.query);

    const result = await searchService(
      BangLuong,
      req.query,
      pagination,
      {
        // 1. Tìm kiếm nhanh theo mã
        searchFields: ["MaNV", "MaBL"], 
        
        // 2. Lọc chính xác (Dropdown)
        exactFields: ["TrangThai", "MaNV"], 
        
        // 3. Lọc theo tháng (VD: "2024-03")
        likeFields: ["Thang"], 
        
        // 4. Lọc khoảng lương (Rất quan trọng cho Payroll)
        rangeFields: ["TongLuong"], 
        
        // 5. Lọc khoảng ngày tính lương
        // Bạn có thể thêm xử lý Date Range vào buildWhereClause
        
        order: [["NgayTinhLuong", "DESC"]]
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
    const payrolls = await BangLuong.findAll()

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("BangLuong")

    // ===== HEADER =====
    worksheet.columns = [
      { header: "Mã BL", key: "MaBL", width: 15 },
      { header: "Mã NV", key: "MaNV", width: 15 },
      { header: "Tháng", key: "Thang", width: 15 },
      { header: "Lương cơ bản", key: "LuongCB", width: 18 },
      { header: "Giờ làm", key: "SoGioLam", width: 12 },
      { header: "Phụ cấp", key: "PhuCap", width: 15 },
      { header: "Khấu trừ (%)", key: "KhauTru", width: 15 },
      { header: "Tổng lương", key: "TongLuong", width: 20 }
    ]

    // ===== DATA =====
    for (const p of payrolls) {

      const luong = await LuongCoBan.findByPk(p.MaLCB)
      const gio = await GioLam.findByPk(p.MaGL)
      const pc = await PhuCap.findByPk(p.MaPC)
      const kt = await KhauTru.findByPk(p.MaKT)

      worksheet.addRow({
        MaBL: p.MaBL,
        MaNV: p.MaNV,
        Thang: p.Thang,
        LuongCB: luong?.LuongCB || 0,
        SoGioLam: gio?.SoGioLam || 0,
        PhuCap: pc?.SoTien || 0,
        KhauTru: kt?.PhanTram || 0,
        TongLuong: p.TongLuong
      })
    }

    // ===== STYLE =====
    worksheet.getRow(1).font = { bold: true }

    worksheet.columns.forEach(col => {
      col.alignment = { vertical: "middle", horizontal: "center" }
    })

    // Format tiền
    worksheet.getColumn("LuongCB").numFmt = "#,##0"
    worksheet.getColumn("PhuCap").numFmt = "#,##0"
    worksheet.getColumn("TongLuong").numFmt = "#,##0"

    // ===== TỔNG =====
    const total = payrolls.reduce((sum, p) => sum + Number(p.TongLuong), 0)

    worksheet.addRow({})
    worksheet.addRow({
      MaNV: "TỔNG",
      TongLuong: total
    })

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