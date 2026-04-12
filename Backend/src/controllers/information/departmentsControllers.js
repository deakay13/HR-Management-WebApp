import { PhongBan as Department } from '../../models/index.js';

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng ban: ' + error.message });
  }
};
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Phòng ban không tồn tại' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy phòng ban: ' + error.message });
  }
};
const createDepartment = async (req, res) => {
  try {
    const { MaPB, TenPB } = req.body;
    const department = await Department.create({ MaPB, TenPB });
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo phòng ban: ' + error.message });
  }
};
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Phòng ban không tồn tại' });
    }
    await department.update(req.body);
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật phòng ban: ' + error.message });
  }
};
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Phòng ban không tồn tại' });
    }
    await department.destroy();
    res.status(200).json({ message: 'Xóa phòng ban thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa phòng ban: ' + error.message });
  }
};
export { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };