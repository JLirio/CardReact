
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Carta from "./components/CartinhaPessoal"
import CadastroPontos from "./components/CadastroPontos"
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/cartinha" element={<Carta />}></Route>
        <Route path="/pontos" element={<CadastroPontos />}></Route>
      </Routes>
    </Router>
  )
}

export default App
