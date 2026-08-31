import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import MaternalMorbidity from './pages/MaternalMorbidity.jsx'
import SteelTariffs from './pages/SteelTariffs.jsx'

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <Nav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/maternal-morbidity" element={<MaternalMorbidity />} />
          <Route path="/steel-tariffs" element={<SteelTariffs />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  )
}
