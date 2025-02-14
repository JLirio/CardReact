import { redirect, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";

function CadastrarUser() {

  const [selectedFile, setSelectedfile] = useState('');
  let groupU = useParams();

  const [groupUser, setGroupUser] = useState(groupU.group || "");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    group: "",
    imgUser: "",
    vendasA: "",
    vendasB: "",
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

  const handleCurrencyInput = (e, id) => {
    const value = e.target.value;
    const formattedValue = value
      .replace(/\./g, '')  // Remove os pontos
      .replace(',', '.');  // Substitui a vírgula por ponto
    setFormData({
      ...formData,
      [id]: formattedValue
    });
  };

  const uploadData = new FormData();

  const handleFileChange = (event) => {
    setSelectedfile(event.target.files[0]);
  }

  const uploadGoogleDriveFile = async () => {
    uploadData.append('image', selectedFile);

    try {
      const response = await api.post("/usuarios/img-user", uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data?.imageUrl;
    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      formData.imgUser = await uploadGoogleDriveFile();
      formData.group = formData.group.toLowerCase();
      // Garantindo que os valores de vendasA e vendasB sejam convertidos para número
      formData.vendasA = parseFloat(formData.vendasA);
      formData.vendasB = parseFloat(formData.vendasB);

      const response = await api.post("/usuarios", formData);
      console.log("Usuário cadastrado com sucesso:", response.data);
      navigate("/cartinha"); // Redirecionar após o cadastro bem-sucedido
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setErrorMessage("Ocorreu um erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div className={`${groupUser} min-h-screen flex flex-col items-center justify-center`}>
      <div id="app" className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-center text-[#0b0908] text-2xl font-bold mb-4">Cadastro</h1>
        <form
          id="registerForm"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 my-4">
            <div className="m-1">
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

              <label htmlFor="group" className="block text-gray-700 mb-2">
                Empresa:
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

              <label htmlFor="imgUser" className="block text-gray-700 mb-2">
                Imagem de Usuário:
              </label>

              <div className="border-dashed border-2 border-gray-300 rounded-md p-4 text-center relative cursor-pointer hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  name="files"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div>
                  {
                    selectedFile !== '' ? (
                      <p className="text-sm text-[#dba24d] font-semibold">Você adicionou {selectedFile.name}</p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Arraste uma imagem ou <span className={`text-${groupUser}-darkness`}>Escolha do Computador</span>
                      </p>
                    )
                  }
                </div>
              </div>

            </div>

            <div className="m-1">
              <label htmlFor="vendasA" className="block text-gray-700 mb-2">
                Vendas Jurídico:
              </label>
              <input
                type="text"  // Mudado de "number" para "text"
                id="vendasA"
                name="vendasA"
                value={formData.vendasA}
                onChange={(e) => handleCurrencyInput(e, 'vendasA')}
                required
                className="w-full p-3 mb-4 border rounded-lg border-gray-300"
              />

              <label htmlFor="vendasB" className="block text-gray-700 mb-2">
                Vendas Comercial:
              </label>
              <input
                type="text"  // Mudado de "number" para "text"
                id="vendasB"
                name="vendasB"
                value={formData.vendasB}
                onChange={(e) => handleCurrencyInput(e, 'vendasB')}
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
            </div>
          </div>

          <div className="flex justify-center items-center flex-col">
            <button type="submit" className={`w-full ${groupUser}-btn-alert text-black font-bold py-3 px-6 rounded-lg`}>
              Cadastrar
            </button>
            <button
              className="mt-2 w-full bg-slate-500 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg"
              type="button"
              onClick={() => navigate(`/cartinha/${groupUser}?`) }
            >
              Voltar
            </button>
          </div>
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
        </div>
      </footer>
    </div>
  );
}

export default CadastrarUser;
