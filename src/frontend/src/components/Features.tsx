function Features() {
  return (
    <section className="w-full bg-transparent flex-1 pb-20 px-4 flex justify-center items-start">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        
        {/* Card 1 */}
        <div className="group bg-[#13122b]/80 backdrop-blur-sm p-8 rounded-2xl border border-[#232046] shadow-xl hover:border-blue-500/50 hover:bg-[#181636] hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 mb-5 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            01
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
            Ideias de Negócio
          </h3>
          <p className="text-slate-400 text-base leading-relaxed">
            Descubra ideias lucrativas para começar sem investimento alto.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group bg-[#13122b]/80 backdrop-blur-sm p-8 rounded-2xl border border-[#232046] shadow-xl hover:border-blue-500/50 hover:bg-[#181636] hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 mb-5 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            02
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
            Crescimento
          </h3>
          <p className="text-slate-400 text-base leading-relaxed">
            Estratégias para escalar seu negócio rapidamente.
          </p>
        </div>

        {/* Card 3 */}
        <div className="group bg-[#13122b]/80 backdrop-blur-sm p-8 rounded-2xl border border-[#232046] shadow-xl hover:border-blue-500/50 hover:bg-[#181636] hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 mb-5 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            03
          </div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
            Mentalidade
          </h3>
          <p className="text-slate-400 text-base leading-relaxed">
            Desenvolva o mindset certo para o sucesso.
          </p>
        </div>

      </div>
    </section>
  )
}

export default Features