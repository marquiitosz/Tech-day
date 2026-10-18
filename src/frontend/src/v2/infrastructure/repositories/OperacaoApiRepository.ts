import { Atividade } from '../../domain/operacao/Atividade';
import type { CategoriaAtividade, StatusAtividade } from '../../domain/operacao/Atividade';
import type { IOperacaoRepository } from '../../domain/operacao/IOperacaoRepository';
import { OperacaoRepository } from './OperacaoRepository';

interface AtividadeApiItem {
  id: string;
  titulo: string;
  categoria: CategoriaAtividade;
  data: string;
  horario: string;
  status: StatusAtividade;
  valorFormatado?: string | null;
}

export class OperacaoApiRepository implements IOperacaoRepository {
  private readonly fallbackRepo: OperacaoRepository;
  private readonly baseUrl: string;

  public constructor() {
    this.fallbackRepo = new OperacaoRepository();
    const envUrl = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL;
    this.baseUrl = envUrl || 'http://localhost:3001';
  }

  private obterToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  public async listarRecentes(): Promise<Atividade[]> {
    const token = this.obterToken();
    if (!token) {
      return this.fallbackRepo.listarRecentes();
    }

    try {
      const response = await fetch(`${this.baseUrl}/atividades`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return this.fallbackRepo.listarRecentes();
        }
        throw new Error(`Falha ao obter atividades (${response.status})`);
      }

      const data = (await response.json()) as AtividadeApiItem[];
      return data.map(
        (item) =>
          new Atividade({
            id: item.id,
            titulo: item.titulo,
            categoria: item.categoria,
            data: item.data,
            horario: item.horario,
            status: item.status,
            valorFormatado: item.valorFormatado ?? undefined,
          })
      );
    } catch {
      return this.fallbackRepo.listarRecentes();
    }
  }

  public async registrar(atividade: Atividade): Promise<void> {
    const token = this.obterToken();
    if (!token) {
      return this.fallbackRepo.registrar(atividade);
    }

    try {
      const response = await fetch(`${this.baseUrl}/atividades`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: atividade.id,
          titulo: atividade.titulo,
          categoria: atividade.categoria,
          data: atividade.data,
          horario: atividade.horario,
          status: atividade.status,
          valorFormatado: atividade.valorFormatado,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao registrar atividade no servidor (${response.status})`);
      }
    } catch (error) {
      await this.fallbackRepo.registrar(atividade);
      throw error;
    }
  }

  public async limparTodas(): Promise<void> {
    const token = this.obterToken();
    if (!token) {
      return this.fallbackRepo.limparTodas();
    }

    try {
      const response = await fetch(`${this.baseUrl}/atividades`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao limpar atividades no servidor (${response.status})`);
      }
    } catch (error) {
      await this.fallbackRepo.limparTodas();
      throw error;
    }
  }
}
