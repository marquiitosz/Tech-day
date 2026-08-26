import { useState } from 'react'
import {loginUser} from '../client/client.ts'
import {Navigate} from 'react-router-dom'

function LoginForm() {

const isLoggedIn = localStorage.getItem("token")
if (isLoggedIn){
    return <Navigate to="/dashboard" replace />;
}

const [email, setEmail] = useState('')
const [senha, setSenha] = useState('')

function handleSubmit() {
  return loginUser({email: email, senha: senha})
}
  return (
    <section className="flex items-center justify-center py-20 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Comece sua jornada 🚀
        </h2>

        <form className="flex flex-col gap-4">

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Seu email"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           <input
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            placeholder="Sua senha"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            onClick={(e) => {
              e.preventDefault()
              const resposta = handleSubmit()
              console.log(resposta)
              
              
            }}
           
          >
            Enviar
          </button>

        </form>
      </div>
    </section>
  )
}

export default LoginForm