export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('NhanVien', 'HinhAnh', {
      type: Sequelize.TEXT('long'),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('NhanVien', 'HinhAnh', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
