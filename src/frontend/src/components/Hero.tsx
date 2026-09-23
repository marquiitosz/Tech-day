import { useNavigate } from "react-router-dom"
import BrandMark from './BrandMark'

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="w-full px-4 py-10 md:py-16">
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 overflow-hidden rounded-3xl border border-blue-400/20 bg-[#050b1b] px-6 py-10 shadow-2xl shadow-blue-950/30 md:flex-row md:justify-between md:px-14 md:py-12">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">EmpreendaFácil</p>
          <h2 className="mb-3 text-3xl font-bold text-white md:text-5xl">
            Cresça com direção.
          </h2>
          <p className="mb-6 text-sm leading-6 text-slate-300 md:text-base">
            Dicas, ferramentas e estratégias para transformar sua próxima ideia em negócio.
          </p>
          <button
            onClick={() => navigate("/formulario")}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[0.99]"
          >
            Começar agora
          </button>
        </div>
        <div className="relative z-10 shrink-0 md:-mr-4">
          <BrandMark variant="hero" framed={false} />
        </div>
      </div>
    </section>
  )
}

export default Hero