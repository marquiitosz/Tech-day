module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('Atividades');

    if (tableExists) {
      return;
    }

    await queryInterface.createTable('Atividades', {
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
      titulo: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      categoria: {
        type: Sequelize.ENUM('VENDAS', 'CLIENTES', 'CAPACITACAO', 'SISTEMA'),
        allowNull: false,
      },
      data: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      horario: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('CONCLUIDO', 'PENDENTE', 'CANCELADO'),
        allowNull: false,
        defaultValue: 'CONCLUIDO',
      },
      valorFormatado: {
        type: Sequelize.STRING(50),
        allowNull: true,
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

    await queryInterface.addIndex('Atividades', ['usuarioId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Atividades');
  },
};
