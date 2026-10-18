import type { IFinanceiroRepository } from '../../domain/financeiro/IFinanceiroRepository';
import { Transacao } from '../../domain/financeiro/Transacao';
import type { TipoTransacao, StatusTransacao } from '../../domain/financeiro/Transacao';
import { ValorMonetario } from '../../domain/financeiro/ValorMonetario';
import { FinanceiroRepository } from './FinanceiroRepository';

interface TransacaoApiItem {
  id: string;
  data: string;
  categoria: string;
  descricao: string;
  tipo: TipoTransacao;
  valorCentavos: number | string;
  status: StatusTransacao;
}

export class FinanceiroApiRepository implements IFinanceiroRepository {
  private readonly fallbackRepo: FinanceiroRepository;
  private readonly baseUrl: string;

  public constructor() {
    this.fallbackRepo = new FinanceiroRepository();
    const envUrl = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL;
    this.baseUrl = envUrl || 'http://localhost:3001';
  }

  private obterToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  public async listarTodas(): Promise<Transacao[]> {
    const token = this.obterToken();
    if (!token) {
      return this.fallbackRepo.listarTodas();
    }

    try {
      const response = await fetch(`${this.baseUrl}/transacoes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return this.fallbackRepo.listarTodas();
        }
        throw new Error(`Falha ao obter transações (${response.status})`);
      }

      const data = (await response.json()) as TransacaoApiItem[];
      return data.map(
        (item) =>
          new Transacao({
            id: item.id,
            data: item.data,
            categoria: item.categoria,
            descricao: item.descricao,
            tipo: item.tipo,
            valor: ValorMonetario.deCentavos(Number(item.valorCentavos)),
            status: item.status,
          })
      );
    } catch {
      // Fallback para dados locais caso a API esteja temporariamente inacessível
      return this.fallbackRepo.listarTodas();
    }
  }

  public async adicionar(transacao: Transacao): Promise<void> {
    const token = this.obterToken();
    if (!token) {
      return this.fallbackRepo.adicionar(transacao);
    }

    try {
      const response = await fetch(`${this.baseUrl}/transacoes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: transacao.id,
          data: transacao.data,
          categoria: transacao.categoria,
          descricao: transacao.descricao,
          tipo: transacao.tipo,
          valorCentavos: Math.round(transacao.valor.emReais() * 100),
          status: transacao.status,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar transação no servidor (${response.status})`);
      }

      // Registra automaticamente a atividade no histórico operacional
      try {
        const categoriaAtividade = transacao.tipo === 'ENTRADA' ? 'VENDAS' : 'SISTEMA';
        const tituloAtividade = transacao.tipo === 'ENTRADA' 
          ? `Receita registrada: ${transacao.descricao}`
          : `Despesa registrada: ${transacao.descricao}`;
        const agora = new Date();

        void fetch(`${this.baseUrl}/atividades`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            titulo: tituloAtividade,
            categoria: categoriaAtividade,
            data: transacao.data,
            horario: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status: transacao.status === 'CONCLUIDO' ? 'CONCLUIDO' : 'PENDENTE',
            valorFormatado: transacao.valor.formatar(),
          }),
        }).catch(() => {
          // Ignora falha de registro de auditoria secundária
        });
      } catch {
        // Ignora erro no disparo de atividade secundária
      }
    } catch (error) {
      // Salva localmente como segurança para não perder o lançamento
      await this.fallbackRepo.adicionar(transacao);
      throw error;
    }
  }

  public async remover(id: string): Promise<void> {
    const token = this.obterToken();
    if (!token) {
      return this.fallbackRepo.remover(id);
    }

    try {
      const response = await fetch(`${this.baseUrl}/transacoes/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`Erro ao remover transação no servidor (${response.status})`);
      }
    } catch (error) {
      await this.fallbackRepo.remover(id);
      throw error;
    }
  }

  public async limparTodas(): Promise<void> {
    const token = this.obterToken();
    if (!token) {
      return this.fallbackRepo.limparTodas();
    }

    try {
      const response = await fetch(`${this.baseUrl}/transacoes`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao limpar transações no servidor (${response.status})`);
      }
    } catch (error) {
      await this.fallbackRepo.limparTodas();
      throw error;
    }
  }

  public async sincronizarLocalStorage(): Promise<{ importadas: number; ignoradas: number }> {
    const token = this.obterToken();
    if (!token) return { importadas: 0, ignoradas: 0 };

    const transacoesLocais = await this.fallbackRepo.listarTodas();
    if (transacoesLocais.length === 0) return { importadas: 0, ignoradas: 0 };

    const payload = transacoesLocais.map((t) => ({
      id: t.id,
      data: t.data,
      categoria: t.categoria,
      descricao: t.descricao,
      tipo: t.tipo,
      valorCentavos: Math.round(t.valor.emReais() * 100),
      status: t.status,
    }));

    try {
      const response = await fetch(`${this.baseUrl}/transacoes/importar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transacoes: payload }),
      });

      if (response.ok) {
        const result = (await response.json()) as { totalImportadas: number; totalIgnoradas: number };
        return {
          importadas: result.totalImportadas,
          ignoradas: result.totalIgnoradas,
        };
      }
    } catch {
      // Ignora falha de sincronização silenciosa
    }

    return { importadas: 0, ignoradas: 0 };
  }
}
