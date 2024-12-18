import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";

function CartinhaPessoal() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Função para buscar usuários da API
  async function getUsers() {
    try {
      const response = await api.get("/usuarios");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }

  // Função para excluir usuário na API
  async function excluirUsuarioAPI(id) {
    const confirmacao = confirm("Tem certeza que deseja excluir este usuário?");
    if (confirmacao) {
      try {
        await api.delete(`/usuarios/${id}`); // Chama a API para excluir
        setUsers(users.filter((user) => user.id !== id)); // Remove o usuário localmente
        console.log(`Usuário ${id} excluído com sucesso!`);
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
      }
    }
  }

  // Função para exportar os dados como CSV
  const exportarCSV = () => {
    const csvHeader = "ID,Nome,Email,Vendas Totais,Cargo\n";
    const csvRows = users.map(
      (user) =>
        [
          user.id,
          user.name || "Não informado",
          user.email || "Não informado",
          user.vendasTotais || 0,
          user.cargo || "Não informado",
        ].join(',')
    ).join('\n');
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "usuarios.csv";
    link.click();
  };

  // Função para redirecionar para a página "Cadastro de Pontos" com o userId
  const handleViewCartinha = (userId) => {
    navigate(`/pontos/${userId}`); // Redireciona para a rota /pontos/:userId
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Renderizar linhas da tabela
  const renderTableRows = () => {
    return users.map((user) => (
      <tr key={user.id}>
        <td className="px-4 py-2 border">{user.id}</td>
        <td className="px-4 py-2 border">{user.name || "Não informado"}</td>
        <td className="px-4 py-2 border">{user.email || "Não informado"}</td>
        <td className="px-4 py-2 border">{user.vendasTotais || 0}</td>
        <td className="px-4 py-2 border">{user.cargo || "Não informado"}</td>
        <td className="px-4 py-2 border flex space-x-2 justify-center">
          <button
            onClick={() => excluirUsuarioAPI(user.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Excluir
          </button>
          <button
            onClick={() => handleViewCartinha(user.id)} // Chamando a função de redirecionamento
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Ver Cartinha
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div id="app" className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-blue-500 text-2xl font-bold mb-6">Cartinha Pessoal</h1>
        {users.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Vendas Totais</th>
                <th className="px-4 py-2 text-left">Cargo</th>
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 mt-4">Nenhum usuário cadastrado ainda.</p>
        )}
        <div className="mt-4 flex space-x-4">
          <button
            onClick={exportarCSV}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Exportar como CSV
          </button>
          <button
            onClick={() => navigate('/pontos')} // Redireciona para /pontos sem o userId
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ver Cartinha
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartinhaPessoal;
