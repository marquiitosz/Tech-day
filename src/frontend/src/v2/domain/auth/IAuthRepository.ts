import { Empreendedor } from './Empreendedor';
import { Email, Senha, TipoEmpresa } from './ValueObjects';

export interface CadastroEmpreendedorDTO {
  nome: string;
  email: Email;
  senha: Senha;
  tipoEmpresa: TipoEmpresa;
}

export interface LoginEmpreendedorDTO {
  email: Email;
  senha: Senha;
}

export interface ResultadoAutenticacao {
  empreendedor: Empreendedor;
  token: string;
}

export interface IAuthRepository {
  cadastrar(dto: CadastroEmpreendedorDTO): Promise<ResultadoAutenticacao>;
  autenticar(dto: LoginEmpreendedorDTO): Promise<ResultadoAutenticacao>;
  obterSessao(): Promise<Empreendedor | null>;
  encerrarSessao(): Promise<void>;
}
