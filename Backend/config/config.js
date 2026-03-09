import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: "localhost",
    port: 1433,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    }
  }
};