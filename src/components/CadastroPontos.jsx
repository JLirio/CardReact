import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function CadastroPontos() {
  const navigate = useNavigate();
  let userId = useParams();

  const [selectedFile, setSelectedfile] = useState('')
  const [user, setUser] = useState(null)
  const [sellerType, setSellerType] = useState('')
  const [isFetchig, setIsFetching] = useState(false)

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [groupUser, setGroupUser] = useState(userId.group || "");

  useEffect(() => {
    if (userId.id) {
      getUserById(userId);
      console.log(selectedFile)
    }
  }, [userId]);

  const getUserById = async (id) => {
    try {
      const response = await api.get(`/usuarios/user/?id=${id.id}`);
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setSellerType(user?.vendasA > 0 ? 'juridico' : 'comercial')
    }
  }, [user])


  const handleFileChange = (event) => {
    setSelectedfile(event.target.files[0])
    console.log(event.target.files[0])
  }

  const uploadGoogleDriveFile = async () => {

    const uploadData = new FormData()
    uploadData.append('image', selectedFile)

    try {

      const response = await api.post("/usuarios/img-user", uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data?.imageUrl

    } catch (err) {
      console.error(err)
    }
  }

  const handleCadastroPontos = async (e) => {

    setIsFetching(true)
    e.preventDefault();
    const senhaInput = document.getElementById("senha").value.trim();
    const userName = document.getElementById("userName").value.trim();
    const email = document.getElementById("email").value.trim();

    // Aqui convertendo a vírgula para ponto e depois para número
    let vendasA = parseFloat(document.getElementById("vendasA").value.replace(',', '.').trim());
    let vendasB = parseFloat(document.getElementById("vendasB").value.replace(',', '.').trim());

    const cargo = document.getElementById("cargo").value.trim().toLowerCase();;
    const group = document.getElementById("group").value.trim().toLowerCase();

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

    if (sellerType === 'juridico' && vendasA >= 0) {
      vendasB = 0
    } else if (sellerType === 'comercial' && vendasB >= 0) {
      vendasA = 0
    }

    let novoCadastro = {
      name: userName,
      email,
      vendasA,
      vendasB,
      cargo,
      group,
    };

    if (senhaInput != null) {
      novoCadastro.senha = senhaInput;
    }

    if (selectedFile !== '') {
      novoCadastro.imgUser = await uploadGoogleDriveFile();
    }

    try {
      if (userId && userId.id) {
        await api.put(`/usuarios/${userId.id}`, novoCadastro);
        console.log("Usuário atualizado com sucesso!");
      } else {
        await api.post("/usuarios", novoCadastro);
        console.log("Novo usuário cadastrado com sucesso!");
      }
      setIsFetching(false)
      navigate(`/cartinha/${groupUser}?`);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };


  return (
    <div className={`${groupUser} min-h-screen flex flex-col items-center justify-center`}>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2  text-black font-bold text-lg rounded-full w-full h-12 flex items-end justify-end">
        <button
          onClick={() => navigate("/")} // Redireciona para /login
          className=" bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 mr-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
        >
          Sair
        </button>
      </div>
      <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-center text-[#0b0908] text-4xl font-extrabold mb-8">
          Atualizar Usuario
        </h1>
        <form onSubmit={handleCadastroPontos} className="space-y-6">
          <div className="grid grid-cols-2">
            <div className="px-2">
              <div className="my-2">
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

              <div className="my-2">
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

              <div className="my-2">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                  Tipo de Vendedor
                </label>
                <select
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  onChange={(e) => setSellerType(e.target.value)}
                  value={sellerType}
                >
                  <option value="juridico">Jurídico</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>

              <div>
                <div className={sellerType === 'juridico' ? 'block' : 'hidden'}>
                  <label htmlFor="vendasA" className="block text-lg font-medium text-gray-700">
                    Vendas Jurídico
                  </label>
                  <input
                    type="text"
                    id="vendasA"
                    name="vendasA"
                    defaultValue={user ? user.vendasA : ""}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Digite as vendas"
                    inputMode="decimal"
                    pattern="[0-9]+([,\.][0-9]+)?"
                  />

                </div>

                <div className={sellerType === 'comercial' ? 'block' : 'hidden'}>
                  <label htmlFor="vendasB" className="block text-lg font-medium text-gray-700">
                    Vendas Comercial
                  </label>
                  <input
                    type="text"
                    id="vendasB"
                    name="vendasB"
                    defaultValue={user ? user.vendasB : ""}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Digite as vendas"
                    inputMode="decimal"
                    pattern="[0-9]+([,\.][0-9]+)?"
                  />

                </div>

              </div>

            </div>
            <div c className="my-2" lassName="px-2">
              <div>
                <label htmlFor="senha" className="text-lg font-medium text-gray-700">
                  Atualizar senha:
                </label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  placeholder="Digite uma nova senha (se quiser alterar)"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <span id="errorEmail" className="text-red-500 text-sm"></span>
              </div>

              <div className="my-2">
                <label htmlFor="cargo" className="block text-lg font-medium text-gray-700">
                  Cargo:
                </label>
                <input
                  type="text"
                  id="cargo"
                  name="cargo"
                  required
                  defaultValue={user ? user.cargo : ""}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <span id="errorEmail" className="text-red-500 text-sm"></span>
              </div>

              <div className="my-2">
                <label htmlFor="cargo" className="block text-lg font-medium text-gray-700">
                  Empresa:
                </label>
                <input
                  type="text"
                  id="group"
                  name="group"
                  required
                  defaultValue={user ? user.group : ""}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <span id="errorEmail" className="text-red-500 text-sm"></span>
              </div>

              <div className="my-2">
                <label htmlFor="cargo" className="block text-lg font-medium text-gray-700">
                  Nova foto de usuário (opcional):
                </label>
                <div className="border-dashed border-2 mt-1 border-gray-300 rounded-md p-4 text-center relative cursor-pointer hover:border-[#6b21a8] transition-colors">
                  <input
                    type="file"
                    name="files"
                    className="absolute opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <div>
                    {
                      selectedFile !== '' ?
                        (
                          <p className="text-sm text-blue-500 font-semibold">Você adicionou {selectedFile.name}</p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Arraste uma imagem ou <span className={`text-${groupUser}-darkness`}>Escolha do Computador</span>
                          </p>
                        )
                    }
                  </div>
                </div>
              </div>

            </div>
          </div>
          <button
            type="submit"
            className={`w-full ${isFetchig ? `bg-slate-600 hover:bg-slate-600` : `${groupUser}-btn`}  text-lg font-semibold py-3 rounded-lg shadow-lg transition duration-300`}
            disabled={isFetchig}
          >
            {isFetchig ? 'Atualizando' : 'Atualizar Cadastro'}
          </button>
        </form>

        <button
          onClick={() =>  navigate(`/cartinha/${groupUser}?`) }
          type="button"
          className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white text-lg font-semibold py-3 rounded-lg shadow-lg transition duration-300"
        >
          Voltar
        </button>
      </div >
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
    </div >
  );
}

export default CadastroPontos;
