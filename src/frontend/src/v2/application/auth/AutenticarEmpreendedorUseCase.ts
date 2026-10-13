import type { IAuthRepository, ResultadoAutenticacao } from '../../domain/auth/IAuthRepository';
import { Email, Senha } from '../../domain/auth/ValueObjects';

export interface EntradaLoginDTO {
  email: string;
  senha: string;
}

export class AutenticarEmpreendedorUseCase {
  private readonly repo: IAuthRepository;

  public constructor(repo: IAuthRepository) {
    this.repo = repo;
  }

  public async executar(entrada: EntradaLoginDTO): Promise<ResultadoAutenticacao> {
    const emailVo = Email.criar(entrada.email);
    const senhaVo = Senha.criar(entrada.senha);

    return this.repo.autenticar({
      email: emailVo,
      senha: senhaVo,
    });
  }
}
