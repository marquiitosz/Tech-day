import './loadEnv';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type {userPayload, loginPayload } from '../../types/tipo';
import { ValidationError } from 'sequelize';
import { UsuarioModel, initDatabase } from '../../repository/persistency';
import { chatbotRouter } from './chatbot/chatbotController';
import { transacoesRouter } from './transacoes/transacoesController';
import { atividadesRouter } from './operacao/atividadesController';

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Headers de segurança HTTP essenciais (estilo Helmet sem dependências externas)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.removeHeader('X-Powered-By');
  next();
});

// Limitador de requisições em memória (Rate Limiting sem dependências externas)
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

function criarRateLimiter(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({ error: 'Muitas requisições. Tente novamente mais tarde.' });
    }

    record.count += 1;
    return next();
  };
}

const loginRateLimiter = criarRateLimiter(10, 15 * 60 * 1000); // 10 tentativas a cada 15 min

// Inicializa a conexão com o banco de dados
initDatabase();

interface jwtPayload {
  id: string;
  role: string;
}

const mySecretKey = process.env.JWT_SECRET;
if (!mySecretKey) {
  throw new Error('JWT_SECRET não configurado nas variáveis de ambiente.');
}
const TOKEN_EXPIRATION = '1h';

function getUserIdFromToken(req: express.Request): string | null {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, mySecretKey as string) as unknown as jwtPayload;
    return payload.id;
  } catch {
    return null;
  }
}

// CADASTRO / LOGON
app.post('/logon', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Dados do usuário são obrigatórios' });
  }

  const { nome, email, senha, tipoEmpresa }: userPayload = req.body;

  if (
    typeof nome !== 'string' ||
    typeof email !== 'string' ||
    typeof senha !== 'string' ||
    typeof tipoEmpresa !== 'string'
  ) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios e devem ser texto.' });
  }

  const nomeLimpo = nome.trim();
  const emailLimpo = email.trim();

  if (!nomeLimpo || !emailLimpo || !senha || !tipoEmpresa) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  if (nomeLimpo.length > 255 || emailLimpo.length > 255) {
    return res.status(400).json({ error: 'Nome e e-mail devem ter no máximo 255 caracteres.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ error: 'A senha deve conter no mínimo 6 caracteres.' });
  }

  const tiposPermitidos = [
    'Microempreendedor Individual',
    'Microempresa',
    'Empresa de Pequeno Porte',
  ];

  if (!tiposPermitidos.includes(tipoEmpresa)) {
    return res.status(400).json({ error: 'Tipo de empresa inválido.' });
  }

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
app.post('/login', loginRateLimiter, async (req, res) => {
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
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoEmpresa: usuario.tipoEmpresa,
      },
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro ao realizar login, tente novamente!' });
  }
});

// CONSULTAR USUÁRIO AUTENTICADO
app.get('/me', async (req, res) => {
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({ error: 'Token inválido ou ausente.' });
  }

  try {
    const usuario = await UsuarioModel.findByPk(userId, {
      attributes: { exclude: ['senha'] },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário autenticado:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

app.use('/api/chatbot', chatbotRouter);
app.use('/transacoes', transacoesRouter);
app.use('/atividades', atividadesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});