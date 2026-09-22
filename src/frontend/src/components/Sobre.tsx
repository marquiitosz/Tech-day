function Sobre() {
  return (
    <div className="w-full flex-1 bg-transparent text-slate-100 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        
        {/* Cabeçalho */}
        <section className="text-center flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Sobre o <span className="text-blue-500">EmpreendaFácil</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-3xl">
            No cenário dinâmico do mercado atual, a inovação e a resiliência são as chaves para o sucesso. 
            O <strong className="text-white">EmpreendaFácil</strong> nasce com o propósito firme de ser o parceiro estratégico 
            de quem deseja navegar pelo ecossistema empreendedor com segurança e alta performance.
          </p>
        </section>

        {/* Bloco de Destaque */}
        <div className="bg-[#13122b]/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-[#232046] shadow-xl text-slate-300 text-base md:text-lg leading-relaxed">
          Com foco em gestão, marketing digital, inovação ou vendas, combinamos visão de mercado e aplicação prática 
          para entregar conteúdos e soluções que geram resultados reais.
        </div>

        {/* Cartões Dinâmicos: O que nos move */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            O que nos move
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Cartão 1 */}
            <div className="group bg-[#13122b]/80 backdrop-blur-sm p-6 rounded-2xl border border-[#232046] shadow-xl hover:border-blue-500/50 hover:bg-[#181636] hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 mb-4 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 font-bold">
                In
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Inovação
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Buscar constantemente novas formas de resolver velhos problemas.
              </p>
            </div>

            {/* Cartão 2 */}
            <div className="group bg-[#13122b]/80 backdrop-blur-sm p-6 rounded-2xl border border-[#232046] shadow-xl hover:border-blue-500/50 hover:bg-[#181636] hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 mb-4 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 font-bold">
                Tr
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Transparência
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Compartilhar estratégias reais, sem fórmulas mágicas.
              </p>
            </div>

            {/* Cartão 3 */}
            <div className="group bg-[#13122b]/80 backdrop-blur-sm p-6 rounded-2xl border border-[#232046] shadow-xl hover:border-blue-500/50 hover:bg-[#181636] hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 mb-4 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 font-bold">
                Im
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Impacto
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Focar em resultados que transformem a trajetória dos nossos clientes e leitores.
              </p>
            </div>

          </div>
        </section>

        {/* Parágrafo Final */}
        <section className="bg-gradient-to-r from-blue-900/30 to-[#13122b]/80 p-6 md:p-8 rounded-2xl border border-blue-500/20 text-center">
          <p className="text-slate-200 text-base md:text-lg leading-relaxed">
            Acreditamos que o empreendedorismo é o maior motor de desenvolvimento econômico e social. 
            Por isso, preparamos este espaço para ser o seu <span className="text-blue-400 font-semibold">ponto de partida</span> — ou de aceleração — rumo ao próximo nível.
          </p>
        </section>

      </div>
    </div>
  )
}

export default Sobre