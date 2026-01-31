import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconnect.js';

const PhongBan = sequelize.define('PhongBan', {
    MaPB: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    TenPB: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'PhongBan',
    timestamps: false
});
export default PhongBan;
