import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { Collapse } from "react-collapse";
import "./style.scss";
import Botao from "../Botao";
import { BUTTON_TYPE, BUTTON_STYLE, BUTTON_ICON } from "../Botao/constants";
import { ToggleExpandir } from "../ToggleExpandir";

export class CardHistorico extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
    this.selecionarTodos = this.selecionarTodos.bind(this);
  }

  handleClickSubmit = () => {
    alert("it will be submited");
  };

  selecionarTodos() {
    if (this.props.pedidos) {
      this.props.pedidos.forEach((pedido) => {
        this.props.change(`check_${pedido.uuid}`, !this.props.selecionar_todos);
      });
    }
    this.props.change("selecionar_todos", !this.props.selecionar_todos);
  }
  render() {
    const { titulo, ultimaColunaLabel, pedidos, handleSubmit } = this.props;
    const { collapsed } = this.state;
    return (
      <div className="card card-history mt-3">
        <div className="card-header">
          <div className="row">
            <div className="col-11">
              <i className="fas fa-history me-2" />
              {titulo}
            </div>
            <div className="ps-5 col-1">
              <ToggleExpandir
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
                <div className="col-12 select-all">
                  <label htmlFor="selecionar_todos" className="checkbox-label">
                    <Field
                      component={"input"}
                      type="checkbox"
                      name="selecionar_todos"
                    />
                    <span
                      onClick={() => this.selecionarTodos()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          this.selecionarTodos();
                        }
                      }}
                      tabIndex={0}
                      className="checkbox-custom"
                    />
                    Selecionar todos
                  </label>
                  <div className="float-end">
                    <Botao
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.BLUE}
                      title="Imprimir solicitações selecionadas"
                      icon={BUTTON_ICON.PRINT}
                      className="float-end"
                    />
                  </div>
                </div>
              </div>
              <div className="pb-3" />
              <table className="table">
                <thead>
                  <tr>
                    <th>Nº Solicitação</th>
                    <th>Escola</th>
                    <th>
                      {ultimaColunaLabel ||
                        "Quantidade de Alimentações Solicitadas"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos &&
                    pedidos.map((pedido, key) => {
                      return (
                        <tr key={key}>
                          <td className="td-check">
                            <label
                              htmlFor={`check_${pedido.uuid}`}
                              className="checkbox-label"
                            >
                              <Field
                                component={"input"}
                                type="checkbox"
                                name={`check_${pedido.uuid}`}
                              />
                              <span
                                onClick={() =>
                                  this.props.change(
                                    `check_${pedido.uuid}`,
                                    true,
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    this.props.change(
                                      `check_${pedido.uuid}`,
                                      true,
                                    );
                                  }
                                }}
                                tabIndex={0}
                                className="checkbox-custom"
                              />
                            </label>
                            {pedido.id_externo}
                          </td>
                          <td>{pedido.escola.nome}</td>
                          <td>{pedido.data_inicial}</td>
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
