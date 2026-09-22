module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('Usuarios');

    if (tableExists) {
      return;
    }

    await queryInterface.createTable('Usuarios', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipoEmpresa: {
        type: Sequelize.ENUM(
          'Microempreendedor Individual',
          'Microempresa',
          'Empresa de Pequeno Porte'
        ),
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Usuarios');
  },
};