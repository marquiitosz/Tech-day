import { Email, TipoEmpresa } from './ValueObjects';

export interface EmpreendedorProps {
  id: string;
  nome: string;
  email: Email;
  tipoEmpresa: TipoEmpresa;
}

/**
 * Entidade central do Empreendedor no Bounded Context de Autenticação.
 */
export class Empreendedor {
  public readonly id: string;
  public readonly nome: string;
  public readonly email: Email;
  public readonly tipoEmpresa: TipoEmpresa;

  public constructor(props: EmpreendedorProps) {
    if (!props.nome.trim()) {
      throw new Error('O nome do empreendedor é obrigatório.');
    }
    this.id = props.id;
    this.nome = props.nome.trim();
    this.email = props.email;
    this.tipoEmpresa = props.tipoEmpresa;
  }
}
