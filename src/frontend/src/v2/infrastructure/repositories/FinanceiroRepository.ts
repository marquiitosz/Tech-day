import type { IFinanceiroRepository } from '../../domain/financeiro/IFinanceiroRepository';
import { Transacao } from '../../domain/financeiro/Transacao';
import type { TipoTransacao, StatusTransacao } from '../../domain/financeiro/Transacao';
import { ValorMonetario } from '../../domain/financeiro/ValorMonetario';

interface TransacaoArmazenada {
  id: string;
  data: string;
  categoria: string;
  descricao: string;
  tipo: TipoTransacao;
  centavos: number;
  status: StatusTransacao;
}

const STORAGE_KEY = 'empreendafacil_v2_transacoes_reais';

export class FinanceiroRepository implements IFinanceiroRepository {
  public async listarTodas(): Promise<Transacao[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as TransacaoArmazenada[];
      if (!Array.isArray(parsed)) return [];

      return parsed.map(
        (item) =>
          new Transacao({
            id: item.id,
            data: item.data,
            categoria: item.categoria,
            descricao: item.descricao,
            tipo: item.tipo,
            valor: ValorMonetario.deCentavos(item.centavos),
            status: item.status,
          })
      );
    } catch {
      return [];
    }
  }

  public async adicionar(transacao: Transacao): Promise<void> {
    const atuais = await this.listarTodas();
    const novaLista = [transacao, ...atuais];
    this.salvar(novaLista);
  }

  public async remover(id: string): Promise<void> {
    const atuais = await this.listarTodas();
    const filtradas = atuais.filter((t) => t.id !== id);
    this.salvar(filtradas);
  }

  public async limparTodas(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }

  private salvar(transacoes: Transacao[]): void {
    const paraSalvar: TransacaoArmazenada[] = transacoes.map((t) => ({
      id: t.id,
      data: t.data,
      categoria: t.categoria,
      descricao: t.descricao,
      tipo: t.tipo,
      centavos: Math.round(t.valor.emReais() * 100),
      status: t.status,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paraSalvar));
  }
}
