import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";


function Login() {

  const [validUser, setUser] = useState([]);

 

  const redirect = useNavigate()

  const handleLogin = (e) => {
    
    e.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    getUser(email,password)

  };

  async function getUser(email, password) {
    try {
      console.log(email);
      
      const response = await api.get(`/usuarios/login/?email=${email}`);
      console.log(response.data);
      
      await setUser(response.data);
      await console.log(validUser.email);
      await console.log(validUser.senha);
      if (email === validUser.email && password === validUser.senha) {
        redirect('/cartinha')
      } else {
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.style.display = 'block';
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }

  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div id="app" className="max-w-sm w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-center text-blue-500 text-2xl font-bold mb-4">Login</h1>
        <form id="loginForm" onSubmit={handleLogin}>
          <label htmlFor="username" className="block text-gray-700 mb-2">Usuário:</label>
          <input type="text" id="username" name="username" required className="w-full p-3 mb-4 border rounded-lg border-gray-300" />

          <label htmlFor="password" className="block text-gray-700 mb-2">Senha:</label>
          <input type="password" id="password" name="password" required className="w-full p-3 mb-4 border rounded-lg border-gray-300" />

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg">Entrar</button>
        </form>
        <p id="loginMessage" className="text-red-500 text-center mt-4">Usuário ou senha incorretos.</p>
      </div>
    </div>
  );
}

export default Login;
