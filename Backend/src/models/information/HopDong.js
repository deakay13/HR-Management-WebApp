import { DataTypes } from "sequelize";
import sequelize from "../../config/dbconnect.js";

const HopDong = sequelize.define(
  "HopDong",
  {
    MaHopDong: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    MaNV: { type: DataTypes.STRING, allowNull: false },
    LoaiHD: { type: DataTypes.STRING, allowNull: false },
    NgayBatDau: { type: DataTypes.DATEONLY, allowNull: false },
    NgayKetThuc: { type: DataTypes.DATEONLY, allowNull: true },
    NgayKy: { type: DataTypes.DATEONLY, allowNull: true },
    ChucDanh: { type: DataTypes.STRING, allowNull: true },
    MaPB: { type: DataTypes.STRING, allowNull: true },
    MaLCB: { type: DataTypes.STRING, allowNull: true },
    MaPC: { type: DataTypes.STRING, allowNull: true },
    HinhThucTraLuong: { type: DataTypes.STRING, allowNull: true },
    TinhTrang: { type: DataTypes.STRING, allowNull: true },
    HinhAnhHopDong: { type: DataTypes.TEXT("long"), allowNull: true },
  },
  {
    tableName: "HopDong",
    timestamps: false,
  },
);
export default HopDong;
