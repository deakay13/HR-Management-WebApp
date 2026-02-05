export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('NhanVien', { 
      MaNV: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      MaPB: {
        type: Sequelize.STRING, allowNull: false,
        references: {
          model: 'PhongBan',
          key: 'MaPB'
        },
      },
      HoVaTen: { type: Sequelize.STRING, allowNull: false },
      GioiTinh: { type: Sequelize.STRING, allowNull: false },
      NgaySinh: { type: Sequelize.DATEONLY, allowNull: false },
      DiaChi: { type: Sequelize.STRING, allowNull: false },
      NgayVaoLam:{ type: Sequelize.DATEONLY, allowNull: false },
      SDT: { type: Sequelize.STRING, allowNull: false },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('NhanVien');
  }
};
