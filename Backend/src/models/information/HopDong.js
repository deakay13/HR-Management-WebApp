import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconnect.js';

const HopDong = sequelize.define('HopDong', {
    MaHopDong: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    MaNV: { type: DataTypes.STRING, allowNull: false },
    LoaiHD: { type: DataTypes.STRING, allowNull: false },
    NgayBatDau: { type: DataTypes.DATEONLY, allowNull: false },
    NgayKetThuc: { type: DataTypes.DATEONLY, allowNull: false},
    LuongCoBan: { type: DataTypes.DECIMAL(10,2) , allowNull: false },
}, {
    tableName: 'HopDong',
    timestamps: false
});
export default HopDong;
