import { SolicitacoesSimilaresInclusao } from "components/Shareable/SolicitacoesSimilaresInclusao";
import { ToggleExpandir } from "components/Shareable/ToggleExpandir";
import {
  gerarLinkRelatorio,
  talvezPluralizar,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhDRE,
} from "helpers/utilities";
import { Fragment, useState } from "react";
import { Collapse } from "react-collapse";
import { Link } from "react-router-dom";
import { calcularNumeroDeEscolasUnicas, getDataMaisProxima } from "./helper";

export const CardPendenteAcao = ({ ...props }) => {
  const { titulo, tipoDeCard, pedidos, colunaDataLabel, dataTestId } = props;

  const [collapsed, setCollapsed] = useState(false);
  const [pedidosFiltrados, setPedidosFiltrados] = useState(pedidos);

  const collapseSolicitacaoSimilar = (indexPedido, indexSolicitacaoSimilar) => {
    setPedidosFiltrados((prevPedidos) =>
      prevPedidos.map((pedido, iPedido) => {
        if (iPedido !== indexPedido) return pedido;

        return {
          ...pedido,
          solicitacoes_similares: pedido.solicitacoes_similares.map(
            (sol, iSol) => ({
              ...sol,
              collapsed:
                iSol === indexSolicitacaoSimilar ? !sol.collapsed : false,
            })
          ),
        };
      })
    );
  };

  const filtrarPedidos = (filtro) => {
    const termo = filtro.toLowerCase();

    const pedidosFiltrados = pedidos.filter(({ id_externo, escola }) => {
      return (
        id_externo.toLowerCase().includes(termo) ||
        escola.nome.toLowerCase().includes(termo) ||
        escola.codigo_eol.includes(termo)
      );
    });

    setPedidosFiltrados(pedidosFiltrados);
  };

  const renderSolicitacoesSimilares = (idxPedido, pedido) => {
    return pedido.solicitacoes_similares.map((solicitacao, index) => {
      return (
        <p className="gatilho-style" key={index}>
          <i className="fa fa-info-circle me-1" aria-hidden="true" />
          <b>
            <Link
              style={{
                color: "#0c6b45",
              }}
              to={gerarLinkRelatorio(
                `inclusao-de-alimentacao${
                  solicitacao.dias_motivos_da_inclusao_cemei ? "-cemei" : ""
                }`,
                solicitacao
              )}
            >
              {`#${solicitacao.id_externo}`}
            </Link>
            <ToggleExpandir
              dataTestId={`${dataTestId}-toggle-expandir-${idxPedido}-${index}`}
              onClick={() => collapseSolicitacaoSimilar(idxPedido, index)}
              ativo={solicitacao.collapsed}
              className="icon-padding"
            />
          </b>
        </p>
      );
    });
  };

  return (
    <div
      className="card card-pendency-approval food-inclusion"
      data-testid={dataTestId}
    >
      <div className={"card-title " + tipoDeCard}>{titulo}</div>
      <div className="row">
        <div className="col-2">
          <div className={"order-box " + tipoDeCard}>
            <span className="number">{pedidos.length}</span>
            <span className="order">
              {pedidos.length === 1 ? "solicitação" : "solicitações"}
            </span>
          </div>
        </div>
        {pedidos.length > 0 && (
          <div className="col-9">
            <div className="order-lines">
              <div className="label" />
              <span className="text">
                <span className="value">
                  {calcularNumeroDeEscolasUnicas(pedidos)}{" "}
                </span>
                {`
                    ${talvezPluralizar(
                      calcularNumeroDeEscolasUnicas(pedidos),
                      "escola"
                    )} ${talvezPluralizar(
                  calcularNumeroDeEscolasUnicas(pedidos),
                  "solicitante"
                )}
                    `}
              </span>
            </div>
          </div>
        )}
        <div className="col-1">
          {pedidos.length > 0 && (
            <ToggleExpandir
              dataTestId={`toggle-expandir-${dataTestId}`}
              onClick={() => setCollapsed(!collapsed)}
              ativo={!collapsed}
            />
          )}
        </div>
      </div>
      <Collapse isOpened={!collapsed}>
        <div className="row">
          <div className="input-search-full-width col-12">
            <input
              type="text"
              data-testid={`input-pesquisar-${dataTestId}`}
              className="form-control"
              placeholder="Pesquisar"
              onChange={(event) => filtrarPedidos(event.target.value)}
            />
            <i className="fas fa-search inside-input" />
          </div>
          <table className="orders-table mt-4 ms-3 me-3">
            <thead>
              <tr className="row">
                <th className="col-2">Código do Pedido</th>
                <th className="col-2">Código EOL</th>
                <th className="col-3">Nome da Escola</th>
                <th className="col-3">{colunaDataLabel || "Data"}</th>
                {(usuarioEhCODAEGestaoAlimentacao() || usuarioEhDRE()) && (
                  <th className="col-2">Solic. Similares</th>
                )}
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido, key) => {
                return (
                  <Fragment key={key}>
                    <tr className="row">
                      <td className="col-2">
                        <Link
                          className="text-dark"
                          to={gerarLinkRelatorio(
                            `inclusao-de-alimentacao${
                              pedido.dias_motivos_da_inclusao_cemei
                                ? "-cemei"
                                : ""
                            }`,
                            pedido
                          )}
                        >
                          {pedido.id_externo}
                        </Link>
                      </td>
                      <td className="col-2">
                        <Link
                          className="text-dark"
                          to={gerarLinkRelatorio(
                            `inclusao-de-alimentacao${
                              pedido.dias_motivos_da_inclusao_cemei
                                ? "-cemei"
                                : ""
                            }`,
                            pedido
                          )}
                        >
                          {pedido.escola.codigo_eol}
                        </Link>
                      </td>
                      <td className="col-3">
                        <Link
                          className="text-dark"
                          to={gerarLinkRelatorio(
                            `inclusao-de-alimentacao${
                              pedido.dias_motivos_da_inclusao_cemei
                                ? "-cemei"
                                : ""
                            }`,
                            pedido
                          )}
                        >
                          {pedido.escola.nome}
                        </Link>
                      </td>
                      <td className="col-3">
                        <Link
                          className="text-dark"
                          to={gerarLinkRelatorio(
                            `inclusao-de-alimentacao${
                              pedido.dias_motivos_da_inclusao_cemei
                                ? "-cemei"
                                : ""
                            }`,
                            pedido
                          )}
                        >
                          {pedido.data_inicial || getDataMaisProxima(pedido)}
                        </Link>
                      </td>
                      {(usuarioEhCODAEGestaoAlimentacao() ||
                        usuarioEhDRE()) && (
                        <td className="col-2 solicitacao-consolidada-collapse">
                          {renderSolicitacoesSimilares(key, pedido)}
                        </td>
                      )}
                    </tr>
                    {(usuarioEhCODAEGestaoAlimentacao() || usuarioEhDRE()) &&
                      pedido.solicitacoes_similares.map(
                        (s, idxSolicitacaoSimilar) => {
                          return (
                            <SolicitacoesSimilaresInclusao
                              key={idxSolicitacaoSimilar}
                              solicitacao={s}
                              index={idxSolicitacaoSimilar}
                            />
                          );
                        }
                      )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Collapse>
    </div>
  );
};
