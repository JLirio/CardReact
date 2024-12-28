import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Suponha que você tenha configurado a API

import { useState } from "react";


const getUserInfo = async () => {
  const token = localStorage.getItem('token');
  console.log(token);

  if (token) {
    try {
      const response = await api.get('/usuarios/user-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.data;
      console.log(userData);
      
      localStorage.setItem("userInfo", JSON.stringify(userData));
      return userData; // Dados do usuário
    } catch (error) {
      console.error('Failed to fetch user info', error);
    }
  }
  return null;
};

function Login() {
  localStorage.clear();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await api.post("/usuarios/login", { email, password });
      const { token, user } = response.data;

      // Armazenar o token no localStorage
      localStorage.setItem("token", token);



      getUserInfo();
      // Redirecionar para a página protegida (por exemplo, /cartinha)
      navigate("/cartinha");

    } catch (error) {
      console.error(error);
      setErrorMessage("Usuário ou senha incorretos.");
    }
  };


  return (
    <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 min-h-screen flex flex-col items-center justify-center">
      <div id="app" className="max-w-sm w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-center text-blue-500 text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="username" className="block text-gray-700 mb-2">
            Usuário:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <label htmlFor="password" className="block text-gray-700 mb-2">
            Senha:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Entrar
          </button>
        </form>
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default Login;
