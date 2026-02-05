export default{
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GioLam', { 
      MaGL: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      SoGioLam: { type: Sequelize.DECIMAL(10,2) , allowNull: false },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('GioLam');
  }
};
