import React, { Component } from "react";
import { Collapse } from "react-collapse";
import { Link } from "react-router-dom";
import { calcularNumeroDeEscolasUnicas } from "./helper";
import {
  talvezPluralizar,
  ehEscolaTipoCEI,
  ehEscolaTipoCEMEI,
  deepCopy,
} from "../../../../helpers/utilities";
import {
  SOLICITACAO_KIT_LANCHE,
  SOLICITACAO_KIT_LANCHE_CEMEI,
} from "../../../../configs/constants";
import { ToggleExpandir } from "../../../Shareable/ToggleExpandir";
import { TIPO_SOLICITACAO } from "src/constants/shared";
import { SolicitacoesSimilaresKitLanche } from "src/components/Shareable/SolicitacoesSimilaresKitLanche";

const { SOLICITACAO_CEI, SOLICITACAO_NORMAL, SOLICITACAO_CEMEI } =
  TIPO_SOLICITACAO;

export class CardPendenteAcao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      pedidosFiltrados: this.props.pedidos.map((solicitacao) => {
        solicitacao["solicitacoes_similares"] =
          solicitacao.solicitacoes_similares.map((sol_similar) => {
            sol_similar["collapsed"] = true;
            return sol_similar;
          });
        return solicitacao;
      }),
    };
    this.filtrarPedidos = this.filtrarPedidos.bind(this);
    this.collapseSolicitacaoSimilar =
      this.collapseSolicitacaoSimilar.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.pedidos.length !== prevProps.pedidos.length) {
      this.setState({ pedidosFiltrados: this.props.pedidos });
    }
  }

  collapseSolicitacaoSimilar(idxSolicitacao, idxSolicitacaoSimilar) {
    const { pedidosFiltrados } = this.state;
    let _pedidosFiltrados = deepCopy(pedidosFiltrados);
    let estadoAtual =
      _pedidosFiltrados[idxSolicitacao].solicitacoes_similares[
        idxSolicitacaoSimilar
      ].collapsed;
    _pedidosFiltrados[idxSolicitacao].solicitacoes_similares[
      idxSolicitacaoSimilar
    ].collapsed = !estadoAtual;
    this.setState({ pedidosFiltrados: _pedidosFiltrados });
  }

  filtrarPedidos(event) {
    if (event === undefined) event = { target: { value: "" } };
    let pedidosFiltrados = this.props.pedidos;
    pedidosFiltrados = pedidosFiltrados.filter(function (item) {
      const palavraAFiltrar = event.target.value.toLowerCase();
      return (
        item.id_externo.toLowerCase().includes(palavraAFiltrar) ||
        item.escola.nome.toLowerCase().search(palavraAFiltrar) !== -1 ||
        item.escola.codigo_eol.includes(palavraAFiltrar)
      );
    });
    this.setState({ pedidosFiltrados });
  }

  render() {
    const { pedidos, titulo, tipoDeCard, ultimaColunaLabel } = this.props;
    const { collapsed, pedidosFiltrados } = this.state;
    return (
      <div className="card card-pendency-approval meal-kit-solicitation">
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
                onClick={() => this.setState({ collapsed: !collapsed })}
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
                className="form-control"
                placeholder="Pesquisar"
                onChange={this.filtrarPedidos}
              />
              <i className="fas fa-search inside-input" />
            </div>
            <table className="orders-table mt-4 ms-3 me-3">
              <thead>
                <tr className="row">
                  <th className="col-2">Código do Pedido</th>
                  <th className="col-2">Código EOL</th>
                  <th className="col-3">Nome da Escola</th>
                  <th className="col-3">{ultimaColunaLabel || "Data"}</th>
                  <th className="col-2">Solic. Similares</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.length > 0 &&
                  pedidosFiltrados.map((pedido, key) => {
                    const tipoSolicitacao = ehEscolaTipoCEI(pedido.escola)
                      ? SOLICITACAO_CEI
                      : ehEscolaTipoCEMEI(pedido.escola)
                      ? SOLICITACAO_CEMEI
                      : SOLICITACAO_NORMAL;
                    const solicitacaoUrl = ehEscolaTipoCEMEI(pedido.escola)
                      ? SOLICITACAO_KIT_LANCHE_CEMEI
                      : SOLICITACAO_KIT_LANCHE;
                    return (
                      <>
                        <tr className="row">
                          <td className="col-2">
                            <Link
                              className="text-dark"
                              key={key}
                              to={`/${solicitacaoUrl}/relatorio?uuid=${pedido.uuid}&tipoSolicitacao=${tipoSolicitacao}`}
                            >
                              {pedido.id_externo}
                            </Link>
                          </td>
                          <td className="col-2">
                            <Link
                              className="text-dark"
                              key={key}
                              to={`/${solicitacaoUrl}/relatorio?uuid=${pedido.uuid}&tipoSolicitacao=${tipoSolicitacao}`}
                            >
                              {pedido.escola.codigo_eol}
                            </Link>
                          </td>
                          <td className="col-3">
                            <Link
                              className="text-dark"
                              key={key}
                              to={`/${solicitacaoUrl}/relatorio?uuid=${pedido.uuid}&tipoSolicitacao=${tipoSolicitacao}`}
                            >
                              {pedido.escola.nome}
                            </Link>
                          </td>
                          <td className="col-3">
                            <Link
                              className="text-dark"
                              key={key}
                              to={`/${solicitacaoUrl}/relatorio?uuid=${pedido.uuid}&tipoSolicitacao=${tipoSolicitacao}`}
                            >
                              {pedido.solicitacao_kit_lanche
                                ? pedido.solicitacao_kit_lanche.data
                                : pedido.data}
                            </Link>
                          </td>
                          <td className="col-2 solicitacao-consolidada-collapse">
                            {pedido.solicitacoes_similares.length ? (
                              pedido.solicitacoes_similares.map(
                                (s, idxSolicitacaoSimilar) => {
                                  return (
                                    <p
                                      className="gatilho-style"
                                      key={idxSolicitacaoSimilar}
                                    >
                                      <i
                                        className="fa fa-info-circle me-1"
                                        aria-hidden="true"
                                      />
                                      <b>
                                        {`#${s.id_externo}`}
                                        <ToggleExpandir
                                          onClick={() =>
                                            this.collapseSolicitacaoSimilar(
                                              key,
                                              idxSolicitacaoSimilar
                                            )
                                          }
                                          ativo={!s.collapsed}
                                          className="icon-padding"
                                        />
                                      </b>
                                    </p>
                                  );
                                }
                              )
                            ) : (
                              <p />
                            )}
                          </td>
                        </tr>
                        {pedido.solicitacoes_similares.length > 0 &&
                          pedido.solicitacoes_similares.map(
                            (s, idxSolicitacaoSimilar) => {
                              return (
                                <SolicitacoesSimilaresKitLanche
                                  key={idxSolicitacaoSimilar}
                                  solicitacao={s}
                                  index={idxSolicitacaoSimilar}
                                />
                              );
                            }
                          )}
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Collapse>
      </div>
    );
  }
}
