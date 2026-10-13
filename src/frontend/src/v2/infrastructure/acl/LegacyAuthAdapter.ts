import type {
  IAuthRepository,
  CadastroEmpreendedorDTO,
  LoginEmpreendedorDTO,
  ResultadoAutenticacao,
} from '../../domain/auth/IAuthRepository';
import { Empreendedor } from '../../domain/auth/Empreendedor';
import { Email, TipoEmpresa } from '../../domain/auth/ValueObjects';

const BASE_URL = 'http://localhost:3000';
const TOKEN_KEY = 'token';
const USER_NAME_KEY = 'userName';

export class LegacyAuthAdapter implements IAuthRepository {
  public async cadastrar(dto: CadastroEmpreendedorDTO): Promise<ResultadoAutenticacao> {
    const payload = {
      nome: dto.nome,
      email: dto.email.obterValor(),
      senha: dto.senha.obterValor(),
      tipoEmpresa: dto.tipoEmpresa.obterDescricao(),
    };

    const response = await fetch(`${BASE_URL}/logon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? 'Falha ao realizar cadastro.');
    }

    const token = data.token as string;
    this.persistirSessao(token, data.payloadUser?.nome ?? dto.nome);

    const empreendedor = new Empreendedor({
      id: String(data.payloadUser?.id ?? 'novo'),
      nome: data.payloadUser?.nome ?? dto.nome,
      email: dto.email,
      tipoEmpresa: dto.tipoEmpresa,
    });

    return { empreendedor, token };
  }

  public async autenticar(dto: LoginEmpreendedorDTO): Promise<ResultadoAutenticacao> {
    const payload = {
      email: dto.email.obterValor(),
      senha: dto.senha.obterValor(),
    };

    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? 'Credenciais inválidas.');
    }

    const token = data.token as string;
    const nome = data.user?.nome ?? 'Empreendedor';
    this.persistirSessao(token, nome);

    const empreendedor = new Empreendedor({
      id: String(data.user?.id ?? 'usuario'),
      nome,
      email: dto.email,
      tipoEmpresa: TipoEmpresa.criar(data.user?.tipoEmpresa ?? 'MEI'),
    });

    return { empreendedor, token };
  }

  public async obterSessao(): Promise<Empreendedor | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        this.limparSessao();
        return null;
      }

      const user = await response.json();
      return new Empreendedor({
        id: String(user.id),
        nome: user.nome,
        email: Email.criar(user.email),
        tipoEmpresa: TipoEmpresa.criar(user.tipoEmpresa ?? 'MEI'),
      });
    } catch {
      return null;
    }
  }

  public async encerrarSessao(): Promise<void> {
    this.limparSessao();
  }

  private persistirSessao(token: string, nome: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_NAME_KEY, nome);
  }

  private limparSessao(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
  }
}
