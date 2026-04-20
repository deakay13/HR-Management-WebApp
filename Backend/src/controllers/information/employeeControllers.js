import { NhanVien as Employee, PhongBan as Department } from '../../models/index.js';
import { searchService } from '../../utils/search.js';
import { Pagination } from '../../utils/paginations.js';
import ExcelJS from 'exceljs';

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{ 
        model: Department,
        as: 'PhongBan',
        required: false,
        attributes: ['MaPB', 'TenPB']
      }] 
    });
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching Employees:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên: ' + error.message });
  }
};

const searchEmployees = async (req, res) => {
  try {
    const query = { ...req.query };
    if (!query.keyword) {
      query.size = 0;
    }

    const pagination = Pagination(query);

    const result = await searchService(
      Employee,
      req.query,
      pagination,
      {
        searchFields: ["MaNV", "HoVaTen", "SDT", "DiaChi", "$PhongBan.TenPB$"],
        exactFields: ["MaPB", "GioiTinh"],
        include: [{ 
          model: Department,
          as: 'PhongBan',
          required: false,
          attributes: ['MaPB', 'TenPB']
        }],
        order: [["MaNV", "ASC"]],
        subQuery: false
      }
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error searching Employees:', error);
    res.status(500).json({ message: 'Lỗi khi tìm kiếm nhân viên: ' + error.message });
  }
};

const exportEmployeesToExcel = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{ 
        model: Department,
        as: 'PhongBan',
        required: false,
        attributes: ['MaPB', 'TenPB']
      }] 
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DanhSachNhanVien");

    // Title
    worksheet.mergeCells("A1:H1");
    const titleRow = worksheet.getRow(1);
    titleRow.getCell(1).value = "DANH SÁCH NHÂN VIÊN";
    titleRow.getCell(1).font = { name: "Arial", size: 16, bold: true };
    titleRow.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
    titleRow.height = 30;

    // Header
    const headerRow = ["Mã NV", "Họ và Tên", "Phòng Ban", "Giới Tính", "Ngày Sinh", "SĐT", "Ngày Vào Làm", "Địa Chỉ"];
    worksheet.getRow(3).values = headerRow;
    worksheet.columns = [
      { key: "MaNV", width: 15 },
      { key: "HoVaTen", width: 25 },
      { key: "PhongBan", width: 25 },
      { key: "GioiTinh", width: 12 },
      { key: "NgaySinh", width: 15 },
      { key: "SDT", width: 15 },
      { key: "NgayVaoLam", width: 15 },
      { key: "DiaChi", width: 40 }
    ];

    // Style Header
    worksheet.getRow(3).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // Data Rows
    employees.forEach((emp) => {
      const row = worksheet.addRow({
        MaNV: emp.MaNV,
        HoVaTen: emp.HoVaTen,
        PhongBan: emp.PhongBan ? `${emp.PhongBan.MaPB} - ${emp.PhongBan.TenPB}` : "N/A",
        GioiTinh: emp.GioiTinh,
        NgaySinh: emp.NgaySinh,
        SDT: emp.SDT,
        NgayVaoLam: emp.NgayVaoLam,
        DiaChi: emp.DiaChi
      });

      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=danh_sach_nhan_vien.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting Employees:', error);
    res.status(500).json({ message: 'Lỗi khi xuất file excel: ' + error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [{
        model: Department,
        as: 'PhongBan',
        required: false,
        attributes: ['MaPB', 'TenPB'] 
      }]
    });
    if (!employee) return res.status(404).json({ message: 'Nhân viên không tồn tại' });
    res.status(200).json(employee);
  } catch (error) {
    console.error('Join error in getById:', error);
    res.status(500).json({ message: 'Lỗi khi lấy nhân viên: ' + error.message });
  }
};

const createEmployee = async (req, res) => {
    try {
        const { MaNV, MaPB, HoVaTen, GioiTinh, NgaySinh, DiaChi, NgayVaoLam, SDT } = req.body;
        const HinhAnh = req.file ? `/uploads/avatars/${req.file.filename}` : null;

        const department = await Department.findByPk(MaPB);
        if (!department) {
          return res.status(400).json({ message: 'Mã phòng ban không tồn tại' });
        }

        const employee = await Employee.create({ 
            MaNV, MaPB, HoVaTen, GioiTinh, NgaySinh, DiaChi, NgayVaoLam, SDT, HinhAnh 
        });
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo nhân viên: ' + error.message });
    }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.HinhAnh = `/uploads/avatars/${req.file.filename}`;
    }

    await employee.update(updateData);
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật nhân viên: ' + error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại' });
    }
    await employee.destroy();
    res.status(200).json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa nhân viên: ' + error.message });
  }
};

export { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, searchEmployees, exportEmployeesToExcel };