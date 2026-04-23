import LuongCoBan from "../../models/salary/LuongCoBan.js";
import { Pagination } from "../../utils/paginations.js";
import { baseSalarySchema } from "../../utils/validationSchemas.js";
export const createBaseSalary = async (req, res) => {
  try {
    // validate input
    const parsed = baseSalarySchema.safeParse({
      MaLCB: req.body.MaLCB,
      LuongCB: req.body.LuongCB,
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    // create LCB
    const { MaLCB, LuongCB } = parsed.data;

    // check MaLCB
    const luongId = await LuongCoBan.findByPk(MaLCB);
    if (luongId) {
      return res.status(400).json({ message: "Mã lương cơ bản đã tồn tại" });
    }

    // check LuongCB trùng
    const luongExist = await LuongCoBan.findOne({ where: { LuongCB } });
    if (luongExist) {
      return res.status(400).json({ message: "Mức lương cơ bản đã tồn tại" });
    }

    const luong = await LuongCoBan.create({ MaLCB, LuongCB });

    // response
    return res.status(201).json({
      message: "Tạo lương cơ bản thành công",
      luong,
    });
  } catch (error) {
    console.error("Lỗi khi gọi", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const updateBaseSalary = async (req, res) => {
  try {
    // Validate input
    const parsed = baseSalarySchema.omit({ MaLCB: true }).safeParse({
      LuongCB: req.body.LuongCB,
    });

    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors: errorMessages });
    }
    const { ID } = req.params;
    // Find base salary by primary key
    const luong = await LuongCoBan.findByPk(ID);

    if (!luong) {
      return res.status(404).json({ message: "Không tìm thấy lương cơ bản" });
    }

    // Check if the salary amount already exists
    const existLuong = await LuongCoBan.findOne({
      where: { LuongCB: parsed.data.LuongCB },
    });

    if (existLuong && existLuong.MaLCB !== req.params.MaLCB) {
      return res.status(400).json({ message: "Mức lương cơ bản đã tồn tại" });
    }

    // Update base salary
    await luong.update({
      LuongCB: parsed.data.LuongCB,
    });

    // Return success response
    res.status(200).json({
      message: "Cập nhật lương cơ bản thành công",
      luong,
    });
  } catch (error) {
    console.error("Error while updating base salary:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const getBaseSalaries = async (req, res) => {
  try {
    //set page and size rows in papge
    const { offset, limit, page, finalSize } = Pagination(req.query);

    const options = {};
    if (limit !== null) {
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await LuongCoBan.findAndCountAll(options);

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
export const getBaseSalaryById = async (req, res) => {
  try {
    const { ID } = req.params;

    // Check ID
    if (!ID) {
      return res.status(400).json({ message: "Thiếu ID" });
    }

    // Get base salary by ID
    const baseSalary = await LuongCoBan.findByPk(ID);

    if (!baseSalary) {
      return res.status(404).json({ message: "Lương cơ bản không tồn tại" });
    }

    // Return response
    return res.status(200).json(baseSalary);
  } catch (error) {
    // Only show error for dev, Can't show detail error for client
    console.error("Lỗi không tìm thấy lương cơ bản", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const deleteBaseSalary = async (req, res) => {
  try {
    const { ID } = req.params;

    // Check if ID is provided
    if (!ID) {
      return res.status(400).json({ message: "Thiếu ID để xóa lương cơ bản" });
    }

    // Find base salary by primary key
    const luong = await LuongCoBan.findByPk(ID);

    if (!luong) {
      return res.status(404).json({ message: "Lương cơ bản không tồn tại" });
    }

    // Delete base salary
    await luong.destroy();

    // Return success response
    return res.status(200).json({ message: "Xóa lương cơ bản thành công" });
  } catch (error) {
    // Only show error for developers, do not expose details to client
    console.error("Error while deleting base salary:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
