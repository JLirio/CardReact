import { useNavigate } from "react-router-dom";



function CartinhaPessoal() {
    
  const redirect = useNavigate()
  const pontosSalvos = JSON.parse(localStorage.getItem('pontos')) || [];

  const excluirPontoComFeedback = (index) => {
    const confirmacao = confirm("Tem certeza que deseja excluir este ponto?");
    if (confirmacao) {
      const pontosSalvos = JSON.parse(localStorage.getItem('pontos')) || [];
      pontosSalvos.splice(index, 1);
      localStorage.setItem('pontos', JSON.stringify(pontosSalvos));

      const mensagemExclusao = document.getElementById('mensagemExclusao');
      mensagemExclusao.textContent = "Ponto excluído com sucesso!";
      mensagemExclusao.style.display = "block";
      setTimeout(() => mensagemExclusao.style.display = "none", 3000);

      carregarCartinhaPessoal(); // Atualizar a interface
    }
  };

  const renderTableRows = () => {
    return pontosSalvos.map((ponto, index) => (
      <tr key={index}>
        <td>{ponto.userName}</td>
        <td>{ponto.tipoVenda}</td>
        <td>{ponto.quantidadePontos}</td>
        <td className="flex space-x-2">
          <button onClick={() => excluirPontoComFeedback(index)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Excluir</button>
          <button onClick={() => exibirCartinhaIndividual(index)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Ver Cartinha</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div id="app" className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-center text-blue-500 text-2xl font-bold mb-6">Cartinha Pessoal</h1>
        {pontosSalvos.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left">Usuário</th>
                <th className="px-4 py-2 text-left">Tipo de Venda</th>
                <th className="px-4 py-2 text-left">Quantidade de Pontos</th>
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 mt-4">Nenhum ponto cadastrado ainda.</p>
        )}
        <div className="mt-4 flex space-x-4">
          <button onClick={redirect('/pontos')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Cadastrar Pontos</button>
          <button onClick={() => exportarPontos('csv')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Exportar como CSV</button>
          <button onClick={() => exportarPontos('json')} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded">Exportar como JSON</button>
        </div>
      </div>
    </div>
  );
}

export default CartinhaPessoal;
