import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName] = useState(localStorage.getItem('userName') ?? 'Perfil');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsProfileOpen(false);
    navigate('/');
    window.location.reload();
  }

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-white p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        
        {/* Logo / Título */}
        <h1 
          onClick={() => navigate('/')} 
          className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent cursor-pointer tracking-tight"
        >
          EmpreendaFácil
        </h1>

        {/* Links de Navegação */}
        <ul className="flex items-center gap-2 md:gap-4 text-sm font-medium">
          {!isLoggedIn && (
            <>
              <li>
                <button onClick={() => navigate('/')} className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/formulario')} className="px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition">
                  Cadastro
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md shadow-indigo-600/20 font-semibold transition">
                  Login
                </button>
              </li>
            </>
          )}
          <li>
            <button onClick={() => navigate('/sobre')} className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition">
              Sobre
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/conteudos')} className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition">
              Conteúdos
            </button>
          </li>
          {isLoggedIn && (
            <li className="relative">
              <button
                type="button"
                aria-label="Abrir menu do perfil"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 text-slate-200 hover:border-blue-400 hover:text-white transition"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="3.25" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 19.25c.8-3.05 3.1-4.75 6.5-4.75s5.7 1.7 6.5 4.75" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-xl">
                  <p className="border-b border-slate-700 px-3 pb-2 text-sm font-semibold text-white">
                    {userName}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false)
                      navigate('/configuracoes')
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 transition"
                  >
                    Configurações
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-red-950/40 transition"
                  >
                    Sair
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;