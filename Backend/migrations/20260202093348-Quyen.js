export default{
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Quyen', {
      MaQuyen: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      TenQuyen: { type: Sequelize.STRING, allowNull: false }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('Quyen');
  }
};
