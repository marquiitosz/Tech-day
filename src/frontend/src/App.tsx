import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Features from "./components/Features"
import Footer from "./components/Footer"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Sobre from "./components/Sobre"
import Conteudos from "./components/Conteudos"
import Historico from "./components/Historico" 
import { ChatbotWidget } from "./chatbot/ChatbotWidget"
import { V2Dashboard, V2Relatorios, V2Cadastro, V2Login, V2Configuracoes } from "./v2/presentation/pages"

function Home() {
  return (
    <>
      <Hero />
      <Features />
    </>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const tokenInicial = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [autenticado, setAutenticado] = useState<boolean | null>(() => (tokenInicial ? null : false));

  useEffect(() => {
    if (!tokenInicial) {
      return;
    }

    let ativo = true;
    const apiUrl = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/me`, {
      headers: { Authorization: `Bearer ${tokenInicial}` },
    })
      .then((res) => {
        if (!ativo) return;
        if (!res.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          setAutenticado(false);
        } else {
          setAutenticado(true);
        }
      })
      .catch(() => {
        if (!ativo) return;
        // Se a API estiver offline temporariamente mas houver token, permite continuar
        setAutenticado(true);
      });

    return () => {
      ativo = false;
    };
  }, [tokenInicial]);

  if (autenticado === null) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
      <span className="text-6xl font-extrabold text-indigo-400">404</span>
      <h1 className="text-2xl font-bold text-white mt-2">Página não encontrada</h1>
      <p className="text-sm text-slate-400 mt-2 max-w-md">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <a
        href="/dashboard"
        className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30"
      >
        Voltar para o Início
      </a>
    </div>
  );
}

function App() {
  const isLoggedIn = Boolean(localStorage.getItem('token'))

  return (
    <BrowserRouter>
      <div 
        className="min-h-screen text-slate-100 flex flex-col"
        style={{
          background: 'radial-gradient(ellipse at top, #1c183b 0%, #0d0c1d 60%, #080711 100%)'
        }}
      >
        <Navbar />

        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Home />} />
            <Route path="/formulario" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <V2Cadastro />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/conteudos" element={<Conteudos />} />
            <Route path="/relatorios" element={<ProtectedRoute><V2Relatorios /></ProtectedRoute>} />
            <Route path="/historico" element={<ProtectedRoute><Historico /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute><V2Configuracoes /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><V2Dashboard /></ProtectedRoute>} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <V2Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
        <ChatbotWidget />
      </div>
    </BrowserRouter>
  )
}

export default App