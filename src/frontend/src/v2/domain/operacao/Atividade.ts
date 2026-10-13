export type CategoriaAtividade = 'VENDAS' | 'CLIENTES' | 'CAPACITACAO' | 'SISTEMA';
export type StatusAtividade = 'CONCLUIDO' | 'PENDENTE' | 'CANCELADO';

export interface AtividadeProps {
  id: string;
  titulo: string;
  categoria: CategoriaAtividade;
  data: string;
  horario: string;
  status: StatusAtividade;
  valorFormatado?: string;
}

export class Atividade {
  public readonly id: string;
  public readonly titulo: string;
  public readonly categoria: CategoriaAtividade;
  public readonly data: string;
  public readonly horario: string;
  public readonly status: StatusAtividade;
  public readonly valorFormatado?: string;

  public constructor(props: AtividadeProps) {
    this.id = props.id;
    this.titulo = props.titulo;
    this.categoria = props.categoria;
    this.data = props.data;
    this.horario = props.horario;
    this.status = props.status;
    this.valorFormatado = props.valorFormatado;
  }
}
