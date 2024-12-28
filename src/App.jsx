
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Cartinha from "./components/CartinhaPessoal"
import Cadastrar from "./components/CadastrarUser"
import UserInf from "./components/UserInfoDisplay"
import CadastroPontos from "./components/CadastroPontos"
import FifaCard from "./components/Fifacard"


function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para Login */}
        <Route path="/" element={<Login />} />
        {/* Rota para Cadastro */}
        <Route path="/cadastrar" element={<Cadastrar />} />
        {/* Rota para Exibir Informações do Usuário */}
        <Route path="/userInf" element={<UserInf />} />
        {/* Rota para Cartinha Pessoal */}
        <Route path="/cartinha" element={<Cartinha />} />
        {/* Rota para Card Fifa */}
        <Route path="/pessoal" element={<FifaCard />} />
        {/* <Route
          path="/fifa"
          element={
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
              <FifaCard
              />
            </div>
          }
        /> */}
        {/* Rota para Cadastro de Pontos com ID opcional */}
        <Route path="/pontos/:id?" element={<CadastroPontos />} />
      </Routes>
    </Router>
  );
}
export default App
