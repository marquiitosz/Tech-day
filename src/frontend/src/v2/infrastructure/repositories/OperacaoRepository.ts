import { Atividade } from '../../domain/operacao/Atividade';
import type { CategoriaAtividade, StatusAtividade } from '../../domain/operacao/Atividade';
import type { IOperacaoRepository } from '../../domain/operacao/IOperacaoRepository';

interface AtividadeArmazenada {
  id: string;
  titulo: string;
  categoria: CategoriaAtividade;
  data: string;
  horario: string;
  status: StatusAtividade;
  valorFormatado?: string;
}

const STORAGE_KEY = 'empreendafacil_v2_atividades_reais';

export class OperacaoRepository implements IOperacaoRepository {
  public async listarRecentes(): Promise<Atividade[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as AtividadeArmazenada[];
      if (!Array.isArray(parsed)) return [];

      return parsed.map(
        (item) =>
          new Atividade({
            id: item.id,
            titulo: item.titulo,
            categoria: item.categoria,
            data: item.data,
            horario: item.horario,
            status: item.status,
            valorFormatado: item.valorFormatado,
          })
      );
    } catch {
      return [];
    }
  }

  public async registrar(atividade: Atividade): Promise<void> {
    const atuais = await this.listarRecentes();
    const novaLista = [atividade, ...atuais];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
  }

  public async limparTodas(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}
