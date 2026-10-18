import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { TransacaoModel } from '../../../repository/persistency';
import type { TipoTransacao, StatusTransacao } from '../../../types/tipo';

interface JwtPayload {
  id: string;
  role?: string;
}

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const transacoesRouter = Router();

// Middleware de autenticação JWT unificado
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

transacoesRouter.use(authMiddleware);

// GET /transacoes - Lista todas as transações do usuário logado
transacoesRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const usuarioId = req.userId!;
    const transacoes = await TransacaoModel.findAll({
      where: { usuarioId },
      order: [['createdAt', 'DESC']],
    });

    const formatadas = transacoes.map((t) => ({
      id: t.id,
      usuarioId: t.usuarioId,
      descricao: t.descricao,
      categoria: t.categoria,
      tipo: t.tipo,
      valorCentavos: Number(t.valorCentavos),
      status: t.status,
      data: t.data,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return res.status(200).json(formatadas);
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    return res.status(500).json({ error: 'Erro interno ao consultar transações.' });
  }
});

// POST /transacoes - Cria uma nova transação para o usuário logado
transacoesRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Corpo da requisição é obrigatório.' });
  }

  const { id, descricao, categoria, tipo, valorCentavos, centavos, valor, status, data } = req.body;

  if (typeof descricao !== 'string' || !descricao.trim()) {
    return res.status(400).json({ error: 'Descrição da transação é obrigatória.' });
  }

  if (typeof categoria !== 'string' || !categoria.trim()) {
    return res.status(400).json({ error: 'Categoria da transação é obrigatória.' });
  }

  if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
    return res.status(400).json({ error: 'Tipo inválido. Deve ser ENTRADA ou SAIDA.' });
  }

  let finalCentavos = 0;
  if (valorCentavos !== undefined && !isNaN(Number(valorCentavos))) {
    finalCentavos = Math.round(Number(valorCentavos));
  } else if (centavos !== undefined && !isNaN(Number(centavos))) {
    finalCentavos = Math.round(Number(centavos));
  } else if (valor !== undefined && !isNaN(Number(valor))) {
    finalCentavos = Math.round(Number(valor) * 100);
  } else {
    return res.status(400).json({ error: 'Valor da transação é obrigatório.' });
  }

  if (finalCentavos <= 0) {
    return res.status(400).json({ error: 'O valor da transação deve ser positivo maior que zero.' });
  }

  const finalStatus: StatusTransacao = status === 'PENDENTE' ? 'PENDENTE' : 'CONCLUIDO';
  const finalTipo: TipoTransacao = tipo;
  const finalData = typeof data === 'string' && data.trim()
    ? data.trim()
    : new Date().toLocaleDateString('pt-BR');

  const finalId = typeof id === 'string' && id.trim()
    ? id.trim().slice(0, 64)
    : `tx_${Date.now()}_${randomUUID().slice(0, 8)}`;

  try {
    const usuarioId = req.userId!;
    const nova = await TransacaoModel.create({
      id: finalId,
      usuarioId,
      descricao: descricao.trim().slice(0, 255),
      categoria: categoria.trim().slice(0, 100),
      tipo: finalTipo,
      valorCentavos: finalCentavos,
      status: finalStatus,
      data: finalData,
    });

    return res.status(201).json({
      id: nova.id,
      usuarioId: nova.usuarioId,
      descricao: nova.descricao,
      categoria: nova.categoria,
      tipo: nova.tipo,
      valorCentavos: Number(nova.valorCentavos),
      status: nova.status,
      data: nova.data,
      createdAt: nova.createdAt,
      updatedAt: nova.updatedAt,
    });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar transação.' });
  }
});

// DELETE /transacoes/:id - Exclui uma transação específica do usuário
transacoesRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const usuarioId = req.userId!;

  if (!id) {
    return res.status(400).json({ error: 'ID da transação é obrigatório.' });
  }

  try {
    const transacao = await TransacaoModel.findOne({
      where: { id, usuarioId },
    });

    if (!transacao) {
      return res.status(404).json({ error: 'Transação não encontrada.' });
    }

    await transacao.destroy();
    return res.status(200).json({ message: 'Transação excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    return res.status(500).json({ error: 'Erro interno ao excluir transação.' });
  }
});

// DELETE /transacoes - Remove todas as transações do usuário logado
transacoesRouter.delete('/', async (req: AuthenticatedRequest, res: Response) => {
  const usuarioId = req.userId!;
  try {
    const total = await TransacaoModel.destroy({ where: { usuarioId } });
    return res.status(200).json({
      message: 'Todas as transações foram removidas com sucesso.',
      removidas: total,
    });
  } catch (error) {
    console.error('Erro ao limpar transações:', error);
    return res.status(500).json({ error: 'Erro interno ao limpar transações.' });
  }
});

// POST /transacoes/importar - Importação em lote idempotente
transacoesRouter.post('/importar', async (req: AuthenticatedRequest, res: Response) => {
  const usuarioId = req.userId!;
  const lista = Array.isArray(req.body)
    ? req.body
    : Array.isArray(req.body?.transacoes)
    ? req.body.transacoes
    : null;

  if (!lista) {
    return res.status(400).json({ error: 'Envie um array de transações no corpo da requisição.' });
  }

  if (lista.length === 0) {
    return res.status(200).json({
      message: 'Nenhuma transação enviada para importação.',
      totalImportadas: 0,
      totalIgnoradas: 0,
    });
  }

  if (lista.length > 1000) {
    return res.status(400).json({ error: 'Limite de 1000 transações por importação excedido.' });
  }

  try {
    let importadas = 0;
    let ignoradas = 0;

    for (const item of lista) {
      if (!item || typeof item !== 'object') {
        ignoradas++;
        continue;
      }

      const { id, descricao, categoria, tipo, valorCentavos, centavos, valor, status, data } = item as Record<string, unknown>;

      if (typeof descricao !== 'string' || !descricao.trim()) {
        ignoradas++;
        continue;
      }

      if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
        ignoradas++;
        continue;
      }

      let finalCentavos = 0;
      if (valorCentavos !== undefined && !isNaN(Number(valorCentavos))) {
        finalCentavos = Math.round(Number(valorCentavos));
      } else if (centavos !== undefined && !isNaN(Number(centavos))) {
        finalCentavos = Math.round(Number(centavos));
      } else if (valor !== undefined && !isNaN(Number(valor))) {
        finalCentavos = Math.round(Number(valor) * 100);
      }

      if (finalCentavos <= 0) {
        ignoradas++;
        continue;
      }

      const finalId = typeof id === 'string' && id.trim()
        ? id.trim().slice(0, 64)
        : `tx_${Date.now()}_${randomUUID().slice(0, 8)}`;

      // Idempotência: não duplica se id já existir para o usuário
      const existente = await TransacaoModel.findOne({
        where: { id: finalId, usuarioId },
      });

      if (existente) {
        ignoradas++;
        continue;
      }

      const finalCategoria = typeof categoria === 'string' && categoria.trim()
        ? categoria.trim().slice(0, 100)
        : 'Geral';
      const finalStatus: StatusTransacao = status === 'PENDENTE' ? 'PENDENTE' : 'CONCLUIDO';
      const finalTipo: TipoTransacao = tipo;
      const finalData = typeof data === 'string' && data.trim()
        ? data.trim()
        : new Date().toLocaleDateString('pt-BR');

      await TransacaoModel.create({
        id: finalId,
        usuarioId,
        descricao: descricao.trim().slice(0, 255),
        categoria: finalCategoria,
        tipo: finalTipo,
        valorCentavos: finalCentavos,
        status: finalStatus,
        data: finalData,
      });

      importadas++;
    }

    return res.status(200).json({
      message: 'Importação processada com sucesso.',
      totalImportadas: importadas,
      totalIgnoradas: ignoradas,
    });
  } catch (error) {
    console.error('Erro na importação de transações:', error);
    return res.status(500).json({ error: 'Erro interno ao importar transações.' });
  }
});
