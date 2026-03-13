import HopDong from '../../models/information/HopDong.js';
import NhanVien from '../../models/information/NhanVien.js';

const getAllHopDong = async (req, res) => {
    try {
        const hopdongs = await HopDong.findAll({
        include: [{ model: NhanVien, as: 'NhanVien', required: false }]
        });
        res.status(200).json(hopdongs);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách hợp đồng: ' + error.message });
    }
};

const getHopDongById = async (req, res) => {
    try {
        const hopdong = await HopDong.findByPk(req.params.id, {
        include: [{ model: NhanVien, as: 'NhanVien', required: false }]
        });
        if (!hopdong) return res.status(404).json({ message: 'Hợp đồng không tồn tại' });
        res.status(200).json(hopdong);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy hợp đồng: ' + error.message });
    }
};

const createHopDong = async (req, res) => {
    try {
        const { MaHopDong, MaNV, LoaiHD, NgayBatDau, NgayKetThuc } = req.body;
        const HinhAnhHopDong = req.file ? `/uploads/hopdong/${req.file.filename}` : null;
        const nhanvien = await NhanVien.findByPk(MaNV);
        if (!nhanvien) return res.status(400).json({ message: 'Mã nhân viên không tồn tại' });
        const hopdong = await HopDong.create({ MaHopDong, MaNV, LoaiHD, NgayBatDau, NgayKetThuc, HinhAnhHopDong });
        res.status(201).json(hopdong);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo hợp đồng: ' + error.message });
    }
};

const updateHopDong = async (req, res) => {
    try {
        const hopdong = await HopDong.findByPk(req.params.id);
        if (!hopdong) return res.status(404).json({ message: 'Hợp đồng không tồn tại' });
        const HinhAnhHopDong = req.file ? `/uploads/hopdong/${req.file.filename}` : hopdong.HinhAnhHopDong;
        const { MaNV } = req.body;
        if (MaNV) {
        const nhanvien = await NhanVien.findByPk(MaNV);
        if (!nhanvien) return res.status(400).json({ message: 'Mã nhân viên không tồn tại' });
        }
        await hopdong.update({ ...req.body, HinhAnhHopDong });
        res.status(200).json(hopdong);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật hợp đồng: ' + error.message });
    }
};

const deleteHopDong = async (req, res) => {
    try {
        const hopdong = await HopDong.findByPk(req.params.id);
        if (!hopdong) return res.status(404).json({ message: 'Hợp đồng không tồn tại' });
        await hopdong.destroy();
        res.status(200).json({ message: 'Xóa hợp đồng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa hợp đồng: ' + error.message });
    }
};

export { getAllHopDong, getHopDongById, createHopDong, updateHopDong, deleteHopDong };