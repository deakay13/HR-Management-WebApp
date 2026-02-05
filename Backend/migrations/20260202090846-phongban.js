
export default{
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PhongBan', {
      MaPB: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      TenPB: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('PhongBan');
  }
};
