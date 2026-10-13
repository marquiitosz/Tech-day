import { Transacao } from './Transacao';

export interface IFinanceiroRepository {
  listarTodas(): Promise<Transacao[]>;
  adicionar(transacao: Transacao): Promise<void>;
  remover(id: string): Promise<void>;
  limparTodas(): Promise<void>;
}
