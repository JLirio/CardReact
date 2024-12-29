import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function CadastroPontos() {
  const navigate = useNavigate();
  let userId = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId.id) {
      getUserById(userId);
    }
  }, [userId]);

  // async function getUsers() {
  //   try {
  //     const response = await api.get("/usuarios");
  //     setUsers(response.data);
  //   } catch (error) {
  //     console.error("Erro ao buscar usuários:", error);
  //   }
  // }

  const getUserById = async (id) => {
    console.log(id);

    try {
      const response = await api.get(`/usuarios/user/?id=${id.id}`);
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
    const vendasTotais = vendasA + vendasB;

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

    try {
      if (userId && userId.id) {
        await api.put(`/usuarios/${userId.id}`, novoCadastro);
        console.log("Usuário atualizado com sucesso!");
      } else {
        await api.post("/usuarios", novoCadastro);
        console.log("Novo usuário cadastrado com sucesso!");
      }
      navigate("/cartinha");
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 min-h-screen flex flex-col items-center justify-center">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2  text-black font-bold text-lg rounded-full w-full h-12 flex items-end justify-end">
        <button
          onClick={() => navigate("/")} // Redireciona para /login
          className=" bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 mr-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
        >
          Sair
        </button>
      </div>
      <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-center text-purple-700 text-4xl font-extrabold mb-8">
          Cadastro de Pontos
        </h1>
        <form onSubmit={handleCadastroPontos} className="space-y-6">
          <div>
            <label htmlFor="userName" className="block text-lg font-medium text-gray-700">
              Nome do Usuário:
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              required
              defaultValue={user ? user.name : ""}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <span id="errorUserName" className="text-red-500 text-sm"></span>
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              defaultValue={user ? user.email : ""}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <span id="errorEmail" className="text-red-500 text-sm"></span>
          </div>

          <div>
            <label htmlFor="vendasA" className="block text-lg font-medium text-gray-700">
              Vendas Jurídico
            </label>
            <input
              type="number"
              id="vendasA"
              name="vendasA"
              defaultValue={user ? user.vendasA : ""}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="vendasB" className="block text-lg font-medium text-gray-700">
              Vendas Comercial
            </label>
            <input
              type="number"
              id="vendasB"
              name="vendasB"
              defaultValue={user ? user.vendasB : ""}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="vendasTotais" className="block text-lg font-medium text-gray-700">
              Vendas Totais:
            </label>
            <input
              type="number"
              id="vendasTotais"
              name="vendasTotais"
              value={user ? user.vendasTotais : ""}
              readOnly
              className="w-full mt-2 p-3 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white text-lg font-semibold py-3 rounded-lg shadow-lg transition duration-300"
          >
            {userId ? "Atualizar Cadastro" : "Cadastrar"}
          </button>
        </form>

        <button
          onClick={() => navigate("/cartinha")}
          className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white text-lg font-semibold py-3 rounded-lg shadow-lg transition duration-300"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default CadastroPontos;
