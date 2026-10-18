module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('Transacoes');

    if (tableExists) {
      return;
    }

    await queryInterface.createTable('Transacoes', {
      id: {
        type: Sequelize.STRING(64),
        allowNull: false,
        primaryKey: true,
      },
      usuarioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      descricao: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      categoria: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM('ENTRADA', 'SAIDA'),
        allowNull: false,
      },
      valorCentavos: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('CONCLUIDO', 'PENDENTE'),
        allowNull: false,
        defaultValue: 'CONCLUIDO',
      },
      data: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('Transacoes', ['usuarioId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Transacoes');
  },
};
