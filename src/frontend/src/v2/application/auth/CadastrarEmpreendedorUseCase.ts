import type { IAuthRepository, ResultadoAutenticacao } from '../../domain/auth/IAuthRepository';
import { Email, Senha, TipoEmpresa } from '../../domain/auth/ValueObjects';

export interface EntradaCadastroDTO {
  nome: string;
  email: string;
  senha: string;
  tipoEmpresa: string;
}

export class CadastrarEmpreendedorUseCase {
  private readonly repo: IAuthRepository;

  public constructor(repo: IAuthRepository) {
    this.repo = repo;
  }

  public async executar(entrada: EntradaCadastroDTO): Promise<ResultadoAutenticacao> {
    if (!entrada.nome || !entrada.nome.trim()) {
      throw new Error('Por favor, informe seu nome completo.');
    }

    const emailVo = Email.criar(entrada.email);
    const senhaVo = Senha.criar(entrada.senha);
    const tipoEmpresaVo = TipoEmpresa.criar(entrada.tipoEmpresa);

    return this.repo.cadastrar({
      nome: entrada.nome.trim(),
      email: emailVo,
      senha: senhaVo,
      tipoEmpresa: tipoEmpresaVo,
    });
  }
}
