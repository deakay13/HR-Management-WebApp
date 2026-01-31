import express from 'express';
import dotenv from 'dotenv';
import {
    sequelize,
    NhanVien,
    PhongBan,
    HopDong,
    TaiKhoan,
    VaiTro,
    Quyen,
    VaiTro_Quyen,
    PhuCap,
    LuongCoBan,
    KhauTru,
    GioLam,
    BangLuong
} from './models/index.js';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Sync DB
sequelize.sync({ force: true })
    .then(() => {
        console.log('✅ Database synced')
        app.listen(PORT, () => {console.log(`🚀 Server chạy ở cổng ${PORT}`);});
    })
    .catch(err => console.error('❌ Error syncing database:', err));

