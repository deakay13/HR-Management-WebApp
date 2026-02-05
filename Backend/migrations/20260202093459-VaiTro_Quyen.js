export default{
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('VaiTro_Quyen', {
      MaVT: {
        type: Sequelize.STRING, allowNull: false,
        references: {
          model: 'VaiTro',
          key: 'MaVT'
        },
      },
      MaQuyen: {
          type: Sequelize.STRING, allowNull: false,
            references: {
            model: 'Quyen',
            key: 'MaQuyen'
          },
        }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('VaiTro_Quyen');
  }
};
