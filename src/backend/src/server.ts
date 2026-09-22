import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type {userPayload, loginPayload } from '../../types/tipo';
import { ValidationError } from 'sequelize';
import { UsuarioModel, initDatabase } from '../../repository/persistency';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Inicializa a conexão com o banco de dados
initDatabase();

interface jwtPayload {
  id: string;
  role: string;
}

const mySecretKey = 'SenhaDoNossoSagradoTechDay2026';
const TOKEN_EXPIRATION = '1h';

// CADASTRO / LOGON
app.post('/logon', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Dados do usuário são obrigatórios' });
  }

  const { nome, email, senha, tipoEmpresa }: userPayload = req.body;

  try {
    // 1. Verifica se o e-mail já está em uso no banco
    const usuarioExistente = await UsuarioModel.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'E-mail já cadastrado!' });
    }

    // 2. Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    // 3. Cria o novo usuário no MySQL via Sequelize
    const novoUsuario = await UsuarioModel.create({
      nome,
      email,
      senha: hashedPassword,
      tipoEmpresa,
    });

    // 4. Criação do Token JWT
    const payload: jwtPayload = {
      id: novoUsuario.id,
      role: 'user',
    };

    const token = jwt.sign(payload, mySecretKey, {
      expiresIn: TOKEN_EXPIRATION,
      algorithm: 'HS256',
    });

    const payloadUser = {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      senha: novoUsuario.senha,
      tipoEmpresa: novoUsuario.tipoEmpresa,
    };

    return res.status(201).json({
      payloadUser,
      message: 'Usuário cadastrado com sucesso!',
      token,
    });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: 'Informe um e-mail válido.' });
    }
    return res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Erro ao realizar login, tente novamente!' });
  }

  const { email, senha }: loginPayload = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
  }

  try {
    // 1. Busca o usuário no banco de dados pelo e-mail
    const usuario = await UsuarioModel.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'Email ou senha inválidos!' });
    }

    // 2. Compara a senha fornecida com o hash salvo no banco
    const ehSenhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!ehSenhaValida) {
      return res.status(401).json({ error: 'Email ou senha inválidos!' });
    }

    // 3. Gera o token
    const payload: jwtPayload = {
      id: usuario.id,
      role: 'user',
    };

    const token = jwt.sign(payload, mySecretKey, {
      expiresIn: TOKEN_EXPIRATION,
      algorithm: 'HS256',
    });

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: usuario,
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro ao realizar login, tente novamente!' });
  }
});

// LISTAR TODOS OS USUÁRIOS
app.get('/users', async (req, res) => {
  try {
    const users = await UsuarioModel.findAll({
      attributes: { exclude: ['senha'] }, // Boa prática: oculta a senha na listagem
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000!');
});