import React from "react";
import { arrayOf, func, shape, string } from "prop-types";
import "./style.scss";

const TabelaCategorias = ({ categorias, aoEditar, aoExcluir }) => {
  return (
    <div className="tabela-categorias">
      <div className="container-tabela-categorias">
        <table>
          <thead>
            <tr>
              <th>Nome da Categoria</th>
              <th className="coluna-acoes"></th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.uuid}>
                <td>{categoria.nome}</td>

                <td className="coluna-acoes">
                  <div className="acoes-categoria">
                    <button
                      type="button"
                      className="botao-acao"
                      title="Editar"
                      aria-label={`Editar categoria ${categoria.nome}`}
                      onClick={() => aoEditar(categoria)}
                    >
                      <i className="fas fa-edit" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      className="botao-acao"
                      title="Excluir"
                      aria-label={`Excluir categoria ${categoria.nome}`}
                      onClick={() => aoExcluir?.(categoria)}
                    >
                      <i className="fas fa-trash" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TabelaCategorias.propTypes = {
  categorias: arrayOf(
    shape({
      uuid: string.isRequired,
      nome: string.isRequired,
    }),
  ).isRequired,
  aoEditar: func.isRequired,
  aoExcluir: func,
};

TabelaCategorias.defaultProps = {
  aoExcluir: undefined,
};

export default TabelaCategorias;
