import React, { Fragment } from "react";
import { acionaComEnterOuEspaco } from "src/helpers/utilities";
import "./style.scss";
import { NOME_STATUS } from "./helpers";
import { DadosReclamacaoProduto } from "../DadosReclamacao";
import { Botoes } from "../Botoes";

export const TabelaProdutos = ({
  produtos,
  exibirDadosProduto,
  verProduto,
  setVerProduto,
  setModal,
  setProdutoAAtualizar,
  nomeDoProduto,
  setPropsPageProduto,
}) => {
  return (
    <div className="tabela-lista-produtos">
      {produtos && (
        <Fragment>
          <h2>
            {nomeDoProduto
              ? `Veja os resultados para: "${nomeDoProduto}"`
              : "Veja os resultados para a busca:"}
          </h2>
          <table>
            <thead>
              <tr className="row">
                <th className="col-3">Nome do Produto</th>
                <th className="col-2">Marca</th>
                <th className="col-3">Fabricante</th>
                <th className="col-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 && (
                <div className="p-3">Nenhum resultado encontrado.</div>
              )}
              {produtos.map((produto, key) => {
                return [
                  <tr
                    className={`row ${
                      key - 1 >= 0 && produtos[key - 1].exibir
                        ? "active"
                        : undefined
                    }`}
                    key={key}
                  >
                    <td className="col-3">{produto.nome}</td>
                    <td className="col-2">
                      {produto.marca && produto.marca.nome}
                    </td>
                    <td className="col-3">
                      {produto.fabricante && produto.fabricante.nome}
                    </td>
                    <td className="col-4">
                      {produto.ultima_homologacao &&
                        NOME_STATUS[produto.ultima_homologacao.status]}
                      <i
                        className={`fas fa-${
                          produto.exibir ? "angle-up" : "angle-down"
                        }`}
                        role="button"
                        tabIndex={0}
                        aria-expanded={Boolean(produto.exibir)}
                        onClick={() => exibirDadosProduto(key)}
                        onKeyDown={(e) =>
                          acionaComEnterOuEspaco(e, () =>
                            exibirDadosProduto(key),
                          )
                        }
                      />
                    </td>
                  </tr>,
                  produto.exibir && (
                    <Fragment>
                      <DadosReclamacaoProduto produto={produto} />
                      <Botoes
                        produto={produto}
                        verUnicoProduto={verProduto}
                        setVerProduto={setVerProduto}
                        setModal={setModal}
                        setProdutoAAtualizar={setProdutoAAtualizar}
                        setPropsPageProduto={setPropsPageProduto}
                      />
                    </Fragment>
                  ),
                ];
              })}
            </tbody>
          </table>
        </Fragment>
      )}
    </div>
  );
};
