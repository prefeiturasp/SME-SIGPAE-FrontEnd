import { gerarLinkRelatorio, talvezPluralizar } from "helpers/utilities";
import React, { Component } from "react";
import { Collapse } from "react-collapse";
import { Link } from "react-router-dom";
import {
  ALTERACAO_TIPO_ALIMENTACAO,
  ALTERACAO_TIPO_ALIMENTACAO_CEMEI,
} from "../../../../configs/constants";
import "../../../Shareable/style.scss";
import { ToggleExpandir } from "../../../Shareable/ToggleExpandir";
import { calcularNumeroDeEscolasUnicas } from "./helper";

export class CardPendenteAcao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      pedidosFiltrados: this.props.pedidos,
    };
    this.filtrarPedidos = this.filtrarPedidos.bind(this);
  }

  filtrarPedidos(event) {
    if (event === undefined) event = { target: { value: "" } };
    let pedidosFiltrados = this.props.pedidos;
    pedidosFiltrados = pedidosFiltrados.filter(function (item) {
      const palavraAFiltrar = event.target.value.toLowerCase();
      return (
        item.id_externo.toLowerCase().search(palavraAFiltrar) !== -1 ||
        item.escola.nome.toLowerCase().search(palavraAFiltrar) !== -1 ||
        item.escola.codigo_eol.includes(palavraAFiltrar)
      );
    });
    this.setState({ pedidosFiltrados });
  }

  render() {
    const { pedidos, titulo, tipoDeCard, ultimaColunaLabel, dataTestId } =
      this.props;
    const { collapsed, pedidosFiltrados } = this.state;
    return (
      <div className="card card-pendency-approval" data-testid={dataTestId}>
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
                  <th className="col-3">Código do Pedido</th>
                  <th className="col-3">Código EOL</th>
                  <th className="col-3">Nome da Escola</th>
                  <th className="col-3">{ultimaColunaLabel || "Data"}</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((pedido, key) => {
                  const dataMaisProxima =
                    pedido.inclusoes && pedido.inclusoes[0].data;
                  return (
                    <Link
                      key={key}
                      to={gerarLinkRelatorio(
                        pedido.alunos_cei_e_ou_emei
                          ? ALTERACAO_TIPO_ALIMENTACAO_CEMEI
                          : ALTERACAO_TIPO_ALIMENTACAO,
                        pedido
                      )}
                    >
                      <tr className="row">
                        <td className="col-3">{pedido.id_externo}</td>
                        <td className="col-3">{pedido.escola.codigo_eol}</td>
                        <td className="col-3">{pedido.escola.nome}</td>
                        <td className="col-3">
                          {pedido.data_inicial ||
                            pedido.alterar_dia ||
                            dataMaisProxima ||
                            pedido.data}
                        </td>
                      </tr>
                    </Link>
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
