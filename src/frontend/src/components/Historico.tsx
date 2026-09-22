import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Atividade {
  id: string;
  titulo: string;
  categoria: 'Vendas' | 'Clientes' | 'Aulas' | 'Sistema';
  data: string;
  horario: string;
  status: 'Concluído' | 'Pendente' | 'Cancelado';
  valor?: string;
}

const dadosHistorico: Atividade[] = [
  { id: '#1024', titulo: 'Venda realizada para João Silva', categoria: 'Vendas', data: '22/09/2026', horario: '19:35', status: 'Concluído', valor: 'R$ 250,00' },
  { id: '#1023', titulo: 'Novo cliente cadastrado: Maria Oliveira', categoria: 'Clientes', data: '22/09/2026', horario: '17:40', status: 'Concluído' },
  { id: '#1022', titulo: 'Aula concluída: Gestão Financeira - Módulo 2', categoria: 'Aulas', data: '21/09/2026', horario: '20:15', status: 'Concluído' },
  { id: '#1021', titulo: 'Venda realizada para Ana Costa', categoria: 'Vendas', data: '21/09/2026', horario: '15:20', status: 'Concluído', valor: 'R$ 480,00' },
  { id: '#1020', titulo: 'Tentativa de pagamento recusada', categoria: 'Vendas', data: '20/09/2026', horario: '11:05', status: 'Cancelado', valor: 'R$ 150,00' },
  { id: '#1019', titulo: 'Atualização de perfil efetuada', categoria: 'Sistema', data: '19/09/2026', horario: '09:30', status: 'Concluído' },
  { id: '#1018', titulo: 'Aula iniciada: Marketing Digital - Módulo 3', categoria: 'Aulas', data: '18/09/2026', horario: '18:00', status: 'Pendente' },
];

function Historico() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');

  // Filtragem de dados
  const atividadesFiltradas = dadosHistorico.filter((item) => {
    const bateCategoria = categoriaFiltro === 'Todas' || item.categoria === categoriaFiltro;
    const bateBusca = item.titulo.toLowerCase().includes(busca.toLowerCase()) || item.id.toLowerCase().includes(busca.toLowerCase());
    return bateCategoria && bateBusca;
  });

  return (
    <div className="w-full min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition border border-slate-700 text-sm flex items-center gap-1 cursor-pointer"
              >
                ← Voltar
              </button>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Histórico de Atividades</h1>
            </div>
            <p className="text-slate-400 mt-2">
              Consulte todas as ações, vendas e registos recentes no seu sistema.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-emerald-600/20 cursor-pointer">
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-800/50 backdrop-blur p-4 rounded-xl border border-slate-700/60">
          {/* Input de Busca */}
          <input
            type="text"
            placeholder="Buscar por título ou ID..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />

          {/* Filtro por Categoria */}
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['Todas', 'Vendas', 'Clientes', 'Aulas', 'Sistema'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                  categoriaFiltro === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Histórico */}
        <div className="bg-slate-800/80 backdrop-blur rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-xs text-slate-400 uppercase border-b border-slate-700/60">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Atividade</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Data / Hora</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {atividadesFiltradas.length > 0 ? (
                  atividadesFiltradas.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4 font-mono text-slate-400 font-medium">{item.id}</td>
                      <td className="px-6 py-4 font-semibold text-white">{item.titulo}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-700/60 border border-slate-600 text-slate-300 rounded-md text-xs font-medium">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {item.data} às {item.horario}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {item.valor || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-semibold text-xs border ${
                            item.status === 'Concluído'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : item.status === 'Pendente'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      Nenhuma atividade encontrada com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Historico;