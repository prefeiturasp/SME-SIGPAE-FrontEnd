import React, { Component, Fragment } from "react";
import { Field } from "redux-form";
import { NavLink } from "react-router-dom";
import { Checkbox } from "../Checkbox";
import "./style.scss";
import { RELATORIO } from "../../../configs/constants";
import { caminhoURL } from "../CardStatusDeSolicitacao/helper";
import { conferidaClass } from "helpers/terceirizadas";

export class CardListarSolicitacoes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitacoes: this.props.solicitacoes
    };
  }

  render() {
    const {
      titulo,
      tipo,
      selecionarTodos,
      solicitacoes,
      icone,
      onCheckClicked
    } = this.props;
    return (
      <Fragment>
        <div className={`card card-list-panel card-colored ${tipo} mb-4 mr-4`}>
          <div className="card-title-status">
            <i className={"fas " + icone} />
            {titulo}
            <span className="float-right pr-4">Data/Hora</span>
          </div>
          <hr />
          <div className="card-body card-body-sme">
            <Field
              className="small"
              component={Checkbox}
              name="selecionar_todos"
              onClick={() => selecionarTodos(solicitacoes)}
            >
              <p className="data ml-4">{"Selecionar todos"}</p>
            </Field>
            <div className="card-listagem-solicitacoes">
              {solicitacoes.map((value, key) => {
                let conferida = conferidaClass(value, titulo);
                return (
                  <div key={key} className="row">
                    <div className="col-9">
                      <Field
                        className="small"
                        component={Checkbox}
                        name={`check_${key}`}
                        onClick={() => onCheckClicked(solicitacoes, key)}
                      >
                        <NavLink
                          key={key}
                          to={
                            value.link ||
                            `${caminhoURL(value.tipo_doc)}/${RELATORIO}?uuid=${
                              value.uuid
                            }&ehInclusaoContinua=${value.tipo_doc ===
                              "INC_ALIMENTA_CONTINUA"}`
                          }
                        >
                          <p className={`data ml-4 ${conferida}`}>
                            {value.text}
                          </p>
                        </NavLink>
                      </Field>
                    </div>
                    <span className={`date-time col-3 text-right ${conferida}`}>
                      {value.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pb-3" />
        </div>
      </Fragment>
    );
  }
}

export default CardListarSolicitacoes;
