import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api"; 

function CadastroPontos() {
  const navigate = useNavigate();
  
  let  userId  = useParams();
   // Captura o ID da URL
  const [user, setUser] = useState(null); // Estado para armazenar o usuário carregado
  
  useEffect(() => {
    if (userId) {
      // Se um ID for fornecido, busque o usuário
      getUserById(userId);
    }
  }, [userId]);

  const getUserById = async (id) => {

    try {
      
      let response = await api.get(`/usuarios/${id}`); // Chama a API para obter o usuário pelo ID
      
      await setUser(response.data);
      console.log(response.data);
       // Define o usuário no estado
      console.log(user);
      
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      // Opcional: Gerar mensagem de erro ou redirecionar caso o usuário não seja encontrado
    }
  };

  const handleCadastroPontos = async (e) => {
    e.preventDefault();

    const userName = document.getElementById('userName').value.trim();
    const tipoVenda = document.getElementById('tipoVenda').value;
    const quantidadePontos = document.getElementById('quantidadePontos').value;

    let hasError = false;

    if (!userName) {
      document.getElementById('errorUserName').textContent = 'O nome do usuário é obrigatório.';
      hasError = true;
    }

    if (!tipoVenda) {
      document.getElementById('errorTipoVenda').textContent = 'Selecione um tipo de venda.';
      hasError = true;
    }

    if (!quantidadePontos || parseInt(quantidadePontos, 10) < 1) {
      document.getElementById('errorQuantidadePontos').textContent = 'Informe uma quantidade válida de pontos.';
      hasError = true;
    }

    if (hasError) return;

    const pontosSalvos = JSON.parse(localStorage.getItem('pontos')) || [];
    const novoCadastro = {
      userName,
      tipoVenda,
      quantidadePontos: parseInt(quantidadePontos, 10),
    };

    if (userId) {
      // Caso o ID esteja presente, faz um PATCH para atualizar o usuário
      try {
        await api.put(`/usuarios/${userId}`, novoCadastro); // Atualiza o usuário existente
        console.log('Usuário atualizado com sucesso!');
        navigate('/cartinha'); // Redireciona para a página de Cartinha após atualização
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        // Tratamento de erro
      }
    } else {
      // Caso contrário, cria um novo usuário
      try {
        await api.post('/usuarios', novoCadastro); // Cria um novo usuário
        console.log('Novo usuário cadastrado com sucesso!');
        navigate('/cartinha'); // Redireciona para a página de Cartinha após criação
      } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        // Tratamento de erro
      }
    }

    // Atualiza o localStorage ou realiza outras ações conforme necessário
    const cadastroMensagem = document.getElementById('cadastroMensagem');
    cadastroMensagem.style.display = 'block';
    e.target.reset();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div id="app" className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-blue-500 text-2xl font-bold mb-6">
          Cadastro de Pontos
        </h1>
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
            <label htmlFor="tipoVenda" className="block text-gray-700">Tipo de Venda:</label>
            <select
              id="tipoVenda"
              name="tipoVenda"
              required
              defaultValue={user ? user.tipoVenda : ""}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Selecione um tipo</option>
              <option value="A">Tipo A</option>
              <option value="B">Tipo B</option>
            </select>
            <span id="errorTipoVenda" className="text-red-500 text-sm"></span>
          </div>

          <div>
            <label htmlFor="quantidadePontos" className="block text-gray-700">Quantidade de Pontos:</label>
            <input
              type="number"
              id="quantidadePontos"
              name="quantidadePontos"
              required
              min="1"
              defaultValue={user ? user.quantidadePontos : ""}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <span id="errorQuantidadePontos" className="text-red-500 text-sm"></span>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
          >
            {userId ? "Atualizar Cadastro" : "Cadastrar"}
          </button>
        </form>

        <p id="cadastroMensagem" className="text-green-500 text-center mt-4" style={{ display: 'none' }}>
          Pontos cadastrados com sucesso!
        </p>

        <button
          onClick={() => navigate('/cartinha')}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default CadastroPontos;
