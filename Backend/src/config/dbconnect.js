import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: Number(process.env.DB_PORT),
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        requestTimeout: 60000,
      },
    },
    logging: false,
  },
);

export default sequelize;
