import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { Collapse } from "react-collapse";
import { Navigate } from "react-router-dom";
import {
  SOLICITACAO_KIT_LANCHE,
  RELATORIO,
} from "../../../../configs/constants";
import { ToggleExpandir } from "../../../Shareable/ToggleExpandir";
import Botao from "../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "../../../Shareable/Botao/constants";

export class CardHistorico extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      pedidos: [],
      redirect: false,
    };
    this.selecionarTodos = this.selecionarTodos.bind(this);
  }

  componentDidMount() {
    this.setState({
      pedidos: this.props.pedidos,
    });
  }

  onCheckClicked(key) {
    let pedidos = this.state.pedidos;
    pedidos[key].checked = !pedidos[key].checked;
    this.props.change(`check_${key}`, pedidos[key].checked);
    this.setState({ pedidos });
  }

  // TODO: chamar "imprimir" quando tiver endpoint definido
  handleClickSubmit = () => {};

  selecionarTodos() {
    this.props.pedidos.forEach((_, key) => {
      this.props.change(`check_${key}`, !this.props.selecionar_todos);
    });
    this.props.change("selecionar_todos", !this.props.selecionar_todos);
  }

  setRedirect() {
    this.setState({ redirect: true });
  }

  redirectTo(pedido) {
    if (this.state.redirect) {
      return (
        <Navigate
          to={`/${SOLICITACAO_KIT_LANCHE}/${RELATORIO}?uuid=${pedido.uuid}`}
        />
      );
    }
  }

  render() {
    const { titulo, ultimaColunaLabel, handleSubmit } = this.props;
    const { collapsed, pedidos } = this.state;
    return (
      <div className="card mt-3">
        <div className="card-header">
          <div className="row">
            <div className="col-11">
              <i className="fas fa-history me-2" />
              {titulo}
            </div>
            <div className="ps-5 col-1">
              <ToggleExpandir
                dataTestId="botao-expandir"
                onClick={() => this.setState({ collapsed: !collapsed })}
                ativo={!collapsed}
              />
            </div>
          </div>
        </div>
        <Collapse isOpened={!collapsed}>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 select-all historic">
                  <label
                    htmlFor="selecionar_todos"
                    className="checkbox-label small"
                  >
                    <Field
                      component={"input"}
                      type="checkbox"
                      name="selecionar_todos"
                    />
                    <span
                      onClick={() => this.selecionarTodos()}
                      className="checkbox-custom small"
                    />
                    Selecionar todos
                  </label>
                  <Botao
                    dataTestId="botao-imprimir"
                    type={BUTTON_TYPE.BUTTON}
                    titulo="imprimir"
                    style={BUTTON_STYLE.BLUE}
                    icon={BUTTON_ICON.PRINT}
                    className="float-end"
                  />
                </div>
              </div>
              <div className="pb-3" />
              <table className="table table-historic w-100">
                <thead>
                  <tr className="row">
                    <th className="col-4">ID do Pedido</th>
                    <th className="col-4">Escola</th>
                    <th className="col-4">{ultimaColunaLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length > 0 &&
                    pedidos.map((pedido, key) => {
                      return (
                        <tr key={key} className="row c-pointer">
                          {this.redirectTo(pedido)}
                          <td className="td-check col-4">
                            <label
                              htmlFor={`check_${key}`}
                              className="checkbox-label small report-line"
                            >
                              <Field
                                component={"input"}
                                type="checkbox"
                                name={`check_${key}`}
                              />
                              <span
                                onClick={() => this.onCheckClicked(key)}
                                className="checkbox-custom small report-line"
                              />
                            </label>
                            <span onClick={() => this.setRedirect()}>
                              {pedido.id_externo}
                            </span>
                          </td>
                          <td
                            onClick={() => this.setRedirect()}
                            className="col-4"
                          >
                            {pedido.escola.nome}
                          </td>
                          <td
                            onClick={() => this.setRedirect()}
                            className="col-4"
                          >
                            {pedido.solicitacao_kit_lanche.data}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </form>
          </div>
        </Collapse>
      </div>
    );
  }
}

const CardHistoricoForm = reduxForm({
  form: "cardHistoricoForm",
  enableReinitialize: true,
})(CardHistorico);

const selector = formValueSelector("cardHistoricoForm");
const mapStateToProps = (state) => {
  return {
    selecionar_todos: selector(state, "selecionar_todos"),
  };
};

export default connect(mapStateToProps)(CardHistoricoForm);
