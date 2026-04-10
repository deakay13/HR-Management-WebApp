import { DataTypes } from "sequelize";
import sequelize from "../../config/dbconnect.js";

const BangLuong = sequelize.define("BangLuong", {
  MaBL:{type:DataTypes.STRING,allowNull:false,primaryKey:true},
  MaNV:{type:DataTypes.STRING,allowNull:false},
  MaLCB:{type:DataTypes.STRING,allowNull:false},
  MaPC:{type:DataTypes.STRING,allowNull:false},
  MaKT:{type:DataTypes.STRING,allowNull:false},
  MaGL:{type:DataTypes.STRING,allowNull:false},
  Thang:{type:DataTypes.STRING,allowNull:false},
  TongLuong:{type:DataTypes.DECIMAL(12,2),allowNull:false},
  NgayTinhLuong:{type:DataTypes.DATEONLY,allowNull:false,defaultValue:DataTypes.NOW},
  TrangThai:{type:DataTypes.STRING,allowNull:false,defaultValue:"DA_TINH"}
},{
  tableName:"BangLuong",
  timestamps:false
});

export default BangLuong;