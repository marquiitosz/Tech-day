import { Transacao } from './Transacao';
import type { TipoTransacao } from './Transacao';
import { ValorMonetario } from './ValorMonetario';

/**
 * Agregado Financeiro que calcula métricas consolidadas a partir de transações.
 */
export class RelatorioConsolidado {
  private readonly transacoes: Transacao[];

  public constructor(transacoes: Transacao[]) {
    this.transacoes = [...transacoes];
  }

  public obterTransacoes(): Transacao[] {
    return [...this.transacoes];
  }

  public totalEntradas(): ValorMonetario {
    return this.transacoes
      .filter((t) => t.ehEntrada())
      .reduce((acc, curr) => acc.somar(curr.valor), ValorMonetario.zero());
  }

  public totalSaidas(): ValorMonetario {
    return this.transacoes
      .filter((t) => t.ehSaida())
      .reduce((acc, curr) => acc.somar(curr.valor), ValorMonetario.zero());
  }

  public saldoLiquido(): ValorMonetario {
    return this.totalEntradas().subtrair(this.totalSaidas());
  }

  public filtrarPorTipo(tipo?: TipoTransacao): Transacao[] {
    if (!tipo) return this.transacoes;
    return this.transacoes.filter((t) => t.tipo === tipo);
  }

  public buscarPorTermo(termo: string): Transacao[] {
    const limpo = termo.trim().toLowerCase();
    if (!limpo) return this.transacoes;
    return this.transacoes.filter(
      (t) =>
        t.descricao.toLowerCase().includes(limpo) ||
        t.categoria.toLowerCase().includes(limpo)
    );
  }

  public estaVazio(): boolean {
    return this.transacoes.length === 0;
  }
}
