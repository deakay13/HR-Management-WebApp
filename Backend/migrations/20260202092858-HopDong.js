export default{
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('HopDong', { 
      MaHopDong: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      MaNV: {
        type: Sequelize.STRING, allowNull: false,
        references: {
          model: 'NhanVien',
          key: 'MaNV'
        },
      },
      LoaiHD: { type: Sequelize.STRING, allowNull: false },
      NgayBatDau: { type: Sequelize.DATEONLY, allowNull: false },
      NgayKetThuc: { type: Sequelize.DATEONLY, allowNull: true },
      NgayKy: { type: Sequelize.DATEONLY, allowNull: true },
      ChucDanh: { type: Sequelize.STRING, allowNull: true },
      MaPB: {
        type: Sequelize.STRING, allowNull: true,
        references: { model: 'PhongBan', key: 'MaPB' },
      },
      MaLCB: {
        type: Sequelize.STRING, allowNull: true,
        references: { model: 'LuongCoBan', key: 'MaLCB' },
      },
      MaPC: {
        type: Sequelize.STRING, allowNull: true,
        references: { model: 'PhuCap', key: 'MaPC' },
      },
      HinhThucTraLuong: { type: Sequelize.STRING, allowNull: true },
      TinhTrang: { type: Sequelize.STRING, allowNull: true },
      HinhAnhHopDong: { type: Sequelize.STRING, allowNull: true }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('HopDong');
  }
};
