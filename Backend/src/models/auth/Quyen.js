import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconnect.js';

const Quyen = sequelize.define('Quyen', {
    MaQuyen: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    TenQuyen: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'Quyen',
    timestamps: false
});

export default Quyen;
