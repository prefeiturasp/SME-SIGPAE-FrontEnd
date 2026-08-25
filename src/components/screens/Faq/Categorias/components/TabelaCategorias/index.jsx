import React from "react";
import TabelaListagem from "src/components/Shareable/TabelaListagem";

const TabelaCategorias = ({ categorias, aoEditar, aoExcluir }) => {
  const colunas = [
    {
      chave: "nome",
      titulo: "Nome da Categoria",
      renderizar: (categoria) => categoria.nome,
    },
    {
      chave: "acoes",
      titulo: "Ações",
      classe: "tabela-listagem__coluna-acoes",
      largura: "100px",
      renderizar: (categoria) => (
        <div className="tabela-listagem__acoes">
          <button
            type="button"
            className="tabela-listagem__botao-acao"
            title="Editar"
            aria-label={`Editar categoria ${categoria.nome}`}
            onClick={() => aoEditar(categoria)}
          >
            <i className="fas fa-edit" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="tabela-listagem__botao-acao"
            title="Excluir"
            aria-label={`Excluir categoria ${categoria.nome}`}
            onClick={() => aoExcluir?.(categoria)}
          >
            <i className="fas fa-trash" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <TabelaListagem
      colunas={colunas}
      dados={categorias}
      larguraMinima="600px"
      obterChave={(categoria) => categoria.uuid}
    />
  );
};

export default TabelaCategorias;
