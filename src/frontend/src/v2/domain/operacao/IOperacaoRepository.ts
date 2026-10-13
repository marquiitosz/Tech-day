import { Atividade } from './Atividade';

export interface IOperacaoRepository {
  listarRecentes(): Promise<Atividade[]>;
  registrar(atividade: Atividade): Promise<void>;
  limparTodas(): Promise<void>;
}
