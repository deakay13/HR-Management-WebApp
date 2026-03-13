import PhongBan from '../../models/information/PhongBan.js';

const getAllPhongBan = async (req, res) => {
  try {
    const phongbans = await PhongBan.findAll();
    res.status(200).json(phongbans);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng ban: ' + error.message });
  }
};

const getPhongBanById = async (req, res) => {
  try {
    const phongban = await PhongBan.findByPk(req.params.id);
    if (!phongban) {
      return res.status(404).json({ message: 'Phòng ban không tồn tại' });
    }
    res.status(200).json(phongban);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy phòng ban: ' + error.message });
  }
};

const createPhongBan = async (req, res) => {
  try {
    const { MaPB, TenPB } = req.body;
    const phongban = await PhongBan.create({ MaPB, TenPB });
    res.status(201).json(phongban);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo phòng ban: ' + error.message });
  }
};

const updatePhongBan = async (req, res) => {
  try {
    const phongban = await PhongBan.findByPk(req.params.id);
    if (!phongban) {
      return res.status(404).json({ message: 'Phòng ban không tồn tại' });
    }
    await phongban.update(req.body);
    res.status(200).json(phongban);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật phòng ban: ' + error.message });
  }
};

const deletePhongBan = async (req, res) => {
  try {
    const phongban = await PhongBan.findByPk(req.params.id);
    if (!phongban) {
      return res.status(404).json({ message: 'Phòng ban không tồn tại' });
    }
    await phongban.destroy();
    res.status(200).json({ message: 'Xóa phòng ban thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa phòng ban: ' + error.message });
  }
};

export { getAllPhongBan, getPhongBanById, createPhongBan, updatePhongBan, deletePhongBan };