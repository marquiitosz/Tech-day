import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Features from "./components/Features"
import Footer from "./components/Footer"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Sobre from "./components/Sobre"
import Conteudos from "./components/Conteudos"
import Historico from "./components/Historico" 
import Configuracoes from "./components/Configuracoes"
import { ChatbotWidget } from "./chatbot/ChatbotWidget"
import { V2Dashboard, V2Relatorios, V2Cadastro, V2Login } from "./v2/presentation/pages"

function Home() {
  return (
    <>
      <Hero />
      <Features />
    </>
  )
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
            <Route path="/relatorios" element={<V2Relatorios />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/configuracoes" element={isLoggedIn ? <Configuracoes /> : <Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<V2Dashboard />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <V2Login />} />
          </Routes>
        </main>
        
        <Footer />
        <ChatbotWidget />
      </div>
    </BrowserRouter>
  )
}

export default App