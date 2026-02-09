export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      MaTK: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: 'TaiKhoan', key: 'MaTK' },
        onDelete: 'CASCADE'
      },
      refreshToken: { type: Sequelize.STRING, allowNull: false, unique: true },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      isRevoked: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Sessions');
  }
};