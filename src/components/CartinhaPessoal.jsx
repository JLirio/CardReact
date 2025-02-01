import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";
import Usuarios from '../models/Usuario';
import { Tilt } from "react-tilt";
import Modal from "./Modal";


function CartinhaPessoal() {
  let contReloader = 1;
  let filterTotais = false;
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [pagination, setPagination] = useState([])
  const [currentPage, setCurrentPage] = useState(0)

  const [searchName, setSearchName] = useState("");
  const [searchCargo, setSearchCargo] = useState("");
  const [searchFilter, setSearchFilter] = useState("totais");
  const [searchGroup, setSearchGroup] = useState("");

  const [modalVisibility, setModalVisibility] = useState(false)
  const [currentUserInModal, setCurrentUserInModal] = useState("")

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [totalJaVendido, setTotalJaVendido] = useState(0);

  const [showTable, setShowTable] = useState(false);
  const [podio, setPodio] = useState([])
  const [podioTotais, setPodioTotais] = useState([]);
  const [podioJuridicas, setPodioJuridicas] = useState([]);
  const [podioComerciais, setPodioComerciais] = useState([]);

  const options = [
    { value: "juridicas", label: "Vendas Jurídicas" },
    { value: "totais", label: "Vendas Totais" },
    { value: "comerciais", label: "Vendas Comerciais" },
  ];

  const toggleTable = () => {
    setShowTable((prev) => !prev);
  };

  // top 3 consts
  const [topThree, setTopThree] = useState([]);




  const populateTopThree = (results) => {
    const topResults = results.slice(0, 7);
  
    if (searchFilter === "totais") {
      if (podioTotais.length === 0) {
        setPodioTotais(topResults); // Primeira vez, só define
      } else if (hasPodiumChanged(topResults, podioTotais)) {
        setPodioTotais(topResults);
        playAudio();
      }
    } else if (searchFilter === "juridicas") {
      if (podioJuridicas.length === 0) {
        setPodioJuridicas(topResults);
      } else if (hasPodiumChanged(topResults, podioJuridicas)) {
        setPodioJuridicas(topResults);
        playAudio();
      }
    } else if (searchFilter === "comerciais") {
      if (podioComerciais.length === 0) {
        setPodioComerciais(topResults);
      } else if (hasPodiumChanged(topResults, podioComerciais)) {
        setPodioComerciais(topResults);
        playAudio();
      }
    }
  
    setTopThree(topResults);
  };
  
  // 🔍 Verifica se houve mudança no TOP 3
  const hasPodiumChanged = (newPodium, oldPodium) => {
    return (
      newPodium.length >= 3 &&
      (newPodium[0]?.name !== oldPodium[0]?.name ||
        newPodium[1]?.name !== oldPodium[1]?.name ||
        newPodium[2]?.name !== oldPodium[2]?.name)
    );
  };
  
  const playAudio = () => {
    const audio = document.getElementById("passingby-audio");
    if (audio) {
      audio.play().catch((error) => {
        console.error("Erro ao reproduzir música:", error);
      });
    }
  };


  // regex img
  const regexImgLink = (imgLink) => {
    let match = []
    match = imgLink?.match(/(?<=d\/)(.*?)(?=\/view\?)/);
    const directLink = "https://drive.google.com/thumbnail?id="
    // Verifica se houve uma correspondência e retorna o valor extraído ou null
    return match ? `${directLink}${match[0]}` : null;
  }

  // tabela consts


  const handleSelect = (value) => {
    setSearchFilter(value);
  };



  function closeModal(visibility) {
    if (visibility) {
      setModalVisibility(false)
      setCurrentUserInModal("")
      getUsers()
      const audio = document.getElementById("cash-audio");
      if (audio) {
        audio.play()
          .then(() => {
          })
          .catch((error) => {
            console.error("Erro ao reproduzir música:", error);
          });
      }
    }
  }

  function openAddSalesModal(user) {
    setCurrentUserInModal(user)
    setModalVisibility(true)
  }

  // Função para buscar usuários da API
  async function getUsers() {
    try {
      const response = await api.get("/usuarios");
      setUsers(response.data);
      setFilteredUsers(response.data);
      console.log(response.data);

    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }

  // ver minha cartinha
  const handleViewCartinha = (searchId) => {
    navigate(`/pontos/${searchId}`);
  };

  function filtersList() {
    const lowerName = searchName.toLowerCase();
    const lowerCargo = searchCargo.toLowerCase();
    const lowerGroup = searchGroup.toLowerCase();

    let results = [];

    if (searchFilter === "totais") {
      results = users
        .filter(
          (user) =>
            (!searchName || user.name.toLowerCase().includes(lowerName)) &&
            (!searchCargo || user.cargo.toLowerCase().includes(lowerCargo)) &&
            (!searchGroup || user.group?.toLowerCase().includes(lowerGroup))
        )
        .sort((a, b) => b.vendasTotais - a.vendasTotais);

      setFilteredUsers(results);
      populateTopThree(results, "totais");

    } else if (searchFilter === "juridicas") {
      results = users
        .filter(
          (user) =>
            (!searchName || user.name.toLowerCase().includes(lowerName)) &&
            (!searchCargo || user.cargo.toLowerCase().includes(lowerCargo)) &&
            (!searchGroup || user.group?.toLowerCase().includes(lowerGroup))
        )
        .sort((a, b) => b.vendasA - a.vendasA);

      setFilteredUsers(results);
      populateTopThree(results, "juridicas");

    } else if (searchFilter === "comerciais") {
      results = users
        .filter(
          (user) =>
            (!searchName || user.name.toLowerCase().includes(lowerName)) &&
            (!searchCargo || user.cargo.toLowerCase().includes(lowerCargo)) &&
            (!searchGroup || user.group?.toLowerCase().includes(lowerGroup))
        )
        .sort((a, b) => b.vendasB - a.vendasB);

      setFilteredUsers(results);
      populateTopThree(results, "comerciais");
    }
  }


  // Função para atualizar os filtros
  useEffect(() => {
    filtersList()

  }, [searchName, searchCargo, searchGroup, searchFilter, users]); // Atualiza os filtros dinamicamente

  //atualizacao automatica por tempo 
  useEffect(() => {
    getUsers();
    contReloader = 2
    const intervalId = setInterval(getUsers, 90000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [contReloader == 1]);


  // calculo total 
  useEffect(() => {

    function calcTotalVendido() {

      let totalvendido = 0;

      filteredUsers.forEach((user) => {
        totalvendido += user.vendasTotais;
      });

      setTotalJaVendido(totalvendido);

    }

    calcTotalVendido()

    function createPaginationList() {

      const paginationCap = 7
      let paginationList = []

      for (let i = 0; i < filteredUsers.length; i += paginationCap) {
        const slot = filteredUsers.slice(i, i + paginationCap)
        paginationList.push(slot)
      }

      setPagination(paginationList)
    }

    createPaginationList()
  }, [filteredUsers])

  // export csv
  const exportarCSV = () => {
    const csvHeader = "Nome,Email,Vendas Jurico,Vendas Comercial,Vendas Totais,Cargo\n";
    const csvRows = users
      .map((user) =>
        [
          user.name || "Não informado",
          user.email || "Não informado",
          (user.vendasA ?? 0).toFixed(2),
          (user.vendasB ?? 0).toFixed(2),
          (user.vendasTotais ?? 0).toFixed(2),
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
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
      }
    }
  }

  // renderizacao da tabela
  const renderTableRows = () => {

    const referenceList = pagination.length > 0 ? pagination[currentPage] : filteredUsers

    return referenceList.map((user, index) => {

      // Determinando a cor de fundo para os 3 primeiros lugares
      let rowClass = `bg--500`; // Classe padrão
      if (index === 0) {
        rowClass = `bg-yellow-300`; // Primeiro lugar
      } else if (index === 1) {
        rowClass = "bg-gray-300"; // Segundo lugar
      } else if (index === 2) {
        rowClass = "bg-amber-600"; // Terceiro lugar
      }

      currentPage > 0 ? rowClass = 'bg-white' : ''

      return (
        <tr
          key={user.id}
          className={
            `hover:cursor-pointer transition duration-300 ${rowClass}`
          }>
          {/* Alterando ID para posição */}
          <td className="px-4 py-2 border text-center font-semibold text-gray-800">
            {
              currentPage > 0 ?
                pagination.slice(0, currentPage).reduce((acc, page) => acc + page.length, 0) + (index + 1) :
                index + 1
            }
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
            {(user.vendasA ?? 0).toFixed(2)}
          </td>
          <td className="px-4 py-2 border text-center font-semibold text-gray-800">
            {(user.vendasB ?? 0).toFixed(2)}
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
              className=" bg-red-500 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
            >
              Excluir
            </button>
            <button
              onClick={() => handleViewCartinha(user.id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
            >
              Editar
            </button>
            <button
              onClick={() => openAddSalesModal(user)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
            >
              + Venda
            </button>
          </td>
        </tr>
      );
    });


  };

  // pag return
  return (

    <>
      <audio id="cash-audio" src="./cash.mp3" hidden></audio>
      <audio id="passingby-audio" src="./f1-passingby.mp3" hidden></audio>
      <Modal
        visible={modalVisibility}
        title={"Adicionar Vendas"}
        message={"Incremente vendas ao vendedor, salve e veja as vendas atualizadas no painel."}
        buttonTitle={"Adicionar Vendas"}
        closeModal={closeModal}
        currentUserInModal={currentUserInModal}
      />

      <div className="bg-gradient-to-br from-blue-400 via-purple-400 to-blue-200 min-h-screen flex flex-col items-center  justify-center px-4">

        <div className="fixed border-2 border-[#8b3cd49d] left-1 top-1 flex px-2 py-1 rounded-md shadow-md">
          <p className="mr-2 font-semibold">
            Total Vendido:
          </p>
          <b className="text-white font-semibold">{(totalJaVendido).toFixed(2)}</b>
        </div>
        <div className="fixed flex-col py-4 right-1 flex justify-between min-h-screen items-end">
          <button
            onClick={() => navigate("/")} // Redireciona para /login
            className=" bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 mr-2 -top-4 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
          >
            Sair
          </button>

          <button
            onClick={toggleTable} // Redireciona para /login
            className=" bg-orange-500 hover:bg-yellow-600 hover:text-black text-white font-bold px-3 py-3 mr-5 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6">
              <path strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
            </svg>
          </button>
          <div>

          </div>
        </div>


        {/* Ranking Section */}
        <div className="flex flex-wrap items-end justify-center space-y-6 md:space-y-0 md:space-x-10 mb-10 mt-6 ">

          {/* Segundo colocado */}
          {topThree[1] && (
            <Tilt>
              <div className="hover:border-4 hover:border-white relative bg-gradient-to-t from-[#8e8e8ebb] to-[#ffffffa8] rounded-xl shadow-xl p-4 w-full md:w-72 text-center transition hover:scale-105 cursor-pointer pulse-2">
                {/* Position */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold text-lg rounded-lg w-12 h-12 flex items-center justify-center">
                  🥈
                </div>
                {/* Club and Position */}
                <div className="mt-6">
                  <img
                    src={"https://i.imgur.com/AZynwEp.jpeg"}
                    alt="Club Logo"
                    className="w-16 h-16 mx-auto rounded-full object-cover"
                  />
                  <div className="flex justify-center items-center">
                    <p className="text-sm font-bold uppercase border-[#2a074652] text-gray-800 p-1 border-2 rounded-md px-4 my-2 shadow-md">
                      {topThree[1].cargo}
                    </p>
                  </div>
                </div>
                {/* Player Image and Name */}
                <div className="mt-4">
                  <img
                    src={regexImgLink(topThree[1].imgUser)}
                    alt={`'s Country Flag`}
                    className="hover:border hover:border-white mx-auto rounded-tl-2xl rounded-br-2xl shadow-lg transition hover:scale-[1.05] w-[200px] h-[200px] object-fill cursor-pointer"
                  />
                  <h3 className="text-2xl my-4 font-bold text-[#2C2C2C] capitalize">{topThree[1].name}</h3>
                </div>
                {/* Stats */}
                <div className="mt-12 text-sm text-gray-700">
                  <div>
                    <div className="font-bold rounded-md p-1 bg-[#ffd9005b shadow-lg border-2 border-[#e1e0d936] mx-1 hover:border-white cursor-pointer">
                      <div className="text-2xl mt-1 text-[#FFF] drop-shadow-lg text-stroke">
                        <p>{
                          topThree[1].vendasA > 0 ?
                            `Jurídico: ${(topThree[1].vendasA).toFixed(2)}` :
                            `Comercial: ${(topThree[1].vendasB).toFixed(2)}`
                        }</p>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </Tilt>
          )}

          {/* Primeiro colocado */}
          {topThree[0] && (
            <Tilt>
              <div className="hover:border-4 hover:border-white relative bg-gradient-to-t from-[#ffeb04] to-[#ffdf00bb] rounded-xl shadow-xl p-4 w-full md:w-80
       text-center transition hover:scale-105 hover:border-white cursor-pointer mb-12 pulse-1 ">
                {/* Position */}

                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold text-lg rounded-lg w-12 h-12 flex items-center justify-center">
                  👑
                </div>
                {/* Club and Position */}
                <div className="mt-6">
                  <img
                    src={"https://i.imgur.com/AZynwEp.jpeg"}
                    alt="Club Logo"
                    className="w-16 h-16 mx-auto rounded-full object-cover"
                  />
                  <div className="flex justify-center items-center">
                    <p className="text-sm font-bold uppercase border-[#2a074652] text-gray-800 p-1 border-2 rounded-md px-4 my-2 shadow-md">
                      {topThree[0].cargo}
                    </p>
                  </div>
                </div>
                {/* Player Image and Name */}
                <div className="mt-4  ">
                  <img
                    src={regexImgLink(topThree[0].imgUser)}
                    alt={`'s Country Flag`}
                    className="hover:border hover:border-white mx-auto rounded-tl-2xl rounded-br-2xl shadow-lg transition hover:scale-[1.05] w-[200px] h-[200px] object-fill cursor-pointer"
                  />
                  <h3 className="text-2xl my-4 font-bold text-[#2C2C2C] capitalize">{topThree[0].name}</h3>
                </div>
                {/* Stats */}
                <div className="mt-12 text-sm text-gray-700">
                  <div>
                    <div className="font-bold rounded-md p-1 bg-[#ffd9005b shadow-lg border-2 border-[#e1e0d936] mx-1 hover:border-white cursor-pointer">
                      <div className="text-2xl mt-1 text-[#FFF] drop-shadow-lg text-stroke">
                        <p>{
                          topThree[0].vendasA > 0 ?
                            `Jurídico: ${(topThree[0].vendasA).toFixed(2)}` :
                            `Comercial: ${(topThree[0].vendasB).toFixed(2)}`
                        }</p>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </Tilt>
          )}

          {/* Terceiro colocado */}
          {topThree[2] && (
            <Tilt>
              <div className="hover:border-4 hover:border-white relative bg-gradient-to-t from-[#ba630fab] to-[#ffa042cf] rounded-xl shadow-xl p-4 w-full md:w-72 text-center transition hover:scale-105 cursor-pointer pulse-3">
                {/* Position */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black font-bold text-lg rounded-lg w-12 h-12 flex items-center justify-center">
                  🥉
                </div>

                {/* Club and Position */}
                <div className="mt-6">
                  <img
                    src={"https://i.imgur.com/AZynwEp.jpeg"}
                    alt="Club Logo"
                    className="w-16 h-16 mx-auto rounded-full object-cover"
                  />
                  <div className="flex justify-center items-center">
                    <p className="text-sm font-bold uppercase border-[#2a074652] text-gray-800 p-1 border-2 rounded-md px-4 my-2 shadow-md">
                      {topThree[2].cargo}
                    </p>
                  </div>
                </div>
                {/* Player Image and Name */}
                <div className="mt-4">
                  <img
                    src={regexImgLink(topThree[2].imgUser)}
                    alt={`'s Country Flag`}
                    className="hover:border hover:border-white mx-auto rounded-tl-2xl rounded-br-2xl shadow-lg transition hover:scale-[1.05] w-[200px] h-[200px] object-fill cursor-pointer"
                  />
                  <h3 className="text-2xl my-4 font-bold text-[#2C2C2C] capitalize">{topThree[2].name}</h3>
                </div>
                {/* Stats */}
                <div className="mt-12 text-sm text-gray-700">
                  <div>
                    <div className="font-bold rounded-md p-1 bg-[#ffd9005b shadow-lg border-2 border-[#e1e0d936] mx-1 hover:border-white cursor-pointer">
                      <div className="text-2xl mt-1 text-[#FFF] drop-shadow-lg text-stroke">
                        <p>{
                          topThree[2].vendasA > 0 ?
                            `Jurídico: ${(topThree[2].vendasA).toFixed(2)}` :
                            `Comercial: ${(topThree[2].vendasB).toFixed(2)}`
                        }</p>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </Tilt>
          )}


        </div>

        {/* Subpódio */}
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-7xl z-50">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {topThree.slice(3).map((player, index) => (
              <li
                key={index}
                className="bg-white shadow-md p-2 px-8 rounded-xl flex items-center justify-between"
              >
                <img
                  src={regexImgLink(player.imgUser)}
                  alt={player.name}
                  className="w-7 h-7 rounded-full object-cover"
                />

                <span className="font-semibold text-left flex-grow mx-2">
                  {player.name}
                </span>

                <span className="text-gray-600">{player.vendasTotais.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Filtro */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center w-full z-50 p-4">
          <ul className="flex space-x-4">
            {options.map((option) => (
              <li
                key={option.value}
                className={`relative cursor-pointer text-lg uppercase font-semibold px-4 py-2 rounded-lg 
        transition-all duration-300 
        ${searchFilter === option.value
                    ? "bg-purple-700 text-white"
                    : "bg-purple-600 text-gray-200 hover:bg-purple-700 hover:text-white"
                  }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
                <span
                  className={`absolute left-0 bottom-0 h-1 w-full bg-pink-500 transition-transform duration-300 
        ${searchFilter === option.value
                      ? "transform scale-x-100"
                      : "transform scale-x-0 hover:scale-x-100"
                    }`}
                ></span>
              </li>
            ))}
          </ul>
        </div>

        {/* table modal */}
        <div className="flex flex-col items-center p-4">


          {showTable && (
            <div id="app" className="shadow-lg rounded-lg overflow-hidden border-collapse fixed inset-x-20 inset-y-20 flex-col items-center justify-center md:p-8 rounded-lg shadow-1xl overflow-x-auto backdrop-blur-md bg-gray-600/50">
              <h1 className="text-center text-white mt-2 text-2xl md:text-3xl font-extrabold mb-4">
                Ranking de Vendas
              </h1>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
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
                <table className="min-w-full bg-white rounded-lg shadow-md overflow-y-scroll">
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
                  <tbody className="w-[200px]">{renderTableRows()}</tbody>
                </table>

              ) : (
                <div>
                  <p className="text-center text-gray-800 mt-4">
                    Nenhum usuário encontrado.
                  </p>
                </div>
              )}

              <div
                className="flex justify-center items-center m-5"
              >
                <ul className="flex justify-center">
                  {
                    pagination.map((page, index) => (
                      <li
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`my-2 text-2xl cursor-pointer hover:border-[#9333ea] px-3 text-slate-500 border-2 mx-1 rounded-md ${currentPage === index ? 'font-bold text-slate-50' : ''}`}>{index + 1}
                      </li>
                    ))
                  }
                </ul>
              </div>

              <div className="text-center text-xl flex justify-center items-center mt-10">
                <div className="border-2 border-[#8b3cd49d] flex justify-center items-center px-2 py-1 rounded-md shadow-md">
                  <p className="mr-2 font-semibold">
                    Total Vendido:
                  </p>
                  <b className="text-white font-semibold">{totalJaVendido}</b>
                </div>
              </div>
              <div className="mt-5  flex space-x-4 justify-center">
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
    </>


  );
}

export default CartinhaPessoal;
