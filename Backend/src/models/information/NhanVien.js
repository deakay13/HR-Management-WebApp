import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconnect.js';

const NhanVien = sequelize.define('NhanVien', {
  MaNV: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  MaPB: {type: DataTypes.STRING, allowNull: false},
  HoVaTen: { type: DataTypes.STRING, allowNull: false },
  GioiTinh: { type: DataTypes.STRING, allowNull: false },
  NgaySinh: { type: DataTypes.DATEONLY, allowNull: false },
  DiaChi: { type: DataTypes.STRING, allowNull: false },
  NgayVaoLam:{ type: DataTypes.DATEONLY, allowNull: false },
  SDT: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'NhanVien',
  timestamps: false
});

export default NhanVien;