// models/auth/Session.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/dbconnect.js"; // file config kết nối SQL Server

const Session = sequelize.define(
  "Sessions",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    MaTK: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "TaiKhoan",
        key: "MaTK",
      },
      onDelete: "CASCADE",
    },
    refreshToken: { type: DataTypes.STRING, allowNull: false, unique: true },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    isRevoked: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "Sessions",
    timestamps: true,
  },
);

export default Session;
