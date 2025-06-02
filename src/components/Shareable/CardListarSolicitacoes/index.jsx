import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import "./style.scss";
import { GESTAO_PRODUTO_CARDS, RELATORIO } from "../../../configs/constants";
import { caminhoURL } from "../CardStatusDeSolicitacao/helper";
import { conferidaClass } from "src/helpers/terceirizadas";
import TooltipProdutos from "./tooltipProdutos";

export class CardListarSolicitacoes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitacoes: this.props.solicitacoes,
    };
  }

  render() {
    const { titulo, tipo, solicitacoes, icone } = this.props;
    return (
      <Fragment>
        <div className={`card card-list-panel card-colored ${tipo} mb-4 me-4`}>
          <div className="card-title-status">
            <i className={"fas " + icone} />
            {titulo}
            <span className="float-end pe-4">Data/Hora</span>
          </div>
          <hr />
          <div className="card-body card-body-sme">
            <div className="card-listagem-solicitacoes">
              {solicitacoes &&
                solicitacoes.map((value, key) => {
                  let conferida = conferidaClass(value, titulo);
                  return (
                    <div key={key} className="row">
                      <div className="col-9">
                        <NavLink
                          key={key}
                          to={
                            value.link ||
                            `${caminhoURL(value.tipo_doc)}/${RELATORIO}?uuid=${
                              value.uuid
                            }&ehInclusaoContinua=${
                              value.tipo_doc === "INC_ALIMENTA_CONTINUA"
                            }`
                          }
                        >
                          <p className={`data ms-4 ${conferida}`}>
                            {[
                              GESTAO_PRODUTO_CARDS.HOMOLOGADOS,
                              GESTAO_PRODUTO_CARDS.PRODUTOS_SUSPENSOS,
                            ].includes(titulo) ? (
                              <TooltipProdutos
                                cardTitulo={titulo}
                                solicitacao={value}
                              />
                            ) : (
                              value.text ||
                              `${value.descricao} / ${value.escola_nome}`
                            )}
                          </p>
                        </NavLink>
                      </div>
                      <span className={`date-time col-3 text-end ${conferida}`}>
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
