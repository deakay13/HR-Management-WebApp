import { sequelize, PhongBan, NhanVien } from '../src/models/index.js';
import { readCSV } from './readCSV.js';

export async function seedData() {
  // 1. Seed PhongBan
    const phongban = await readCSV('PhongBan.csv');
    await PhongBan.bulkCreate(phongban.map(pb => ({
        ...pb,
        createdAt: new Date(),
        updatedAt: new Date()
    })));
    console.log('✅ Seed dữ liệu PhongBan thành công!');

    // 2. Seed NhanVien
    const nhanvien = await readCSV('NhanVien.csv');
    await NhanVien.bulkCreate(nhanvien.map(nv => ({
        ...nv,
        createdAt: new Date(),
        updatedAt: new Date()
    })));
    console.log('✅ Seed dữ liệu NhanVien thành công!');

}