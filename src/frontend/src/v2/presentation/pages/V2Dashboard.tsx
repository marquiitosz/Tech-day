import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/design-system-v2.css';
import { FinanceiroRepository } from '../../infrastructure/repositories/FinanceiroRepository';
import { GerarRelatorioUseCase } from '../../application/financeiro/GerarRelatorioUseCase';
import { RelatorioConsolidado } from '../../domain/financeiro/RelatorioConsolidado';
import { ValorMonetario } from '../../domain/financeiro/ValorMonetario';
import { UiButton } from '../components/UiButton';
import { UiCard } from '../components/UiCard';
import { UiBadge } from '../components/UiBadge';

const financeiroRepo = new FinanceiroRepository();
const gerarRelatorioUseCase = new GerarRelatorioUseCase(financeiroRepo);

export const V2Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [relatorio, setRelatorio] = useState<RelatorioConsolidado | null>(null);
  const [nomeUsuario] = useState<string>(() => localStorage.getItem('userName') || 'Empreendedor');

  useEffect(() => {
    void gerarRelatorioUseCase.executar().then((res) => setRelatorio(res));
  }, []);

  const totalEntradas = relatorio ? relatorio.totalEntradas() : ValorMonetario.zero();
  const totalEntradasPendentes = relatorio ? relatorio.totalEntradasPendentes() : ValorMonetario.zero();
  const totalSaidas = relatorio ? relatorio.totalSaidas() : ValorMonetario.zero();
  const saldoLiquido = relatorio ? relatorio.saldoLiquido() : ValorMonetario.zero();
  const qtdTransacoes = relatorio ? relatorio.obterTransacoes().length : 0;

  return (
    <div className="ui-page-container">
      <div className="ui-content-wrapper">
        {/* Cabeçalho */}
        <header className="ui-page-header">
          <div>
            <span className="ui-tagline">Visão Geral do Negócio • V2</span>
            <h1 className="ui-title">Painel de Controle</h1>
            <p className="ui-subtitle">
              Olá, <strong className="text-white">{nomeUsuario}</strong>! Acompanhe o desempenho do seu negócio em tempo real.
            </p>
          </div>

          <div className="flex gap-3">
            <UiButton
              variant="secondary"
              onClick={() => navigate('/relatorios')}
            >
              Versão Clássica
            </UiButton>
            <UiButton
              variant="primary"
              onClick={() => navigate('/relatorios')}
            >
              Gerenciar Finanças V2
            </UiButton>
          </div>
        </header>

        {/* Indicadores Chave de Desempenho (KPIs) Padronizados em BRL */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="ui-metric-card border-indigo-500/30">
            <span className="ui-metric-title">Saldo Consolidado</span>
            <p className="ui-metric-value text-indigo-300">
              {saldoLiquido.formatar()}
            </p>
            <span className="ui-metric-badge text-slate-400">
              {qtdTransacoes > 0 ? `${qtdTransacoes} lançamentos registrados` : 'Aguardando lançamentos'}
            </span>
          </div>

          <div className="ui-metric-card border-emerald-500/30">
            <span className="ui-metric-title">Receitas Realizadas</span>
            <p className="ui-metric-value text-emerald-400">
              {totalEntradas.formatar()}
            </p>
            <span className="ui-metric-badge text-emerald-400">
              {totalEntradasPendentes.emReais() > 0
                ? `+ ${totalEntradasPendentes.formatar()} a receber`
                : 'Entradas apuradas'}
            </span>
          </div>

          <div className="ui-metric-card border-rose-500/30">
            <span className="ui-metric-title">Custos e Despesas</span>
            <p className="ui-metric-value text-rose-400">
              {totalSaidas.formatar()}
            </p>
            <span className="ui-metric-badge text-rose-400">Saídas apuradas</span>
          </div>

          <div className="ui-metric-card border-amber-500/30">
            <span className="ui-metric-title">Operações Ativas</span>
            <p className="ui-metric-value text-amber-300">
              {qtdTransacoes}
            </p>
            <span className="ui-metric-badge text-amber-400">Registros em caixa</span>
          </div>
        </section>

        {/* Seção Principal: Blocos Estratégicos */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Gestão Financeira V2 */}
          <UiCard
            title="Fluxo Financeiro"
            badge={<UiBadge variant="success">Ativo</UiBadge>}
          >
            <p className="text-sm text-slate-300 mb-4">
              Tenha controle total de despesas, receitas e exporte dados para a contabilidade com um clique.
            </p>
            <div className="space-y-3 border-t border-slate-700/60 pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Entradas:</span>
                <span className="font-semibold text-emerald-400">{totalEntradas.formatar()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Saídas:</span>
                <span className="font-semibold text-rose-400">{totalSaidas.formatar()}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Resultado:</span>
                <span className={saldoLiquido.ehNegativo() ? 'text-rose-400' : 'text-indigo-300'}>
                  {saldoLiquido.formatar()}
                </span>
              </div>
            </div>
            <UiButton
              variant="primary"
              className="w-full mt-5"
              onClick={() => navigate('/relatorios')}
            >
              Acessar Módulo Financeiro
            </UiButton>
          </UiCard>

          {/* Card 2: Consultoria com a Verity IA */}
          <UiCard
            title="Assistente Verity IA"
            badge={<UiBadge variant="info">Online</UiBadge>}
          >
            <p className="text-sm text-slate-300 mb-4">
              Tire dúvidas sobre enquadramento tributário (MEI/ME), cálculos de margem de lucro e estratégias de vendas.
            </p>
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/25 rounded-xl text-xs text-indigo-200">
              💡 <em>Dica:</em> Abra a assistente no canto inferior direito para validar hipóteses de mercado antes de investir.
            </div>
            <div className="mt-5 text-xs text-slate-400">
              Disponível em todas as telas com motor do Google Gemini.
            </div>
          </UiCard>

          {/* Card 3: Capacitação do Empreendedor */}
          <UiCard
            title="Trilhas de Estudo"
            badge={<UiBadge variant="warning">Prático</UiBadge>}
          >
            <p className="text-sm text-slate-300 mb-4">
              Aprenda a estruturar seu negócio com conteúdos objetivos focados em resultados práticos.
            </p>
            <ul className="text-xs space-y-2 text-slate-300 border-t border-slate-700/60 pt-3">
              <li>✓ Fluxo de Caixa Descomplicado</li>
              <li>✓ Como Formar o Preço de Venda</li>
              <li>✓ Estratégias de Marketing Digital</li>
            </ul>
            <UiButton
              variant="secondary"
              className="w-full mt-5"
              onClick={() => navigate('/conteudos')}
            >
              Ver Conteúdos Educativos
            </UiButton>
          </UiCard>
        </section>
      </div>
    </div>
  );
};
