import { useState } from 'react';

interface RelatorioItem {
  id: number;
  data: string;
  categoria: string;
  descricao: string;
  tipo: 'Entrada' | 'Saída';
  valor: number;
  status: 'Concluído' | 'Pendente';
}

const MOCK_RELATORIO: RelatorioItem[] = [
  { id: 1, data: '22/09/2026', categoria: 'Vendas', descricao: 'Venda de Consultoria em Marketing', tipo: 'Entrada', valor: 850.00, status: 'Concluído' },
  { id: 2, data: '21/09/2026', categoria: 'Vendas', descricao: 'Plano Assinatura Mensal - Cliente #1024', tipo: 'Entrada', valor: 430.00, status: 'Concluído' },
  { id: 3, data: '20/09/2026', categoria: 'Infraestrutura', descricao: 'Servidor e Hospedagem Cloud', tipo: 'Saída', valor: 120.00, status: 'Concluído' },
  { id: 4, data: '18/09/2026', categoria: 'Marketing', descricao: 'Campanha de Anúncios Online', tipo: 'Saída', valor: 350.00, status: 'Concluído' },
  { id: 5, data: '15/09/2026', categoria: 'Vendas', descricao: 'Prestação de Serviços - Projeto Beta', tipo: 'Entrada', valor: 1170.00, status: 'Concluído' },
  { id: 6, data: '10/09/2026', categoria: 'Ferramentas', descricao: 'Licença de Software de Gestão', tipo: 'Saída', valor: 99.00, status: 'Pendente' },
];

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('Este Mês');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  const itensFiltrados = MOCK_RELATORIO.filter((item) => {
    if (filtroTipo === 'Entrada') return item.tipo === 'Entrada';
    if (filtroTipo === 'Saída') return item.tipo === 'Saída';
    return true;
  });

  const totalEntradas = MOCK_RELATORIO.filter(i => i.tipo === 'Entrada').reduce((acc, curr) => acc + curr.valor, 0);
  const totalSaidas = MOCK_RELATORIO.filter(i => i.tipo === 'Saída').reduce((acc, curr) => acc + curr.valor, 0);
  const saldoLiquido = totalEntradas - totalSaidas;

  return (
    <div className="min-h-screen text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Gestão Financeira & Desempenho
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
              Relatórios Consolidados
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Acompanhe o fluxo financeiro detalhado e métricas do seu negócio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert('Exportando relatório em PDF...')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold rounded-lg transition"
            >
              Exportar PDF
            </button>
            <button 
              onClick={() => alert('Baixando dados em CSV...')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-600/20 transition"
            >
              Baixar CSV
            </button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Entradas</span>
            <p className="text-3xl font-bold text-emerald-400 mt-2">
              R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-xs text-emerald-500/80 mt-2 block">+15% em relação ao mês anterior</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Saídas</span>
            <p className="text-3xl font-bold text-rose-400 mt-2">
              R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-xs text-slate-500 mt-2 block">Custos e despesas operacionais</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo Líquido</span>
            <p className={`text-3xl font-bold mt-2 ${saldoLiquido >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
              R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-xs text-slate-400 mt-2 block">Margem de Lucro: ~77%</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {['Todos', 'Entrada', 'Saída'].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                  filtroTipo === tipo
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tipo}s
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Período:</span>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-slate-900 border border-slate-700/60 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="Este Mês">Este Mês</option>
              <option value="Mês Passado">Mês Passado</option>
              <option value="Último Trimestre">Último Trimestre</option>
              <option value="Ano Atual">Ano Atual</option>
            </select>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs uppercase text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="py-3.5 px-6">Data</th>
                  <th className="py-3.5 px-6">Descrição</th>
                  <th className="py-3.5 px-6">Categoria</th>
                  <th className="py-3.5 px-6">Tipo</th>
                  <th className="py-3.5 px-6 text-right">Valor</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {itensFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6 text-slate-400 whitespace-nowrap">{item.data}</td>
                    <td className="py-4 px-6 font-medium text-white">{item.descricao}</td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-xs border border-slate-700/50">
                        {item.categoria}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                        item.tipo === 'Entrada' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.tipo}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-right font-semibold whitespace-nowrap ${
                      item.tipo === 'Entrada' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {item.tipo === 'Entrada' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'Concluído' ? 'bg-slate-800 text-slate-300' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}