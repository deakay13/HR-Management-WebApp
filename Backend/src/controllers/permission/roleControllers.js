import VaiTro from "../../models/auth/VaiTro.js";
import VaiTro_Quyen from "../../models/auth/VaiTro_Quyen.js";
import { Pagination } from "../../utils/paginations.js";
import { roleSchema } from "../../utils/validationSchemas.js";
import { clearPattern } from "../../utils/redisClient.js";

export const createRole = async (req, res) => {
  try {
    //validate input
    const parsed = roleSchema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    //create Role
    const { MaVT, TenVaiTro } = parsed.data;

    //check VaiTro by MaVT
    const roleId = await VaiTro.findByPk(MaVT);
    if (roleId) {
      return res.status(400).json({ message: "Vai trò đã tồn tại" });
    }

    //check TenVaiTro
    const RoleName = await VaiTro.findOne({ where: { TenVaiTro } });
    if (RoleName) {
      return res.status(400).json({ message: "Tên vai trò đã tồn tại" });
    }

    const role = await VaiTro.create({ MaVT, TenVaiTro });
    await clearPattern("cache:/api/permissions/roles*");

    //respon status 200
    return res.status(201).json({ message: "Tạo Vai trò thành công", role });
  } catch (error) {
    console.error("Lỗi khi gọi", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const getRoles = async (req, res) => {
  try {
    const { offset, limit, page, finalSize } = Pagination(req.query);

    const options = {};
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await VaiTro.findAndCountAll(options);

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
export const getRolesById = async (req, res) => {
  try {
    const { ID } = req.params;

    //check TaiKhoan
    if (!ID) {
      return res.status(400).json({ message: "Thiếu MaVT" });
    }

    //get TaiKhoan by MaTK
    const roles = await VaiTro.findByPk(ID);
    if (!roles) {
      return res.status(404).json({ message: "Vai trò không tồn tại" });
    }

    //respon status 200
    return res.status(200).json(roles);
  } catch (error) {
    //Only show error for dev, Can't show detail error for client
    console.error("Lỗi không tìm thấy Vai Trò", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const updateRole = async (req, res) => {
  try {
    const parsed = roleSchema.omit({ MaVT: true }).safeParse({
      TenVaiTro: req.body.TenVaiTro,
    });
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    const role = await VaiTro.findByPk(req.params.ID);
    if (!role)
      return res.status(404).json({ message: "không tìm thấy vai trò" });

    await role.update({ TenVaiTro: parsed.data.TenVaiTro });
    await clearPattern("cache:/api/permissions/roles*");
    res.status(200).json({ message: "Cập nhật thành công", role });
  } catch (error) {
    console.error("Lỗi khi gọi", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const deleteRole = async (req, res) => {
  try {
    const { ID } = req.params;
    if (!ID) {
      return res.status(400).json({ message: "Thiếu MaVT để xóa vai trò" });
    }

    const role = await VaiTro.findByPk(ID);
    if (!role) {
      return res.status(404).json({ message: "Vai Trò không tồn tại" });
    }

    // Xoá tất cả quyền liên quan trước khi xoá vai trò
    await VaiTro_Quyen.destroy({ where: { MaVT: ID } });

    //Delete role
    await role.destroy();
    await clearPattern("cache:/api/permissions/roles*");

    //respon status 200
    return res.status(200).json({ message: "Xoá Vai Trò thành công" });
  } catch (error) {
    //Only show error for dev, Can't show detail error for client
    console.error("Lỗi khi xóa Vai Trò", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
