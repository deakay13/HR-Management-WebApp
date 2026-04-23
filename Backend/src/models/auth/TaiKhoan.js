import { DataTypes } from "sequelize";
import sequelize from "../../config/dbconnect.js";

const TaiKhoan = sequelize.define(
  "TaiKhoan",
  {
    MaTK: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    MaNV: { type: DataTypes.STRING, allowNull: false },
    MaVT: { type: DataTypes.STRING, allowNull: false },
    TenTaiKhoan: { type: DataTypes.STRING, allowNull: false },
    MatKhau: { type: DataTypes.STRING, allowNull: false },
    TrangThai: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Offline",
    },
  },
  {
    tableName: "TaiKhoan",
    timestamps: true,
  },
);
export default TaiKhoan;
