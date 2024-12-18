import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function CadastroPontos() {
  const navigate = useNavigate();
  let userId = useParams(); // Captura o ID da URL
  const [user, setUser] = useState(null); // Estado para armazenar o usuário carregado

  useEffect(() => {
    if (userId.id) {
      console.log(userId);
      
      // Se um ID for fornecido, busque o usuário
      getUserById(userId);
    }
  }, [userId]);

  const getUserById = async (id) => {
    try {
      let response = await api.get(`/usuarios/user/?id=${id.id}`); // Chama a API para obter o usuário pelo ID
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  const handleCadastroPontos = async (e) => {
    e.preventDefault();

    const userName = document.getElementById("userName").value.trim();
    const email = document.getElementById("email").value.trim();
    const vendasA = parseFloat(document.getElementById("vendasA").value.trim());
    const vendasB = parseFloat(document.getElementById("vendasB").value.trim());
    const vendasTotais = vendasA + vendasB; // Calcula as vendas totais

    let hasError = false;

    if (!userName) {
      document.getElementById("errorUserName").textContent = "O nome do usuário é obrigatório.";
      hasError = true;
    }
    if (!email) {
      document.getElementById("errorEmail").textContent = "O email é obrigatório.";
      hasError = true;
    }

    if (hasError) return;

    const novoCadastro = {
      name: userName,
      email,
      vendasA,
      vendasB,
    };

    if (userId && userId.id) {
      // Se estiver atualizando um usuário existente
      try {
        await api.put(`/usuarios/${userId.id}`, novoCadastro); // Atualiza o usuário existente
        console.log(novoCadastro);
        
        console.log("Usuário atualizado com sucesso!");
        navigate("/cartinha"); // Redireciona para a página de Cartinha após atualização
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
      }
    } else {
      try {
        await api.post("/usuarios", novoCadastro); // Cria um novo usuário
        console.log("Novo usuário cadastrado com sucesso!");
        navigate("/cartinha"); // Redireciona para a página de Cartinha após criação
      } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div id="app" className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-blue-500 text-2xl font-bold mb-6">Cadastro de Pontos</h1>
        <form id="cadastroPontosForm" onSubmit={handleCadastroPontos} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-gray-700">Nome do Usuário:</label>
            <input
              type="text"
              id="userName"
              name="userName"
              required
              defaultValue={user ? user.name : ""}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <span id="errorUserName" className="text-red-500 text-sm"></span>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              defaultValue={user ? user.email : ""}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <span id="errorEmail" className="text-red-500 text-sm"></span>
          </div>

          <div>
            <label htmlFor="vendasA" className="block text-gray-700">Vendas Tipo A:</label>
            <input
              type="number"
              id="vendasA"
              name="vendasA"
              defaultValue={user ? user.vendasA : ""}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="vendasB" className="block text-gray-700">Vendas Tipo B:</label>
            <input
              type="number"
              id="vendasB"
              name="vendasB"
              defaultValue={user ? user.vendasB : ""}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="vendasTotais" className="block text-gray-700">Vendas Totais:</label>
            <input
              type="number"
              id="vendasTotais"
              name="vendasTotais"
              value={user ? user.vendasTotais : ""}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
          >
            {userId ? "Atualizar Cadastro" : "Cadastrar"}
          </button>
        </form>

        <button
          onClick={() => navigate("/cartinha")}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default CadastroPontos;
