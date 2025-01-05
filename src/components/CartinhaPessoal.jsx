import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";

function CartinhaPessoal() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Estado para usuários filtrados
  const [searchName, setSearchName] = useState(""); // Filtro por nome
  const [searchCargo, setSearchCargo] = useState(""); // Filtro por cargo
  const [searchGroup, setSearchGroup] = useState(""); // Filtro por equipe

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Função para buscar usuários da API
  async function getUsers() {
    try {
      const response = await api.get("/usuarios");
      setUsers(response.data);
      setFilteredUsers(response.data); // Inicializa o estado filtrado com todos os usuários
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }


  const handleViewCartinha = (searchId) => {
    navigate(`/pontos/${searchId}`); // Redireciona para a rota /pontos/:userId

  };

  // Função para atualizar os filtros
  useEffect(() => {
    const lowerName = searchName.toLowerCase();
    const lowerCargo = searchCargo.toLowerCase();
    const lowerGroup = searchGroup.toLowerCase();

    const results = users.filter(
      (user) =>
        (!searchName || user.name.toLowerCase().includes(lowerName)) &&
        (!searchCargo || user.cargo.toLowerCase().includes(lowerCargo)) &&
        (!searchGroup || user.group?.toLowerCase().includes(lowerGroup))

    ).sort((a, b) => b.vendasTotais - a.vendasTotais);
    setFilteredUsers(results);
  }, [searchName, searchCargo, searchGroup, users]); // Atualiza os filtros dinamicamente

  useEffect(() => {
    getUsers();
  }, []);

  // Renderizar linhas da tabela
  const renderTableRows = () => {
    return filteredUsers.map((user) => (
      <tr key={user.id} className="hover:bg-yellow-100 transition duration-300">
        {/* <td className="px-4 py-2 border text-center font-semibold text-gray-800">
          {user.id}
        </td> */}
        <td className="px-4 py-2 border text-center font-semibold text-gray-800">
          {user.name || "Não informado"}
        </td>
        <td className="px-4 py-2 border text-center font-semibold text-gray-800">
          {user.email || "Não informado"}
        </td>
        <td className="px-4 py-2 border text-center font-semibold text-gray-800">
          {user.group || "Não informado"}
        </td>
        <td className="px-4 py-2 border text-center font-semibold text-gray-800">
          {user.vendasTotais || 0}
        </td>
        <td className="px-4 py-2 border text-center font-semibold text-gray-800">
          {user.cargo || "Não informado"}
        </td>
        <td
          className={
            userInfo?.cargo === "Admin"
              ? "px-4 py-2 border flex space-x-2 justify-center"
              : "hidden"
          }
        >
          <button
            onClick={() => excluirUsuarioAPI(user.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
          >
            Excluir
          </button>
          <button
            onClick={() => handleViewCartinha(user.id)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
          >
            Editar
          </button>
        </td>
      </tr>
    ));
  };

  const exportarCSV = () => {
    const csvHeader = "ID,Nome,Email,Vendas Jurico,Vendas Comercial,Vendas Totais,Cargo\n";
    const csvRows = users
      .map((user) =>
        [
          user.id,
          user.name || "Não informado",
          user.email || "Não informado",
          user.vendasA || "Não informado",
          user.vendasB || "Não informado",
          user.vendasTotais || 0,
          user.cargo || "Não informado",
        ].join(",")
      )
      .join("\n");
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "usuarios.csv";
    link.click();
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
      <div
        id="app"
        className="max-w-6xl w-full bg-white p-8 rounded-lg shadow-2xl overflow-x-auto"
      >
        <h1 className="flex-1 h-16 col-span-2 text-center text-purple-600 text-3xl font-extrabold mb-8">
          Cartinha Pessoal
        </h1>

        {/* Filtros */}
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            placeholder="Filtrar por Nome"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-400 px-4 py-2 rounded-lg shadow"
          />
          <input
            type="text"
            placeholder="Filtrar por Cargo"
            value={searchCargo}
            onChange={(e) => setSearchCargo(e.target.value)}
            className="border border-gray-400 px-4 py-2 rounded-lg shadow"
          />
          <input
            type="text"
            placeholder="Filtrar por Equipe"
            value={searchGroup}
            onChange={(e) => setSearchGroup(e.target.value)}
            className="border border-gray-400 px-4 py-2 rounded-lg shadow"
          />
        </div>

        {/* Tabela */}
        {filteredUsers.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow-md ">
            <thead>
              <tr className="bg-purple-600 text-white ">
                {/* <th className="px-4 py-2 text-center font-bold">ID</th> */}
                <th className="px-4 py-2 text-center font-bold">Nome</th>
                <th className="px-4 py-2 text-center font-bold">Email</th>
                <th className="px-4 py-2 text-center font-bold">Equipe</th>
                <th className="px-4 py-2 text-center font-bold">
                  Vendas Totais
                </th>
                <th className="px-4 py-2 text-center font-bold">Cargo</th>
                <th
                  className={
                    userInfo?.cargo === "Admin"
                      ? "px-4 py-2 text-center font-bold"
                      : "hidden"
                  }
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        ) : (
          <p className="text-center text-gray-800 mt-4">
            Nenhum usuário encontrado.
          </p>
        )}
      </div>
      {/* className={
            userInfo?.cargo === "Admin"
              ? "px-4 py-2 border flex space-x-2 justify-center"
              : "hidden"
          } */}
      <div className="mt-6 flex space-x-4 justify-center">
        <button
          onClick={exportarCSV}
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
        >
          Exportar como CSV
        </button>
        <button
          onClick={() => navigate("/cadastrar")} // Redireciona para /pontos sem o userId
          className={userInfo.cargo === "Admin" ? "bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110" : "hidden"}
        >
          Novo cadastro
        </button>

        <button
          onClick={() => navigate("/pessoal")} // Redireciona para /pontos sem o userId
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
        >
          Minha cartinha
        </button>
      </div>
    </div>
  );
}

export default CartinhaPessoal;
