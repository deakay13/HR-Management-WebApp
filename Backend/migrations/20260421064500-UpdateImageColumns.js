'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Cập nhật cột HinhAnh trong bảng NhanVien
    await queryInterface.changeColumn('NhanVien', 'HinhAnh', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });

    // Cập nhật cột HinhAnhHopDong trong bảng HopDong
    await queryInterface.changeColumn('HopDong', 'HinhAnhHopDong', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Khôi phục lại trạng thái cũ (thường là STRING/NVARCHAR(255))
    await queryInterface.changeColumn('NhanVien', 'HinhAnh', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('HopDong', 'HinhAnhHopDong', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
