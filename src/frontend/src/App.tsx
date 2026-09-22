import Navbar from "./components/Navbar.tsx"
import Hero from "./components/Hero.tsx"
import Features from "./components/Features.tsx"
import Footer from "./components/Footer.tsx"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Form from "./components/Form.tsx"
import Sobre from "./components/Sobre.tsx"
import Dashboard from "./components/Dashboard.tsx"
import Login from "./components/Login.tsx"


function Home() {
  return (
    <>
      <Hero />
      <Features />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="bg-blue-50 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/formulario" element={<Form />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
export default App
