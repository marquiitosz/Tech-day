import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Features from "./components/Features"
import Footer from "./components/Footer"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Form from "./components/Form"
import Sobre from "./components/Sobre"
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import Conteudos from "./components/Conteudos"
import Relatorios from "./components/Relatorios"
import Historico from "./components/Historico" 
import Configuracoes from "./components/Configuracoes"

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
            <Route path="/formulario" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Form />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/conteudos" element={<Conteudos />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/historico" element={<Historico />} /> {/* 2. Nova rota do Histórico */}
            <Route path="/configuracoes" element={isLoggedIn ? <Configuracoes /> : <Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App