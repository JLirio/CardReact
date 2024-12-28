import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";

function CadastrarUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    imgUser: "",
    group: "",
    vendasA: 0,
    vendasB: 0,
    cargo: "",
    senha: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/usuarios", formData);
      console.log("Usuário cadastrado com sucesso:", response.data);
      navigate("/cartinha"); // Redirecionar após o cadastro bem-sucedido
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setErrorMessage("Ocorreu um erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 min-h-screen flex flex-col items-center justify-center">
      <div id="app" className="max-w-sm w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-center text-blue-500 text-2xl font-bold mb-4">Cadastro</h1>
        <form id="registerForm" onSubmit={handleSubmit}>
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Nome:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <label htmlFor="imgUser" className="block text-gray-700 mb-2">
            Imagem de Usuário:
          </label>
          <input
            type="text"
            id="imgUser"
            name="imgUser"
            value={formData.imgUser}
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <label htmlFor="group" className="block text-gray-700 mb-2">
            Grupo:
          </label>
          <input
            type="text"
            id="group"
            name="group"
            value={formData.group}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <label htmlFor="vendasA" className="block text-gray-700 mb-2">
            Vendas A:
          </label>
          <input
            type="number"
            id="vendasA"
            name="vendasA"
            value={formData.vendasA}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <label htmlFor="vendasB" className="block text-gray-700 mb-2">
            Vendas B:
          </label>
          <input
            type="number"
            id="vendasB"
            name="vendasB"
            value={formData.vendasB}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <label htmlFor="cargo" className="block text-gray-700 mb-2">
            Cargo:
          </label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <label htmlFor="senha" className="block text-gray-700 mb-2">
            Senha:
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">
            Cadastrar
          </button>
        </form>
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default CadastrarUser;
