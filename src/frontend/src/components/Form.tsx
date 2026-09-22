import { useState, type FormEvent } from 'react'
import {signUpUser} from '../client/client.ts'

function Form() {
const [nome, setNome] = useState('')
const [email, setEmail] = useState('')
const [senha, setSenha] = useState('')
const [tipo, setTipoEmpresa] = useState('')
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  await signUpUser({nome: nome,email: email, senha: senha, tipoEmpresa: tipo})
}
  return (
    <section className="flex items-center justify-center py-20 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Comece sua jornada 🚀
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          <input
            onChange={(e) => setNome(e.target.value)}
            type="text"
            placeholder="Seu nome"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
            required
            placeholder="Seu email"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           <input
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            placeholder="Sua senha"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select onChange={(e) => setTipoEmpresa(e.target.value)} className="p-3 border rounded-lg" required>
            <option value="">Selecione o tipo da empresa</option>
            <option value="Microempreendedor Individual">MEI — Microempreendedor Individual</option>
            <option value="Microempresa">ME — Microempresa</option>
            <option value="Empresa de Pequeno Porte">EPP — Empresa de Pequeno Porte</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Enviar
          </button>

        </form>
      </div>
    </section>
  )
}

export default Form