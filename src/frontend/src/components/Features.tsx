function Features() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold text-blue-600 mb-2">
             Ideias de Negócio
          </h3>
          <p className="text-gray-600">
            Descubra ideias lucrativas para começar sem investimento alto.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold text-blue-600 mb-2">
             Crescimento
          </h3>
          <p className="text-gray-600">
            Estratégias para escalar seu negócio rapidamente.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold text-blue-600 mb-2">
              Mentalidade
          </h3>
          <p className="text-gray-600">
            Desenvolva o mindset certo para o sucesso.
          </p>
        </div>

      </div>
    </section>
  )
}

export default Features