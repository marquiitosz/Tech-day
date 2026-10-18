import { Sequelize, DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import type { user } from "../types/tipo";

const sequelize = new Sequelize(process.env.DB_NAME || 'LOJA', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || 'localhost',
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

export interface TransacaoAttributes {
  id: string;
  usuarioId: string;
  descricao: string;
  categoria: string;
  tipo: 'ENTRADA' | 'SAIDA';
  valorCentavos: number | string;
  status: 'CONCLUIDO' | 'PENDENTE';
  data: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TransacaoCreationAttributes = Optional<
  TransacaoAttributes,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export class TransacaoModel
  extends Model<TransacaoAttributes, TransacaoCreationAttributes>
  implements TransacaoAttributes
{
  declare id: string;
  declare usuarioId: string;
  declare descricao: string;
  declare categoria: string;
  declare tipo: 'ENTRADA' | 'SAIDA';
  declare valorCentavos: number | string;
  declare status: 'CONCLUIDO' | 'PENDENTE';
  declare data: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TransacaoModel.init(
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('ENTRADA', 'SAIDA'),
      allowNull: false,
    },
    valorCentavos: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('CONCLUIDO', 'PENDENTE'),
      allowNull: false,
      defaultValue: 'CONCLUIDO',
    },
    data: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Transacoes',
  }
);

UsuarioModel.hasMany(TransacaoModel, { foreignKey: 'usuarioId', as: 'transacoes', onDelete: 'CASCADE' });
TransacaoModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId', as: 'usuario' });

export interface AtividadeAttributes {
  id: string;
  usuarioId: string;
  titulo: string;
  categoria: 'VENDAS' | 'CLIENTES' | 'CAPACITACAO' | 'SISTEMA';
  data: string;
  horario: string;
  status: 'CONCLUIDO' | 'PENDENTE' | 'CANCELADO';
  valorFormatado?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AtividadeCreationAttributes = Optional<
  AtividadeAttributes,
  'id' | 'status' | 'valorFormatado' | 'createdAt' | 'updatedAt'
>;

export class AtividadeModel
  extends Model<AtividadeAttributes, AtividadeCreationAttributes>
  implements AtividadeAttributes
{
  declare id: string;
  declare usuarioId: string;
  declare titulo: string;
  declare categoria: 'VENDAS' | 'CLIENTES' | 'CAPACITACAO' | 'SISTEMA';
  declare data: string;
  declare horario: string;
  declare status: 'CONCLUIDO' | 'PENDENTE' | 'CANCELADO';
  declare valorFormatado?: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AtividadeModel.init(
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'id',
      },
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    categoria: {
      type: DataTypes.ENUM('VENDAS', 'CLIENTES', 'CAPACITACAO', 'SISTEMA'),
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    horario: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('CONCLUIDO', 'PENDENTE', 'CANCELADO'),
      allowNull: false,
      defaultValue: 'CONCLUIDO',
    },
    valorFormatado: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Atividades',
  }
);

UsuarioModel.hasMany(AtividadeModel, { foreignKey: 'usuarioId', as: 'atividades', onDelete: 'CASCADE' });
AtividadeModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId', as: 'usuario' });

export { sequelize };

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

