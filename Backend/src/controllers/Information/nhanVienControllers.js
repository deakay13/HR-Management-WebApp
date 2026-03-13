import NhanVien from '../../models/information/NhanVien.js';
import PhongBan from '../../models/information/PhongBan.js';

const getAllNhanVien = async (req, res) => {
  try {
    const nhanviens = await NhanVien.findAll({
      include: [{ 
        model: PhongBan,
        as: 'PhongBan',
        required: false,  // Join optional if PhongBan is missing
        attributes: ['MaPB', 'TenPB']
      }] 
    });
    console.log('Fetched NhanViens:', nhanviens.length);
    res.status(200).json(nhanviens);
  } catch (error) {
    console.error('Error fetching NhanVien:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên: ' + error.message });
  }
};

const getNhanVienById = async (req, res) => {
  try {
    const nhanvien = await NhanVien.findByPk(req.params.id, {
      include: [{
        model: PhongBan,
        as: 'PhongBan',
        required: false,  // Join optional if PhongBan is missing
        attributes: ['MaPB', 'TenPB'] 
      }]
    });
    if (!nhanvien) return res.status(404).json({ message: 'Nhân viên không tồn tại' });
    res.status(200).json(nhanvien);
  } catch (error) {
    console.error('Join error in getById:', error);  // Log the error for debugging
    res.status(500).json({ message: 'Lỗi khi lấy nhân viên: ' + error.message });
  }
};

const createNhanVien = async (req, res) => {
    try {
        const { MaNV, MaPB, HoVaTen, GioiTinh, NgaySinh, DiaChi, NgayVaoLam, SDT } = req.body;
        const HinhAnh = req.file ? `/uploads/avatars/${req.file.filename}` : null;
        // Check if MaNV already exists
        const phongban = await PhongBan.findByPk(MaPB);
        if (!phongban) {
          return res.status(400).json({ message: 'Mã phòng ban không tồn tại' });
        }
        const nhanvien = await NhanVien.create({ MaNV, MaPB, HoVaTen, GioiTinh, NgaySinh, DiaChi, NgayVaoLam, SDT, HinhAnh });
        res.status(201).json(nhanvien);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo nhân viên: ' + error.message });
    }
};

const updateNhanVien = async (req, res) => {
  try {
    const nhanvien = await NhanVien.findByPk(req.params.id);
    if (!nhanvien) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại' });
    }
    const HinhAnh = req.file ? `/uploads/avatars/${req.file.filename}` : nhanvien.HinhAnh;
    const { MaPB } = req.body;
    if (MaPB) {
      const phongban = await PhongBan.findByPk(MaPB);
      if (!phongban) {
        return res.status(400).json({ message: 'Mã phòng ban không tồn tại' });
      }
    }
    await nhanvien.update({ ...req.body, HinhAnh });
    res.status(200).json(nhanvien);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật nhân viên: ' + error.message });
  }
};

const deleteNhanVien = async (req, res) => {
  try {
    const nhanvien = await NhanVien.findByPk(req.params.id);
    if (!nhanvien) {
      return res.status(404).json({ message: 'Nhân viên không tồn tại' });
    }
    await nhanvien.destroy();
    res.status(200).json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa nhân viên: ' + error.message });
  }
};

export { getAllNhanVien, getNhanVienById, createNhanVien, updateNhanVien, deleteNhanVien };