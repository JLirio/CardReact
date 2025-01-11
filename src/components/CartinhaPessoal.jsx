import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";
import Usuarios from '../models/Usuario';
import { Tilt } from "react-tilt";




function CartinhaPessoal() {
  // top 3 consts
  const [topThree, setTopThree] = useState([]);
  let contReloader = 1;

  // Função para popular top 3
  const populateTopThree = (results) => {
    const topResults = results.slice(0, 3);
    setTopThree(topResults);
  };
  const regexImgLink = (imgLink) => {
    let match = []
    match = imgLink?.match(/(?<=d\/)(.*?)(?=\/view\?)/);
    const directLink = "https://drive.google.com/thumbnail?id="
    // Verifica se houve uma correspondência e retorna o valor extraído ou null
    return match ? `${directLink}${match[0]}` : null;
  }
  // tabela consts
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Estado para usuários filtrados
  const [searchName, setSearchName] = useState(""); // Filtro por nome
  const [searchCargo, setSearchCargo] = useState(""); // Filtro por cargo
  const [searchFilter, setSearchFilter] = useState("totais");
  const [searchGroup, setSearchGroup] = useState(""); // Filtro por equipe

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [totalJaVendido, setTotalJaVendido] = useState(0);

  let filterTotais = false;

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
    filtersList()

  }, [searchName, searchCargo, searchGroup, searchFilter, users]); // Atualiza os filtros dinamicamente

  function filtersList() {
    const lowerName = searchName.toLowerCase();
    const lowerCargo = searchCargo.toLowerCase();
    const lowerGroup = searchGroup.toLowerCase();


    if (searchFilter == "totais") {
      const results = users.filter(
        (user) =>
          (!searchName || user.name.toLowerCase().includes(lowerName)) &&
          (!searchCargo || user.cargo.toLowerCase().includes(lowerCargo)) &&
          (!searchGroup || user.group?.toLowerCase().includes(lowerGroup))

      ).sort((a, b) => b.vendasTotais - a.vendasTotais);
      setFilteredUsers(results);
      populateTopThree(results);


    } else if (searchFilter == "juridicas") {
      const results = users.filter(
        (user) =>
          (!searchName || user.name.toLowerCase().includes(lowerName)) &&
          (!searchCargo || user.cargo.toLowerCase().includes(lowerCargo)) &&
          (!searchGroup || user.group?.toLowerCase().includes(lowerGroup))

      ).sort((a, b) => b.vendasA - a.vendasA);
      setFilteredUsers(results);
      populateTopThree(results);

      filterTotais = true;

    } else if (searchFilter == "comerciais") {
      const results = users.filter(
        (user) =>
          (!searchName || user.name.toLowerCase().includes(lowerName)) &&
          (!searchCargo || user.cargo.toLowerCase().includes(lowerCargo)) &&
          (!searchGroup || user.group?.toLowerCase().includes(lowerGroup))

      ).sort((a, b) => b.vendasB - a.vendasB);
      setFilteredUsers(results);
      populateTopThree(results);


    }


  }

  useEffect(() => {
    getUsers();
    contReloader = 2
  }, [contReloader == 1]);

  // Renderizar linhas da tabela
  const renderTableRows = () => {
    let totalvendido = 0;
    console.log(filteredUsers.length);
  
    // Calcule o total vendido antes de renderizar as linhas
    filteredUsers.forEach((user) => {
      totalvendido += user.vendasTotais; // Soma o total de vendas
    });
  
    // Atualiza o estado do total de vendas
    // setTotalJaVendido(totalvendido);
  
    return filteredUsers.map((user, index) => {
      // Determinando a cor de fundo para os 3 primeiros lugares
      let rowClass = "hover:bg-yellow-100 transition duration-300"; // Classe padrão
      if (index === 0) {
        rowClass = "bg-gold-500"; // Primeiro lugar
      } else if (index === 1) {
        rowClass = "bg-silver-500"; // Segundo lugar
      } else if (index === 2) {
        rowClass = "bg-bronze-500"; // Terceiro lugar
      }
  
      return (
        <tr key={user.id} className={rowClass}>
          {/* Alterando ID para posição */}
          <td className="px-4 py-2 border text-center font-semibold text-gray-800">
            #{index + 1}
          </td>
          <td className="px-4 py-2 border text-center font-semibold text-gray-800">
            {user.name || "Não informado"}
          </td>
          {/* <td className="px-4 py-2 border text-center font-semibold text-gray-800">
            {user.email || "Não informado"}
          </td> */}
          <td className="px-4 py-2 border text-center font-semibold text-gray-800">
            {user.group || "Não informado"}
          </td>
          <td className="px-4 py-2 border text-center font-semibold text-gray-800">
            {user.vendasA || 0}
          </td>
          <td className="px-4 py-2 border text-center font-semibold text-gray-800">
            {user.vendasB || 0}
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
      );
    });
    
    
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

  return (
    <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 min-h-screen flex flex-col items-center justify-center">
     <div className="flex items-end justify-center space-x-10 mb-6">
    {/* Segundo colocado */}
    {topThree[1] && (
      <Tilt>
        <div className="relative bg-gradient-to-t from-[#8e8e8ebb] to-[#ffffffa8] rounded-xl shadow-xl p-4 w-72 text-center transition hover:scale-105 cursor-pointer ">
          {/* Position */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold text-lg rounded-lg w-12 h-12 flex items-center justify-center">
            #2
          </div>
          {/* Details */}
          <div className="mt-6">
            <img
              src={regexImgLink(topThree[1].imgUser) || "default_image_url"}
              alt="User"
              className="w-12 h-12 mx-auto rounded-full object-cover"
            />
            <p className="text-sm font-bold uppercase text-gray-800 my-2">
              {topThree[1].name || "Não informado"}
            </p>
            <p className="text-sm text-gray-600">{topThree[1].cargo || "Cargo não informado"}</p>
          </div>
        </div>
      </Tilt>
    )}

    {/* Primeiro colocado */}
    {topThree[0] && (
      <Tilt>
        <div className="relative bg-gradient-to-t from-[#ffeb04] to-[#ffdf00bb] rounded-xl shadow-xl p-4 w-80 text-center transition hover:scale-105 cursor-pointer  -translate-y-6">
          {/* Position */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold text-lg rounded-lg w-12 h-12 flex items-center justify-center">
            #1
          </div>
          {/* Details */}
          <div className="mt-6">
            <img
              src={regexImgLink(topThree[0].imgUser) || "default_image_url"}
              alt="User"
              className="w-12 h-12 mx-auto rounded-full object-cover"
            />
            <p className="text-sm font-bold uppercase text-gray-800 my-2">
              {topThree[0].name || "Não informado"}
            </p>
            <p className="text-sm text-gray-600">{topThree[0].cargo || "Cargo não informado"}</p>
          </div>
        </div>
      </Tilt>
    )}

    {/* Terceiro colocado */}
    {topThree[2] && (
      <Tilt>
        <div className="relative bg-gradient-to-t from-[#ba630fab] to-[#ffa042cf] rounded-xl shadow-xl p-4 w-72 text-center transition hover:scale-105 cursor-pointer ">
          {/* Position */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold text-lg rounded-lg w-12 h-12 flex items-center justify-center">
            #3
          </div>
          {/* Details */}
          <div className="mt-6">
            <img
              src={regexImgLink(topThree[2].imgUser) || "default_image_url"}
              alt="User"
              className="w-12 h-12 mx-auto rounded-full object-cover"
            />
            <p className="text-sm font-bold uppercase text-gray-800 my-2">
              {topThree[2].name || "Não informado"}
            </p>
            <p className="text-sm text-gray-600">{topThree[2].cargo || "Cargo não informado"}</p>
          </div>
        </div>
      </Tilt>
    )}
  </div>


  
      <div className="absolute  top-4 left-1/2 transform -translate-x-1/2  text-black font-bold text-lg rounded-full w-full h-12 flex items-end justify-end">
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
          Ranking de Vendas
        </h1>

        {/* Filtros */}
        <div className="flex space-x-4 mb-6 justify-center">
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
          <select
            id=""
            className="border border-gray-400 px-4 py-2 rounded-lg shadow"
            onChange={(e) => setSearchFilter(e.target.value)}
          >
            <option value="totais">Vendas totais</option>
            <option value="juridicas">Vendas Juridicas</option>
            <option value="comerciais">Vendas Comercias</option>
          </select>
          {/* <button 
          type="submit"
          className="w-full bg-purple-700 hover:bg-purple-800 text-white text-lg font-semibold py-3 rounded-lg shadow-lg transition duration-300"
          onClick={(e)}>Search</button> */}
        </div>

        {/* Tabela */}
        {filteredUsers.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow-md ">
            <thead>
              <tr className="bg-purple-600 text-white ">
                <th className="px-4 py-2 text-center font-bold">#</th>
                <th className="px-4 py-2 text-center font-bold">Nome</th>
                {/* <th className="px-4 py-2 text-center font-bold">Email</th> */}
                <th className="px-4 py-2 text-center font-bold">Equipe</th>
                {/* <th className="px-4 py-2 text-center font-bold">
                  Vendas Totais
                </th> */}
                <th className="px-4 py-2 text-center font-bold">
                  Juridicas
                </th>
                <th className="px-4 py-2 text-center font-bold">
                  Comerciais
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
        <h2>
            Total vendido: {totalJaVendido}

        </h2>
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
          className={userInfo?.cargo === "Admin" ? "bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110" : "hidden"}
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
