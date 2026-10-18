export type user = {
    id: string
    nome: string
    email: string
    senha: string
    tipoEmpresa: string
}

export type userPayload = Pick<user, "nome" | "email" |"senha" | "tipoEmpresa">
export type loginPayload = Pick<user, "email" | "senha">

export type TipoTransacao = 'ENTRADA' | 'SAIDA';
export type StatusTransacao = 'CONCLUIDO' | 'PENDENTE';

export interface TransacaoDTO {
  id: string;
  usuarioId: string;
  descricao: string;
  categoria: string;
  tipo: TipoTransacao;
  valorCentavos: number;
  status: StatusTransacao;
  data: string;
  createdAt?: string;
  updatedAt?: string;
}