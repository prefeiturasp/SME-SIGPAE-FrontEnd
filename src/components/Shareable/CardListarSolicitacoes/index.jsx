import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import "./style.scss";
import { GESTAO_PRODUTO_CARDS, RELATORIO } from "../../../configs/constants";
import { caminhoURL } from "../CardStatusDeSolicitacao/helper";
import { conferidaClass } from "src/helpers/terceirizadas";
import TooltipProdutos from "./tooltipProdutos";
import { Websocket } from "src/services/websocket";
import { TIPO_PERFIL } from "src/constants/shared";
import TooltipDietasSimultaneas from "./tooltipoDietas";

export class CardListarSolicitacoes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      solicitacoes: this.props.solicitacoes,
      dietasAbertas: [],
    };

    const tipoPerfil = localStorage.getItem("tipo_perfil");
    if (
      props.titulo.toString().includes("Recebidas") &&
      tipoPerfil === TIPO_PERFIL.DIETA_ESPECIAL
    ) {
      this.initSocket();
    }
  }

  initSocket = () => {
    return new Websocket(
      "solicitacoes-abertas/",
      ({ data }) => {
        this.getDietasEspeciaisAbertas(JSON.parse(data));
      },
      () => this.initSocket(),
    );
  };

  getDietasEspeciaisAbertas = (content) => {
    content && this.setState({ dietasAbertas: content.message });
  };

  perfilDietaEspecial = () => {
    const tipoPerfil = localStorage.getItem("tipo_perfil");
    return tipoPerfil === TIPO_PERFIL.DIETA_ESPECIAL;
  };

  dietasFiltradas = (solicitacao) => {
    const { dietasAbertas } = this.state;

    return dietasAbertas.filter((dieta) =>
      solicitacao.link.includes(dieta.uuid_solicitacao),
    );
  };

  qtdDietasAbertas = (solicitacao) => {
    return this.dietasFiltradas(solicitacao).length;
  };

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
                              <span style={{ fontWeight: "bold" }}>
                                {value.text ||
                                  `${value.descricao} / ${value.escola_nome}`}

                                {this.perfilDietaEspecial() &&
                                  this.qtdDietasAbertas(value) > 0 && (
                                    <TooltipDietasSimultaneas
                                      quantidade={this.qtdDietasAbertas(value)}
                                    />
                                  )}
                              </span>
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
