
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Cartinha from "./components/CartinhaPessoal"
import CadastroPontos from "./components/CadastroPontos"
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/cartinha" element={<Cartinha />}></Route>
        <Route path="/pontos/:id?" element={<CadastroPontos />}></Route>
      </Routes>
    </Router>
  )
}

export default App
