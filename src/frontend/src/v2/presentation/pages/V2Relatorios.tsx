import React, { useState, useEffect } from 'react';
import '../styles/design-system-v2.css';
import { FinanceiroRepository } from '../../infrastructure/repositories/FinanceiroRepository';
import { GerarRelatorioUseCase } from '../../application/financeiro/GerarRelatorioUseCase';
import { ExportarCsvFinanceiroUseCase } from '../../application/financeiro/ExportarCsvFinanceiroUseCase';
import { Transacao } from '../../domain/financeiro/Transacao';
import type { TipoTransacao, StatusTransacao } from '../../domain/financeiro/Transacao';
import { ValorMonetario } from '../../domain/financeiro/ValorMonetario';
import { RelatorioConsolidado } from '../../domain/financeiro/RelatorioConsolidado';
import { UiButton } from '../components/UiButton';
import { UiInput } from '../components/UiInput';
import { UiSelect } from '../components/UiSelect';
import { UiBadge } from '../components/UiBadge';
import { UiEmptyState } from '../components/UiEmptyState';
import { UiModal } from '../components/UiModal';

const financeiroRepo = new FinanceiroRepository();
const gerarRelatorioUseCase = new GerarRelatorioUseCase(financeiroRepo);
const exportarCsvUseCase = new ExportarCsvFinanceiroUseCase();

export const V2Relatorios: React.FC = () => {
  const [relatorio, setRelatorio] = useState<RelatorioConsolidado | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [busca, setBusca] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Campos do formulário de nova transação
  const [novaDescricao, setNovaDescricao] = useState<string>('');
  const [novaCategoria, setNovaCategoria] = useState<string>('Vendas');
  const [novoValor, setNovoValor] = useState<string>('');
  const [novoTipo, setNovoTipo] = useState<TipoTransacao>('ENTRADA');
  const [novoStatus, setNovoStatus] = useState<StatusTransacao>('CONCLUIDO');
  const [erroForm, setErroForm] = useState<string>('');

  const recarregarRelatorio = async () => {
    const dados = await gerarRelatorioUseCase.executar();
    setRelatorio(dados);
  };

  useEffect(() => {
    let isMounted = true;
    void gerarRelatorioUseCase.executar().then((dados) => {
      if (isMounted) {
        setRelatorio(dados);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExportarCsv = () => {
    if (!relatorio) return;
    try {
      exportarCsvUseCase.executar(relatorio.obterTransacoes());
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSalvarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroForm('');

    if (!novaDescricao.trim()) {
      setErroForm('Informe a descrição do lançamento.');
      return;
    }

    const converterValorBrasileiro = (input: string): number => {
      const limpo = input.trim();
      if (!limpo) return NaN;

      if (limpo.includes(',')) {
        const partesVirgula = limpo.split(',');
        if (partesVirgula.length !== 2) return NaN;
        const [inteiraComPontos, decimais] = partesVirgula;
        if (!/^\d{1,2}$/.test(decimais)) return NaN;
        const inteira = inteiraComPontos.replace(/\./g, '');
        if (!/^\d+$/.test(inteira)) return NaN;
        return parseFloat(`${inteira}.${decimais}`);
      }

      if (/^\d+(\.\d{1,2})?$/.test(limpo)) {
        return parseFloat(limpo);
      }

      if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) {
        return parseFloat(limpo.replace(/\./g, ''));
      }

      return NaN;
    };

    const valorNum = converterValorBrasileiro(novoValor);
    if (isNaN(valorNum) || valorNum <= 0) {
      setErroForm('Informe um valor monetário positivo válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataAtual = new Date().toLocaleDateString('pt-BR');
      const nova = new Transacao({
        id: `tx_${Date.now()}`,
        data: dataAtual,
        categoria: novaCategoria,
        descricao: novaDescricao.trim(),
        tipo: novoTipo,
        valor: ValorMonetario.deReais(valorNum),
        status: novoStatus,
      });

      await financeiroRepo.adicionar(nova);
      await recarregarRelatorio();
      setIsModalOpen(false);
      setNovaDescricao('');
      setNovoValor('');
    } catch (err) {
      setErroForm((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExcluirTransacao = async (id: string) => {
    await financeiroRepo.remover(id);
    await recarregarRelatorio();
  };

  const transacoesFiltradas = relatorio
    ? relatorio
        .buscarPorTermo(busca)
        .filter((t) => (filtroTipo === 'TODOS' ? true : t.tipo === filtroTipo))
    : [];

  const totalEntradas = relatorio ? relatorio.totalEntradas() : ValorMonetario.zero();
  const totalEntradasPendentes = relatorio ? relatorio.totalEntradasPendentes() : ValorMonetario.zero();
  const totalSaidas = relatorio ? relatorio.totalSaidas() : ValorMonetario.zero();
  const totalSaidasPendentes = relatorio ? relatorio.totalSaidasPendentes() : ValorMonetario.zero();
  const saldoLiquido = relatorio ? relatorio.saldoLiquido() : ValorMonetario.zero();

  return (
    <div className="ui-page-container">
      <div className="ui-content-wrapper">
        {/* Cabeçalho */}
        <header className="ui-page-header">
          <div>
            <span className="ui-tagline">Módulo Financeiro V2 • Clean Architecture</span>
            <h1 className="ui-title">Relatórios & Fluxo de Caixa</h1>
            <p className="ui-subtitle">
              Gestão de entradas, saídas e resultados consolidados do seu negócio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <UiButton
              variant="secondary"
              onClick={handleExportarCsv}
              disabled={!relatorio || relatorio.estaVazio()}
            >
              Exportar CSV Real
            </UiButton>
            <UiButton variant="primary" onClick={() => setIsModalOpen(true)}>
              + Novo Lançamento
            </UiButton>
          </div>
        </header>

        {/* Cards de Métricas Consolidadas */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="ui-metric-card border-emerald-500/30">
            <span className="ui-metric-title">Total de Entradas</span>
            <p className="ui-metric-value text-emerald-400">
              {totalEntradas.formatar()}
            </p>
            <span className="ui-metric-badge text-emerald-400">
              {totalEntradasPendentes.emReais() > 0
                ? `+ ${totalEntradasPendentes.formatar()} a receber`
                : 'Receitas realizadas'}
            </span>
          </div>

          <div className="ui-metric-card border-rose-500/30">
            <span className="ui-metric-title">Total de Saídas</span>
            <p className="ui-metric-value text-rose-400">
              {totalSaidas.formatar()}
            </p>
            <span className="ui-metric-badge text-rose-400">
              {totalSaidasPendentes.emReais() > 0
                ? `+ ${totalSaidasPendentes.formatar()} a pagar`
                : 'Custos realizados'}
            </span>
          </div>

          <div
            className={`ui-metric-card ${
              saldoLiquido.ehNegativo() ? 'border-rose-500/40' : 'border-indigo-500/30'
            }`}
          >
            <span className="ui-metric-title">Saldo Líquido</span>
            <p
              className={`ui-metric-value ${
                saldoLiquido.ehNegativo() ? 'text-rose-400' : 'text-indigo-300'
              }`}
            >
              {saldoLiquido.formatar()}
            </p>
            <span className="ui-metric-badge text-slate-400">
              {saldoLiquido.ehNegativo() ? 'Atenção ao déficit' : 'Superávit em caixa'}
            </span>
          </div>
        </section>

        {/* Barra de Filtros e Busca */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <UiInput
              placeholder="Buscar por descrição ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar transações"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Tipo:</span>
            <div className="flex gap-1.5">
              {(['TODOS', 'ENTRADA', 'SAIDA'] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setFiltroTipo(tipo)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    filtroTipo === tipo
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
                  }`}
                >
                  {tipo === 'TODOS' ? 'Todos' : tipo === 'ENTRADA' ? 'Entradas' : 'Saídas'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tabela de Lançamentos ou Estado Vazio */}
        {transacoesFiltradas.length === 0 ? (
          <UiEmptyState
            title="Nenhum lançamento financeiro registrado"
            description="Os dados fictícios foram removidos. Comece a gerenciar suas contas cadastrando seu primeiro lançamento financeiro."
            actionText="+ Criar Primeiro Lançamento"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="ui-table-container">
            <table className="ui-table" aria-label="Tabela de transações financeiras">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th className="text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {transacoesFiltradas.map((t) => (
                  <tr key={t.id}>
                    <td className="font-mono text-xs text-slate-400">{t.data}</td>
                    <td className="font-semibold text-white">{t.descricao}</td>
                    <td>
                      <span className="text-xs text-slate-300 bg-slate-800/70 px-2 py-0.5 rounded border border-slate-700/60">
                        {t.categoria}
                      </span>
                    </td>
                    <td>
                      <UiBadge variant={t.ehEntrada() ? 'success' : 'danger'}>
                        {t.ehEntrada() ? 'Entrada' : 'Saída'}
                      </UiBadge>
                    </td>
                    <td
                      className={`font-bold ${
                        t.ehEntrada() ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {t.ehEntrada() ? '+ ' : '- '}
                      {t.valor.formatar()}
                    </td>
                    <td>
                      <UiBadge variant={t.status === 'CONCLUIDO' ? 'success' : 'warning'}>
                        {t.status === 'CONCLUIDO' ? 'Concluído' : 'Pendente'}
                      </UiBadge>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => void handleExcluirTransacao(t.id)}
                        className="text-slate-400 hover:text-rose-400 text-xs px-2 py-1 rounded transition"
                        title="Remover transação"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Criação de Transação */}
        <UiModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Novo Lançamento Financeiro"
        >
          <form className="flex flex-col gap-4" onSubmit={handleSalvarTransacao}>
            {erroForm && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                {erroForm}
              </div>
            )}

            <UiInput
              label="Descrição"
              placeholder="Ex: Venda de Consultoria, Pagamento Fornecedor"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <UiInput
                label="Valor (R$)"
                placeholder="Ex: 250,00"
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
                required
              />

              <UiSelect
                label="Categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
              >
                <option value="Vendas" className="bg-[#121029]">Vendas</option>
                <option value="Serviços" className="bg-[#121029]">Serviços</option>
                <option value="Marketing" className="bg-[#121029]">Marketing</option>
                <option value="Infraestrutura" className="bg-[#121029]">Infraestrutura</option>
                <option value="Ferramentas" className="bg-[#121029]">Ferramentas</option>
                <option value="Outros" className="bg-[#121029]">Outros</option>
              </UiSelect>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <UiSelect
                label="Tipo"
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value as TipoTransacao)}
              >
                <option value="ENTRADA" className="bg-[#121029]">Entrada (Receita)</option>
                <option value="SAIDA" className="bg-[#121029]">Saída (Despesa)</option>
              </UiSelect>

              <UiSelect
                label="Status"
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value as StatusTransacao)}
              >
                <option value="CONCLUIDO" className="bg-[#121029]">Concluído</option>
                <option value="PENDENTE" className="bg-[#121029]">Pendente</option>
              </UiSelect>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <UiButton
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </UiButton>
              <UiButton type="submit" variant="primary" isLoading={isSubmitting}>
                Salvar Lançamento
              </UiButton>
            </div>
          </form>
        </UiModal>
      </div>
    </div>
  );
};
