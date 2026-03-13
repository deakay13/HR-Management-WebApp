import express from 'express';
import { getAllPhongBan, getPhongBanById, createPhongBan, updatePhongBan, deletePhongBan } from '../controllers/Information/phongBanControllers.js';
import { getAllNhanVien, getNhanVienById, createNhanVien, updateNhanVien, deleteNhanVien } from '../controllers/Information/nhanVienControllers.js';
import { getAllHopDong, getHopDongById, createHopDong, updateHopDong, deleteHopDong } from '../controllers/Information/hopDongControllers.js';
import upload from '../middlewares/multerConfig.js';

const router = express.Router();

// Routes for Phongban
router.get('/phongban', getAllPhongBan);
router.get('/phongban/:id', getPhongBanById);
router.post('/phongban', createPhongBan);
router.put('/phongban/:id', updatePhongBan);
router.delete('/phongban/:id', deletePhongBan);

// Routes for NhanVien
router.get('/nhanvien', getAllNhanVien);
router.get('/nhanvien/:id', getNhanVienById);
router.post('/nhanvien', upload.single('HinhAnh'), createNhanVien);      
router.put('/nhanvien/:id', upload.single('HinhAnh'), updateNhanVien);  
router.delete('/nhanvien/:id', deleteNhanVien);

// Routes for HopDong 
router.get('/hopdong', getAllHopDong);
router.get('/hopdong/:id', getHopDongById);
router.post('/hopdong', upload.single('HinhAnhHopDong'), createHopDong);
router.put('/hopdong/:id', upload.single('HinhAnhHopDong'), updateHopDong);
router.delete('/hopdong/:id', deleteHopDong);

export default router;