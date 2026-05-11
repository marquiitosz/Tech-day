import { useNavigate } from "react-router-dom"

function Hero() {
  const navigate = useNavigate()

  return (
    <section className="text-center py-20 bg-blue-100">
      <h2 className="text-4xl font-bold text-blue-700 mb-4">
        Comece seu negócio hoje 🚀
      </h2>

      <p className="text-gray-600 mb-6">
        Dicas, ferramentas e estratégias para você empreender do zero.
      </p>

      <button
        onClick={() => navigate("/formulario")}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
      >
        Começar agora
      </button>
    </section>
  )
}

export default Hero