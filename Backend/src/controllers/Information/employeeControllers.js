import { NhanVien as Employee, PhongBan as Department } from '../../models/index.js';

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
    console.log('Fetched Employees:', employees.length);
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching Employees:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên: ' + error.message });
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

    const HinhAnh = req.file ? `/uploads/avatars/${req.file.filename}` : employee.HinhAnh;

    const { MaPB } = req.body;
    if (MaPB) {
      const department = await Department.findByPk(MaPB);
      if (!department) {
        return res.status(400).json({ message: 'Mã phòng ban không tồn tại' });
      }
    }

    await employee.update({ ...req.body, HinhAnh });
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

export { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };