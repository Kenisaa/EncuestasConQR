import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import RegistroExito from './pages/RegistroExito'
import Dashboard from './pages/Dashboard'
import NuevaEncuesta from './pages/NuevaEncuesta'
import DetalleEncuesta from './pages/DetalleEncuesta'
import ResultadosEncuesta from './pages/ResultadosEncuesta'
import VistaEncuesta from './pages/VistaEncuesta'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/registro/exito" element={<RegistroExito />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/encuestas/nueva" element={<NuevaEncuesta />} />
      <Route path="/dashboard/encuestas/:id" element={<DetalleEncuesta />} />
      <Route path="/dashboard/encuestas/:id/resultados" element={<ResultadosEncuesta />} />
      <Route path="/encuesta/:id" element={<VistaEncuesta />} />
    </Routes>
  )
}

export default App
