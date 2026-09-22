import { useNavigate } from "react-router-dom"

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="w-full text-center py-16 px-4 bg-transparent">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
        Comece seu negócio hoje
      </h2>

      <p className="text-slate-300 text-sm md:text-base mb-6">
        Dicas, ferramentas e estratégias para você empreender do zero.
      </p>

      <button
        onClick={() => navigate("/formulario")}
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/20 active:scale-[0.99]"
      >
        Começar agora
      </button>
    </section>
  )
}

export default Hero