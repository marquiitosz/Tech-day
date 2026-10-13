import { ValorMonetario } from './ValorMonetario';

export type TipoTransacao = 'ENTRADA' | 'SAIDA';
export type StatusTransacao = 'CONCLUIDO' | 'PENDENTE';

export interface TransacaoProps {
  id: string;
  data: string; // ISO ou DD/MM/AAAA
  categoria: string;
  descricao: string;
  tipo: TipoTransacao;
  valor: ValorMonetario;
  status: StatusTransacao;
}

/**
 * Entidade de Transação Financeira no domínio do EmpreendaFácil.
 */
export class Transacao {
  public readonly id: string;
  public readonly data: string;
  public readonly categoria: string;
  public readonly descricao: string;
  public readonly tipo: TipoTransacao;
  public readonly valor: ValorMonetario;
  public readonly status: StatusTransacao;

  public constructor(props: TransacaoProps) {
    if (!props.id) throw new Error('ID da transação é obrigatório.');
    if (!props.descricao.trim()) throw new Error('Descrição da transação é obrigatória.');
    if (!props.categoria.trim()) throw new Error('Categoria da transação é obrigatória.');

    this.id = props.id;
    this.data = props.data;
    this.categoria = props.categoria;
    this.descricao = props.descricao;
    this.tipo = props.tipo;
    this.valor = props.valor;
    this.status = props.status;
  }

  public ehEntrada(): boolean {
    return this.tipo === 'ENTRADA';
  }

  public ehSaida(): boolean {
    return this.tipo === 'SAIDA';
  }
}
