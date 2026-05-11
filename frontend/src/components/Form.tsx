function Form() {
  return (
    <section className="flex items-center justify-center py-20 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Comece sua jornada 🚀
        </h2>

        <form className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Seu nome"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Seu email"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="p-3 border rounded-lg">
            <option>MEI — Microempreendedor Individual</option>
            <option>ME — Microempresa</option>
            <option>EPP — Empresa de Pequeno Porte</option>
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