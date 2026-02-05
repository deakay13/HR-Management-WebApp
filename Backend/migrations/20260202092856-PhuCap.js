export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PhuCap', {
      MaPC: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      LoaiPC: { type: Sequelize.STRING, allowNull: false },
      SoTien: { type: Sequelize.DECIMAL(10,2) , allowNull: false },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('PhuCap');
  }
};
