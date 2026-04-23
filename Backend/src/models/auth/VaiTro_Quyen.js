import { DataTypes } from "sequelize";
import sequelize from "../../config/dbconnect.js";

const VaiTro_Quyen = sequelize.define(
  "VaiTro_Quyen",
  {
    MaVT: { type: DataTypes.STRING, allowNull: false },
    MaQuyen: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "VaiTro_Quyen",
    timestamps: false,
  },
);

export default VaiTro_Quyen;
