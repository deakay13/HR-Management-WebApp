export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('BangLuong', { 
      MaBL: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      MaNV: {
        type: Sequelize.STRING, allowNull: false,
        references: {
          model: 'NhanVien',
          key: 'MaNV'
        },
      },
      MaLCB: {
        type: Sequelize.STRING, allowNull: false,
        references: {
          model: 'LuongCoBan',
          key: 'MaLCB'
        },
      },
      MaPC: {
        type: Sequelize.STRING, allowNull: false,
        references: {
          model: 'PhuCap',
          key: 'MaPC'
        },
      },
      MaKT: {
        type: Sequelize.STRING, allowNull: false,
        references: {
          model: 'KhauTru',
          key: 'MaKT'
        },
      },
      MaGL: {
        type: Sequelize.STRING, allowNull: false,
        references: {
          model: 'GioLam',
          key: 'MaGL'
        },
      },
      Thang : { type: Sequelize.DATEONLY, allowNull: false },
      TongLuong: { type: Sequelize.DECIMAL(10,2) , allowNull: false },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('BangLuong');
  }
};
