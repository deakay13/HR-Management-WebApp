import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconnect.js';

const KhauTru = sequelize.define('KhauTru', {
    MaKT: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    LoaiKT: { type: DataTypes.STRING, allowNull: false },
    Sotien: { type: DataTypes.DECIMAL(10,2) , allowNull: false },
}, {
    tableName: 'KhauTru',
    timestamps: false
});
export default KhauTru;