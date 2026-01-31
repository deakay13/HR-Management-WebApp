import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconnect.js';

const LuongCoBan = sequelize.define('LuongCoBan', {
    MaLCB: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    LuongCB: { type: DataTypes.DECIMAL(10,2) , allowNull: false },
}, {
    tableName: 'LuongCoBan',
    timestamps: false
});
export default LuongCoBan;