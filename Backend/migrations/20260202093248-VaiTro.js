export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('VaiTro', {
      MaVT: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      TenVaiTro: { type: Sequelize.STRING, allowNull: false },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('VaiTro');
  }
};
