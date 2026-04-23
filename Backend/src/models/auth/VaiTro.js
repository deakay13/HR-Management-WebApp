import { DataTypes } from "sequelize";
import sequelize from "../../config/dbconnect.js";

const VaiTro = sequelize.define(
  "VaiTro",
  {
    MaVT: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    TenVaiTro: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "VaiTro",
    timestamps: false,
  },
);
export default VaiTro;
