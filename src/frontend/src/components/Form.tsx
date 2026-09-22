import { useState } from 'react'
import { signUpUser } from '../client/client.ts'
import { useNavigate } from 'react-router-dom'

function Form() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [tipo, setTipoEmpresa] = useState('Microempreendedor Individual')
  const navigate = useNavigate()

  async function handleSubmit() {
    await signUpUser({ nome, email, senha, tipoEmpresa: tipo })
    navigate('/dashboard')
  }

  return (
    <div className="w-full flex-1 bg-transparent text-slate-100 flex items-center justify-center py-12 px-4">
      {/* Container do formulário com fundo translúcido e efeito blur */}
      <div className="bg-[#13122b]/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#232046] w-full max-w-md">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Comece sua jornada
        </h2>

        <form className="flex flex-col gap-4" onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit()
        }}>

          <input
            onChange={(e) => setNome(e.target.value)}
            type="text"
            placeholder="Seu nome"
            className="p-3 bg-[#0d0c1f] border border-[#2a2652] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Seu email"
            className="p-3 bg-[#0d0c1f] border border-[#2a2652] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />

          <input
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            placeholder="Sua senha"
            className="p-3 bg-[#0d0c1f] border border-[#2a2652] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />

          <select 
            onChange={(e) => setTipoEmpresa(e.target.value)} 
            className="p-3 bg-[#0d0c1f] border border-[#2a2652] rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
          >
            <option value="Microempreendedor Individual" className="bg-[#13122b] text-white">MEI — Microempreendedor Individual</option>
            <option value="Microempresa" className="bg-[#13122b] text-white">ME — Microempresa</option>
            <option value="Empresa de Pequeno Porte" className="bg-[#13122b] text-white">EPP — Empresa de Pequeno Porte</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-600/20 active:scale-[0.99]"
          >
            Enviar
          </button>

        </form>
      </div>
    </div>
  )
}

export default Form