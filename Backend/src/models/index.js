//Information import
import NhanVien from './information/NhanVien.js';
import PhongBan from './information/PhongBan.js';
import HopDong from './information/HopDong.js';

//Auth import
import TaiKhoan from './auth/TaiKhoan.js';
import VaiTro from './auth/VaiTro.js';
import Quyen from './auth/Quyen.js';
import VaiTro_Quyen from './auth/VaiTro_Quyen.js';

//Salary import
import PhuCap from './salary/PhuCap.js';
import LuongCoBan from './salary/LuongCoBan.js';
import KhauTru from './salary/KhauTru.js';
import GioLam from './salary/GioLam.js';
import BangLuong from './salary/BangLuong.js';

//đbconnect import
import sequelize from '../config/dbconnect.js';

//PhongBan – NhanVien
PhongBan.hasMany(NhanVien, { foreignKey: 'MaPB', as: 'NhanVien' });
NhanVien.belongsTo(PhongBan, { foreignKey: 'MaPB', as: 'PhongBan' });

//NhanVien – HopDong
NhanVien.hasOne(HopDong, { foreignKey: 'MaNV', as: 'HopDong'  });
HopDong.belongsTo(NhanVien, { foreignKey: 'MaNV', as: 'NhanVien' });

//NhanVien-TaiKhoan
NhanVien.hasOne(TaiKhoan, { foreignKey: 'MaNV', as: 'TaiKhoan'  });
TaiKhoan.belongsTo(NhanVien, { foreignKey: 'MaNV', as: 'NhanVien' });

//TaiKhoan-VaiTro
TaiKhoan.belongsTo(VaiTro, { foreignKey: 'MaVT', as: 'VaiTro' });
VaiTro.hasMany(TaiKhoan, { foreignKey: 'MaVT', as: 'TaiKhoan' });

//VaiTro-Quyen
VaiTro.belongsToMany(Quyen, {through: VaiTro_Quyen,foreignKey: 'MaVT', otherKey: 'MaQuyen'});
Quyen.belongsToMany(VaiTro, {through: VaiTro_Quyen,foreignKey: 'MaQuyen',otherKey: 'MaVT'});

// NhanVien – BangLuong
NhanVien.hasMany(BangLuong, { foreignKey: 'MaNV', as: 'BangLuong' });
BangLuong.belongsTo(NhanVien, { foreignKey: 'MaNV', as: 'NhanVien' });

// LuongCoBan – BangLuong
LuongCoBan.hasMany(BangLuong, { foreignKey: 'MaLCB', as: 'BangLuong' });
BangLuong.belongsTo(LuongCoBan, { foreignKey: 'MaLCB', as: 'LuongCoBan' });

// PhuCap – BangLuong
PhuCap.hasMany(BangLuong, { foreignKey: 'MaPC', as: 'BangLuong' });
BangLuong.belongsTo(PhuCap, { foreignKey: 'MaPC', as: 'PhuCapThuong' });

// KhauTru – BangLuongT
KhauTru.hasMany(BangLuong, { foreignKey: 'MaKT', as: 'BangLuong' });
BangLuong.belongsTo(KhauTru, { foreignKey: 'MaKT', as: 'KhauTru' });

//GioLam – BangLuong
GioLam.hasMany(BangLuong, { foreignKey: 'MaGL', as: 'BangLuong' });
BangLuong.belongsTo(GioLam, { foreignKey: 'MaGL', as: 'TongGioLam' });

//export all alias
export {
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
};