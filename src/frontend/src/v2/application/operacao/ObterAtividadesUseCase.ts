import type { Atividade } from '../../domain/operacao/Atividade';
import type { IOperacaoRepository } from '../../domain/operacao/IOperacaoRepository';

export class ObterAtividadesUseCase {
  private readonly repo: IOperacaoRepository;

  public constructor(repo: IOperacaoRepository) {
    this.repo = repo;
  }

  public async executar(): Promise<Atividade[]> {
    return this.repo.listarRecentes();
  }
}
