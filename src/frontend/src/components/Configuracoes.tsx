import { useNavigate } from 'react-router-dom'

function Configuracoes() {
  const navigate = useNavigate()

  return (
    <section className="w-full flex-1 bg-transparent px-4 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[#232046] bg-[#13122b]/80 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-blue-400">Perfil</p>
            <h1 className="text-2xl font-bold text-white">Configurações</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Voltar
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#2a2652] bg-[#0d0c1f] p-4">
            <h2 className="font-semibold text-white">Preferências da conta</h2>
            <p className="mt-1 text-sm text-slate-400">
              As opções de personalização estarão disponíveis aqui.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Configuracoes
