import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { user } from "../types/tipo";

const sequelize = new Sequelize('LOJA', 'devuser', 'adilson', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

export type UserCreationAttributes = Optional<user, 'id'>;

export class UsuarioModel extends Model<user, UserCreationAttributes> implements user {
  declare id: string;
  declare nome: string;
  declare email: string;
  declare senha: string;
  declare tipoEmpresa: string;
}

UsuarioModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipoEmpresa: {
      type: DataTypes.ENUM(
        'Microempreendedor Individual',
        'Microempresa',
        'Empresa de Pequeno Porte'
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Usuarios',
  }
);

// Função para inicializar o banco de dados no servidor
export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso!');
    console.log('Conexão com o banco pronta. Execute npm run db:migrate para aplicar migrations.');
  } catch (error) {
    console.error('Erro de conexão com o banco de dados:', error);
  }
}
