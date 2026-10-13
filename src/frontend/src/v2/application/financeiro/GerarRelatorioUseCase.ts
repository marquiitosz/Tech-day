import type { IFinanceiroRepository } from '../../domain/financeiro/IFinanceiroRepository';
import { RelatorioConsolidado } from '../../domain/financeiro/RelatorioConsolidado';

export class GerarRelatorioUseCase {
  private readonly repo: IFinanceiroRepository;

  public constructor(repo: IFinanceiroRepository) {
    this.repo = repo;
  }

  public async executar(): Promise<RelatorioConsolidado> {
    const transacoes = await this.repo.listarTodas();
    return new RelatorioConsolidado(transacoes);
  }
}
