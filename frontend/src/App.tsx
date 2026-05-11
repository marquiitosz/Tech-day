import Navbar from "./components/Navbar.tsx"
import Hero from "./components/Hero.tsx"
import Features from "./components/Features.tsx"
import Footer from "./components/Footer.tsx"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Form from "./components/Form.tsx"
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
      <div className="bg-blue-50 min-h-screen">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formulario" element={<Form />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  )
}
export default App
