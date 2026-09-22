import { useState } from 'react'
import {loginUser} from '../client/client.ts'
import {Navigate} from 'react-router-dom'
import BrandMark from './BrandMark'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const isLoggedIn = localStorage.getItem('token')

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit() {
    await loginUser({ email, senha })
  }
  return (
    <section className="w-full flex-1 bg-transparent text-slate-100 flex items-center justify-center py-12 px-4">
      <div className="bg-[#13122b]/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#232046] w-full max-w-md">
        <div className="mb-5 flex justify-center">
          <BrandMark compact />
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Comece sua jornada
        </h2>

        <form className="flex flex-col gap-4" onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit()
        }}>

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

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-600/20 active:scale-[0.99]"
          >
            Enviar
          </button>

        </form>
      </div>
    </section>
  )
}

export default LoginForm