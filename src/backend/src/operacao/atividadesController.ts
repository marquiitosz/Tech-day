import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { AtividadeModel } from '../../../repository/persistency';

interface JwtPayload {
  id: string;
  role?: string;
}

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const atividadesRouter = Router();

// Middleware de autenticação JWT
function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Token inválido ou ausente.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'JWT_SECRET não configurado no servidor.' });
  }

  try {
    const payload = jwt.verify(token, secret) as unknown as JwtPayload;
    if (!payload?.id) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
    req.userId = payload.id;
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

atividadesRouter.use(authMiddleware);

// GET /atividades - Lista atividades recentes do usuário logado
atividadesRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const usuarioId = req.userId!;
    const limite = Math.min(Math.max(Number(req.query.limite) || 50, 1), 100);

    const atividades = await AtividadeModel.findAll({
      where: { usuarioId },
      order: [['createdAt', 'DESC']],
      limit: limite,
    });

    return res.status(200).json(atividades);
  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    return res.status(500).json({ error: 'Erro interno ao consultar histórico de atividades.' });
  }
});

// POST /atividades - Registra uma nova atividade
atividadesRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Corpo da requisição é obrigatório.' });
  }

  const { id, titulo, categoria, data, horario, status, valorFormatado } = req.body;

  if (typeof titulo !== 'string' || !titulo.trim()) {
    return res.status(400).json({ error: 'Título da atividade é obrigatório.' });
  }

  const categoriasValidas = ['VENDAS', 'CLIENTES', 'CAPACITACAO', 'SISTEMA'];
  if (!categoriasValidas.includes(categoria)) {
    return res.status(400).json({ error: 'Categoria inválida. Deve ser VENDAS, CLIENTES, CAPACITACAO ou SISTEMA.' });
  }

  const statusValidos = ['CONCLUIDO', 'PENDENTE', 'CANCELADO'];
  const finalStatus = statusValidos.includes(status) ? status : 'CONCLUIDO';

  const agora = new Date();
  const finalData = typeof data === 'string' && data.trim()
    ? data.trim()
    : agora.toLocaleDateString('pt-BR');
  const finalHorario = typeof horario === 'string' && horario.trim()
    ? horario.trim()
    : agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const finalId = typeof id === 'string' && id.trim()
    ? id.trim().slice(0, 64)
    : `act_${Date.now()}_${randomUUID().slice(0, 8)}`;

  try {
    const usuarioId = req.userId!;
    const nova = await AtividadeModel.create({
      id: finalId,
      usuarioId,
      titulo: titulo.trim().slice(0, 255),
      categoria,
      data: finalData,
      horario: finalHorario,
      status: finalStatus,
      valorFormatado: typeof valorFormatado === 'string' ? valorFormatado.trim().slice(0, 50) : null,
    });

    return res.status(201).json(nova);
  } catch (error) {
    console.error('Erro ao registrar atividade:', error);
    return res.status(500).json({ error: 'Erro interno ao registrar atividade.' });
  }
});

// DELETE /atividades - Limpa histórico de atividades do usuário logado
atividadesRouter.delete('/', async (req: AuthenticatedRequest, res: Response) => {
  const usuarioId = req.userId!;
  try {
    const total = await AtividadeModel.destroy({ where: { usuarioId } });
    return res.status(200).json({
      message: 'Todas as atividades foram removidas com sucesso.',
      removidas: total,
    });
  } catch (error) {
    console.error('Erro ao limpar atividades:', error);
    return res.status(500).json({ error: 'Erro interno ao limpar histórico de atividades.' });
  }
});
