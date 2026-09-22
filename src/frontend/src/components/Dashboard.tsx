import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Bem-vindo de volta! Acompanhe o seu progresso e gerencie os seus resultados em tempo real.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition">
              Configurações
            </button>
            
            {/* Botão Novo Relatório */}
            <button 
              onClick={() => navigate('/relatorios')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Novo Relatório
            </button>
          </div>
        </div>

        {/* Indicadores Chave (KPIs) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Vendas Hoje</span>
            <p className="text-2xl font-bold text-white mt-1">R$ 1.280</p>
            <span className="text-xs text-emerald-400 font-medium">↑ +15% vs ontem</span>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Atendimentos</span>
            <p className="text-2xl font-bold text-white mt-1">34</p>
            <span className="text-xs text-emerald-400 font-medium">98% concluídos</span>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Horas de Estudo</span>
            <p className="text-2xl font-bold text-white mt-1">18.5h</p>
            <span className="text-xs text-indigo-400 font-medium">Meta semanal: 20h</span>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl">
            <span className="text-xs text-slate-400 font-medium">Taxa de Conclusão</span>
            <p className="text-2xl font-bold text-white mt-1">82%</p>
            <span className="text-xs text-amber-400 font-medium">↑ 5% esta semana</span>
          </div>
        </div>

        {/* Grelha de Cartões Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bloco 1: Dados do Negócio */}
          <div className="bg-slate-800/80 backdrop-blur p-6 rounded-2xl shadow-xl border-t-4 border-blue-500 flex flex-col justify-between border-x border-b border-slate-700/50">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Dados do Negócio</h2>
                <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-full font-semibold text-xs border border-blue-500/30">
                  Ativo
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                  <span className="text-slate-400">Receita Mensal:</span>
                  <span className="font-semibold text-white">€ 2.450,00</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                  <span className="text-slate-400">Novos Clientes:</span>
                  <span className="font-semibold text-white">+12 este mês</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Ticket Médio:</span>
                  <span className="font-semibold text-white">€ 204,16</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/relatorios')}
              className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              Ver Relatórios
            </button>
          </div>

          {/* Bloco 2: Atividades Recentes */}
          <div className="bg-slate-800/80 backdrop-blur p-6 rounded-2xl shadow-xl border-t-4 border-emerald-500 flex flex-col justify-between border-x border-b border-slate-700/50">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Atividades Recentes</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between text-slate-300 border-b border-slate-700/50 pb-2">
                  <span>Venda realizada (#1024)</span>
                  <span className="text-xs text-slate-500">Há 10 min</span>
                </li>
                <li className="flex items-center justify-between text-slate-300 border-b border-slate-700/50 pb-2">
                  <span>Novo cliente registado</span>
                  <span className="text-xs text-slate-500">Há 2 horas</span>
                </li>
                <li className="flex items-center justify-between text-slate-300">
                  <span>Aula concluída</span>
                  <span className="text-xs text-slate-500">Ontem</span>
                </li>
              </ul>
            </div>
            
            {/* Botão Ver Histórico configurado com a rota */}
            <button 
              onClick={() => navigate('/historico')}
              className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              Ver Histórico
            </button>
          </div>

          {/* Bloco 3: Aulas e Matérias */}
          <div className="bg-slate-800/80 backdrop-blur p-6 rounded-2xl shadow-xl border-t-4 border-amber-500 flex flex-col justify-between border-x border-b border-slate-700/50">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Aulas / Matérias</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Gestão Financeira</span>
                    <span className="text-amber-400 font-semibold">75%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Marketing Digital</span>
                    <span className="text-amber-400 font-semibold">40%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full transition-all duration-500" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/conteudos')}
              className="mt-6 w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-amber-600/20 cursor-pointer"
            >
              Continuar Aulas
            </button>
          </div>

        </div>

        {/* Próximas Tarefas */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">Próximos Passos Recomendados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div 
              onClick={() => navigate('/relatorios')}
              className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/40 hover:border-slate-600 cursor-pointer transition"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              <span className="text-slate-300">Revisar relatórios financeiros mensais</span>
            </div>
            <div 
              onClick={() => navigate('/conteudos')}
              className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/40 hover:border-slate-600 cursor-pointer transition"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-300">Concluir o módulo 3 de Marketing Digital</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;