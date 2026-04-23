import {
  HopDong as Contract,
  NhanVien as Employees,
} from "../../models/index.js";
import { contractSchema, contractUpdateSchema } from "../../utils/validationSchemas.js";

const getAllContracts = async (req, res) => {
  try {
    const isAdminOrHR =
      req.account?.VaiTro?.TenVaiTro === "Quản Trị Viên" ||
      req.account?.VaiTro?.TenVaiTro === "Nhân Sự";

    // Nếu không phải Admin hoặc HR, chỉ lấy hợp đồng của chính nhân viên đó
    const whereCondition =
      !isAdminOrHR && req.account?.MaNV ? { MaNV: req.account.MaNV } : {};

    const contracts = await Contract.findAll({
      where: whereCondition,
      include: [
        {
          model: Employees,
          as: "NhanVien",
          required: false,
        },
      ],
    });
    res.status(200).json(contracts);
  } catch (error) {
    console.error("Error fetching Contracts:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách hợp đồng: " + error.message });
  }
};
const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [
        {
          model: Employees,
          as: "NhanVien",
          required: false,
        },
      ],
    });
    if (!contract)
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    res.status(200).json(contract);
  } catch (error) {
    console.error("Error fetching Contract:", error);
    res.status(500).json({ message: "Lỗi khi lấy hợp đồng: " + error.message });
  }
};
const createContract = async (req, res) => {
  try {
    const parsed = contractSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors });
    }

    const { 
      MaHopDong, MaNV, LoaiHD, NgayBatDau, NgayKetThuc,
      NgayKy, ChucDanh, MaPB, MaLCB, MaPC, HinhThucTraLuong, TinhTrang 
    } = parsed.data;
    const HinhAnhHopDong = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null;

    const Employee = await Employees.findByPk(MaNV);
    if (!Employee)
      return res.status(400).json({ message: "Mã nhân viên không tồn tại" });

    const contract = await Contract.create({

      MaHopDong,
      MaNV,
      LoaiHD,
      NgayBatDau,
      NgayKetThuc,
      NgayKy,
      ChucDanh,
      MaPB,
      MaLCB,
      MaPC,
      HinhThucTraLuong,
      TinhTrang,
      HinhAnhHopDong,
    });
    res.status(201).json(contract);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo hợp đồng: " + error.message });
  }
};
const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract)
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });

    const HinhAnhHopDong = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : contract.HinhAnhHopDong;

    const parsed = contractUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      return res.status(400).json({ errors });
    }
    const { MaNV } = parsed.data;
    if (MaNV) {
      const Employee = await Employees.findByPk(MaNV);
      if (!Employee)
        return res.status(400).json({ message: "Mã nhân viên không tồn tại" });
    }
    await contract.update({ ...req.body, HinhAnhHopDong });
    res.status(200).json(contract);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Lỗi khi cập nhật hợp đồng: " + error.message });
  }
};
const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract)
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    await contract.destroy();
    res.status(200).json({ message: "Xóa hợp đồng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa hợp đồng: " + error.message });
  }
};
export {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
};
