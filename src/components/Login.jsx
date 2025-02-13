import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Suponha que você tenha configurado a API
import { useState } from "react";

const getUserInfo = async () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const response = await api.get('/usuarios/user-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await response.data;
      
      localStorage.setItem("userInfo", JSON.stringify(userData));
      localStorage.setItem("groupUser", JSON.stringify(userData.group));
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
    <div className="bg-gradient-to-br from-green-100 via-blue-300 to-white min-h-screen flex flex-col items-center justify-center">
      <div id="app" className="max-w-sm w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-center text-black text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="username" className="block text-gray-700 mb-2">
            Usuário:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="examplo@mail.com"
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
            placeholder="Senha do seu usuário"
            required
            className="w-full p-3 mb-4 border rounded-lg border-gray-300"
          />

          <button
            type="submit"
            className="w-full bg-[#e7b56a] hover:bg-[#dba24d] text-black hover:text-white font-bold py-3 px-6 rounded-lg"
          >
            Entrar
          </button>
        </form>
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
      </div>
      <footer className=" fixed text-white py-6 -bottom-5 flex right-1">
        <div className="container mx-auto flex justify-between items-center px-4">
          <p className="text-sm">
            &copy; 2025 CardReact. Todos os direitos reservados.
          </p>
          {/* <div className="flex space-x-6">
            <a href="#" className="hover:text-purple-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Termos de Serviço</a>
          </div> */}
        </div>
      </footer>
    </div>
  );
}

export default Login;
