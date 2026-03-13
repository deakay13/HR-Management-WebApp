import fs from 'fs';
import csv from 'csv-parser';
import bcrypt from "bcrypt";

//readCSV
async function readCSV(path) {
  const records = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => records.push(row))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
}

export default {
  async up(queryInterface) {
    //Path infor
    const PhongBan = await readCSV('seeders/seed-data/PhongBan.csv');
    const nhanvien = await readCSV('seeders/seed-data/NhanVien.csv');
    //Path salary
    const KhauTru = await readCSV('seeders/seed-data/KhauTru.csv');
    const GioLam = await readCSV('seeders/seed-data/GioLam.csv');
    const LuongCoBan = await readCSV('seeders/seed-data/LuongCoBan.csv');
    const PhuCap = await readCSV('seeders/seed-data/PhuCap.csv');
    const BangLuong = await readCSV('seeders/seed-data/BangLuong.csv');
    //Path auth
    const VaiTro = await readCSV('seeders/seed-data/VaiTro.csv');
    const Quyen = await readCSV('seeders/seed-data/Quyen.csv');
    let TaiKhoan = await readCSV('seeders/seed-data/TaiKhoan.csv');
    const VaiTro_Quyen = await readCSV('seeders/seed-data/VaiTro_Quyen.csv');

    //hashedPassword
    TaiKhoan = await Promise.all(
      TaiKhoan.map(async (row) => {
        const hashedPassword = await bcrypt.hash(row.MatKhau.trim(), 10);
        return {
          MaTK: row.MaTK,
          MaNV: row.MaNV,
          MaVT: row.MaVT,
          TenTaiKhoan: row.TenTaiKhoan, 
          MatKhau: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    //Insert infor
    await queryInterface.bulkInsert('PhongBan', PhongBan);
    await queryInterface.bulkInsert('NhanVien', nhanvien);
    //Insert salary
    await queryInterface.bulkInsert('KhauTru', KhauTru);
    await queryInterface.bulkInsert('GioLam', GioLam);
    await queryInterface.bulkInsert('LuongCoBan', LuongCoBan);
    await queryInterface.bulkInsert('PhuCap', PhuCap);
    await queryInterface.bulkInsert('BangLuong', BangLuong);
    //Insert auth
    await queryInterface.bulkInsert('VaiTro', VaiTro);
    await queryInterface.bulkInsert('Quyen', Quyen);
    await queryInterface.bulkInsert('TaiKhoan', TaiKhoan);
    await queryInterface.bulkInsert('VaiTro_Quyen', VaiTro_Quyen);
  },   
  async down(queryInterface) {
    //Disconnect auth
    await queryInterface.bulkDelete('VaiTro_Quyen', null, {});
    await queryInterface.bulkDelete('TaiKhoan', null, {});
    await queryInterface.bulkDelete('Quyen', null, {});
    await queryInterface.bulkDelete('VaiTro', null, {});
    //Disconnect salary
    await queryInterface.bulkDelete('PhuCap', null, {});
    await queryInterface.bulkDelete('LuongCoBan', null, {});
    await queryInterface.bulkDelete('GioLam', null, {});
    await queryInterface.bulkDelete('KhauTru', null, {});
    await queryInterface.bulkDelete('BangLuong', null, {});
    //Disconnect infor
    await queryInterface.bulkDelete('NhanVien', null, {});
    await queryInterface.bulkDelete('PhongBan', null, {});
  }

};
