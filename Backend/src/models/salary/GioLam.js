import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconnect.js';

const GioLam = sequelize.define('GioLam', {
  MaGL: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  SoGioLam: { type: DataTypes.DECIMAL(10,2) , allowNull: false },
  SoNgayLam: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 26 },
  TongSoGio: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 208 },
}, {
    tableName: 'GioLam',
    timestamps: false
});
export default GioLam;