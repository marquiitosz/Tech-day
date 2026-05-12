import { useState } from 'react'
import enviarDados from '../services/client'

function Form() {
const [nome, setNome] = useState('')
const [email, setEmail] = useState('')
const [tipo, setTipoEmpresa] = useState('')
function handleSubmit() {
  enviarDados({nome,email,tipo})
}
  return (
    <section className="flex items-center justify-center py-20 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Comece sua jornada 🚀
        </h2>

        <form className="flex flex-col gap-4">

          <input
            onChange={(e) => setNome(e.target.value)}
            type="text"
            placeholder="Seu nome"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Seu email"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select onChange={(e) => setTipoEmpresa(e.target.value)} className="p-3 border rounded-lg">
            <option>MEI — Microempreendedor Individual</option>
            <option>ME — Microempresa</option>
            <option>EPP — Empresa de Pequeno Porte</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            Enviar
          </button>

        </form>
      </div>
    </section>
  )
}

export default Form