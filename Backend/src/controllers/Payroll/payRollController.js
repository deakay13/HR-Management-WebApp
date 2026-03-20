import BangLuong from "../../models/salary/BangLuong.js"
import LuongCoBan from "../../models/salary/LuongCoBan.js"
import PhuCap from "../../models/salary/PhuCap.js"
import KhauTru from "../../models/salary/KhauTru.js"
import GioLam from "../../models/salary/GioLam.js"
import { Pagination } from '../../utils/paginations.js';
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

        const standardHours = 8

        const salaryByHour = (baseSalary / standardHours) * hours

        const deductionAmount = salaryByHour * (deductionPercent / 100)

        const totalSalary =
            salaryByHour
            + allowance
            - deductionAmount

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