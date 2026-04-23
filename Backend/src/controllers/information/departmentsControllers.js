import { PhongBan as Department } from "../../models/index.js";
import { departmentSchema } from "../../utils/validationSchemas.js";

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (error) {
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
    const { MaPB, TenPB, MoTa } = parsed.data;
    const department = await Department.create({ MaPB, TenPB, MoTa });
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
    res.status(200).json({ message: "Xóa phòng ban thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa phòng ban: " + error.message });
  }
};
export {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
