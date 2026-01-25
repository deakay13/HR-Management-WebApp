import { DataTypes } from 'sequelize';
import sequelize from '../dbconnect.js';

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  tableName: 'Users'
});

export default User;
