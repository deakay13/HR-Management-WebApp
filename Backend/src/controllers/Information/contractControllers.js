import { HopDong as Contract, NhanVien as Employees} from '../../models/index.js';

const getAllContracts = async (req, res) => {
    try {
        const contracts = await Contract.findAll({
            include: [{ 
                model: Employees, 
                as: 'NhanVien', 
                required: false 
            }]
        });
        res.status(200).json(contracts);
    } catch (error) {
        console.error('Error fetching Contracts:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách hợp đồng: ' + error.message });
    }
};

const getContractById = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id, {
            include: [{ 
                model: Employees, 
                as: 'NhanVien', 
                required: false 
            }]
        });
        if (!contract) return res.status(404).json({ message: 'Hợp đồng không tồn tại' });
        res.status(200).json(contract);
    } catch (error) {
        console.error('Error fetching Contract:', error);
        res.status(500).json({ message: 'Lỗi khi lấy hợp đồng: ' + error.message });
    }
};

const createContract = async (req, res) => {
    try {
        const { MaHopDong, MaNV, LoaiHD, NgayBatDau, NgayKetThuc } = req.body;
        const HinhAnhHopDong = req.file ? `/uploads/hopdong/${req.file.filename}` : null;

        const Employee = await Employees.findByPk(MaNV);
        if (!Employee) return res.status(400).json({ message: 'Mã nhân viên không tồn tại' });

        const contract = await Contract.create({ 
            MaHopDong, MaNV, LoaiHD, NgayBatDau, NgayKetThuc, HinhAnhHopDong 
        });
        res.status(201).json(contract);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo hợp đồng: ' + error.message });
    }
};

const updateContract = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id);
        if (!contract) return res.status(404).json({ message: 'Hợp đồng không tồn tại' });

        const HinhAnhHopDong = req.file ? `/uploads/hopdong/${req.file.filename}` : contract.HinhAnhHopDong;

        const { MaNV } = req.body;
        if (MaNV) {
            const Employee = await Employees.findByPk(MaNV);
            if (!Employee) return res.status(400).json({ message: 'Mã nhân viên không tồn tại' });
        }

        await contract.update({ ...req.body, HinhAnhHopDong });
        res.status(200).json(contract);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật hợp đồng: ' + error.message });
    }
};

const deleteContract = async (req, res) => {
    try {
        const contract = await Contract.findByPk(req.params.id);
        if (!contract) return res.status(404).json({ message: 'Hợp đồng không tồn tại' });
        await contract.destroy();
        res.status(200).json({ message: 'Xóa hợp đồng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa hợp đồng: ' + error.message });
    }
};

export { getAllContracts, getContractById, createContract, updateContract, deleteContract };