export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('TaiKhoan', {
      MaTK: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      MaNV: {
        type: Sequelize.STRING, allowNull: false,
        references: {
          model: 'NhanVien',
          key: 'MaNV'
        },
      },
      MaVT: {
        type: Sequelize.STRING, allowNull: false,
        references: {
          model: 'VaiTro',
          key: 'MaVT'
        },
      },
      TaiKhoan:{ type: Sequelize.STRING, allowNull: false },
      MatKhau: { type: Sequelize.STRING, allowNull: false },
            createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('TaiKhoan');
  }
};
