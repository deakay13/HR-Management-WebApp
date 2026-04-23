import { DataTypes } from "sequelize";
import sequelize from "../../config/dbconnect.js";

const PhuCap = sequelize.define(
  "PhuCap",
  {
    MaPC: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    LoaiPC: { type: DataTypes.STRING, allowNull: false },
    SoTien: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    tableName: "PhuCap",
    timestamps: false,
  },
);
export default PhuCap;
