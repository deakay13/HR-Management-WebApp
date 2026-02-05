export default{
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('LuongCoBan', {
      MaLCB: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      LuongCB: { type: Sequelize.DECIMAL(10,2) , allowNull: false },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('LuongCoBan');
  }
};
