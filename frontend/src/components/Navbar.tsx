function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">EmpreendaFácil</h1>
        <ul className="flex gap-6">
          <li className="hover:text-blue-200 cursor-pointer">Início</li>
          <li className="hover:text-blue-200 cursor-pointer">Sobre</li>
          <li className="hover:text-blue-200 cursor-pointer">Contato</li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar