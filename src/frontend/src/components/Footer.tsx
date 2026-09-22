function Footer() {
  return (
    <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800/80 text-slate-400 py-6 text-center text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-400 font-medium">
          © {new Date().getFullYear()} <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-bold">EmpreendaFácil</span> — Todos os direitos reservados.
        </p>
        
        <div className="flex gap-6 text-xs text-slate-500">
          <a href="#" className="hover:text-slate-300 transition">Termos de Uso</a>
          <a href="#" className="hover:text-slate-300 transition">Privacidade</a>
          <a href="#" className="hover:text-slate-300 transition">Suporte</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;