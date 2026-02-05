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
      NgayKetThuc: { type: Sequelize.DATEONLY, allowNull: false},
      LuongCoBan: { type: Sequelize.DECIMAL(10,2) , allowNull: false },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('HopDong');
  }
};
