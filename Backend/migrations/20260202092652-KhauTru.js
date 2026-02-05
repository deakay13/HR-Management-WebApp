export default{
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('KhauTru', { 
      MaKT: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      LoaiKT: { type: Sequelize.STRING, allowNull: false },
      PhanTram: { type: Sequelize.DECIMAL(5,2) , allowNull: false },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('KhauTru');
  }
};
